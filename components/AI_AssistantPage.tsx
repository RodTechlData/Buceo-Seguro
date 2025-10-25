
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, Blob, LiveSession, LiveServerMessage, FunctionDeclaration, Type } from '@google/genai';
import { Diver, DiveLog, DiverStatus } from '../types';

// Base64 encoding/decoding functions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// Function Declarations for Gemini
const getOperatingDiverCountDeclaration: FunctionDeclaration = {
    name: 'getOperatingDiverCount',
    description: 'Obtiene el número de buzos que están actualmente activos o buceando.',
    parameters: { type: Type.OBJECT, properties: {} }
};

const getDiverLogStatusDeclaration: FunctionDeclaration = {
    name: 'getDiverLogStatus',
    description: 'Verifica el estado de la bitácora de un buzo específico para el día de hoy.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            diverName: {
                type: Type.STRING,
                description: 'El nombre del buzo a consultar.'
            }
        },
        required: ['diverName']
    }
};

interface AI_AssistantPageProps {
    divers: Diver[];
    diveLogs: DiveLog[];
}

const AI_AssistantPage: React.FC<AI_AssistantPageProps> = ({ divers, diveLogs }) => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Listo para conversar.');
    const [transcripts, setTranscripts] = useState<{user: string, model: string}[]>([]);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // --- Tool Functions ---
    const getOperatingDiverCount = () => {
        const operatingDivers = divers.filter(
            d => d.status === DiverStatus.Diving || d.status === DiverStatus.Active
        ).length;
        return { count: operatingDivers };
    };

    const getDiverLogStatus = (args: { diverName?: string }) => {
        const diverName = args.diverName;
        if (!diverName) {
            return { status: "Por favor, especifica el nombre del buzo." };
        }

        const diver = divers.find(d => d.name.toLowerCase().includes(diverName.toLowerCase()));
        if (!diver) {
            return { status: `No se encontró al buzo llamado ${diverName}.` };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const latestLog = diveLogs
            .filter(log => log.divers.includes(diver.name) || log.supervisor === diver.name)
            .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

        if (latestLog) {
            const logDate = new Date(latestLog.date);
            logDate.setHours(0,0,0,0);
            if (logDate.getTime() >= today.getTime()) {
                 return { status: `Sí, ${diver.name} registró una bitácora hoy. No hay un estado de "aprobación" en el sistema, pero está registrada.` };
            } else {
                 return { status: `La última bitácora de ${diver.name} fue el ${latestLog.date.toLocaleDateString()}. No hay registro para hoy.` };
            }
        }
        
        return { status: `No se encontraron bitácoras para ${diver.name}.` };
    };
    
    const availableTools = {
        getOperatingDiverCount,
        getDiverLogStatus,
    };
    
    // Cleanup function to stop all tracks and disconnect resources
    const cleanup = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close()).catch(console.error);
            sessionPromiseRef.current = null;
        }
    };

    const startSession = async () => {
        setStatusMessage('Iniciando sesión...');
        setTranscripts([]);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let nextStartTime = 0;
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
            const outputNode = outputAudioContext.createGain();
            outputNode.connect(outputAudioContext.destination);
            const sources = new Set<AudioBufferSourceNode>();

            let currentInputTranscription = '';
            let currentOutputTranscription = '';

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsSessionActive(true);
                        setStatusMessage('Conectado. ¡Puedes empezar a hablar!');
                        const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputTranscription.trim();
                            const fullOutput = currentOutputTranscription.trim();
                            if(fullInput || fullOutput) {
                                setTranscripts(prev => [...prev, {user: fullInput || "...", model: fullOutput || "..."}]);
                            }
                            currentInputTranscription = '';
                            currentOutputTranscription = '';
                        }
                        
                        if (message.toolCall) {
                            for (const fc of message.toolCall.functionCalls) {
                                const toolFn = availableTools[fc.name as keyof typeof availableTools];
                                if (toolFn) {
                                    const result = toolFn(fc.args);
                                    sessionPromiseRef.current?.then((session) => {
                                        session.sendToolResponse({
                                            functionResponses: {
                                                id: fc.id,
                                                name: fc.name,
                                                response: { result: result },
                                            }
                                        });
                                    });
                                }
                            }
                        }

                        const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64EncodedAudioString) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => sources.delete(source));
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.add(source);
                        }
                        if (message.serverContent?.interrupted) {
                            for (const source of sources.values()) {
                                source.stop();
                                sources.delete(source);
                            }
                            nextStartTime = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setStatusMessage(`Error de conexión: ${e.message}`);
                        setIsSessionActive(false);
                        cleanup();
                    },
                    onclose: () => {
                        setStatusMessage('Sesión cerrada.');
                        setIsSessionActive(false);
                        // No need for cleanup() here as it's called on stop or error
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'Eres un asistente experto en buceo profesional y seguridad marina. Responde en español de forma concisa y amigable. Puedes usar las herramientas disponibles para responder preguntas sobre el estado actual de la operación, como el número de buzos operativos o el estado de sus bitácoras.',
                    tools: [{ functionDeclarations: [getOperatingDiverCountDeclaration, getDiverLogStatusDeclaration] }],
                },
            });

        } catch (error: any) {
            console.error('Failed to start session:', error);
            setStatusMessage(`Error: ${error.message}`);
            setIsSessionActive(false);
        }
    };

    const stopSession = () => {
        setStatusMessage('Cerrando sesión...');
        cleanup();
    };



    useEffect(() => {
        // Cleanup on component unmount
        return () => cleanup();
    }, []);

    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-2">Asistente de IA por Voz</h1>
            <p className="text-brand-accent mb-6">Converse en tiempo real con Gemini. Pregunte sobre procedimientos, seguridad o datos de buceo.</p>
            
            <div className="flex flex-col items-center justify-center gap-6 mb-6">
                <button 
                    onClick={isSessionActive ? stopSession : startSession} 
                    className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 shadow-lg border-4 ${
                        isSessionActive 
                        ? 'bg-red-500/80 border-red-400 hover:bg-red-500'
                        : 'bg-brand-interactive border-brand-interactive-hover hover:bg-brand-interactive-hover'
                    }`}
                >
                    {isSessionActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                    {isSessionActive ? 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    }
                </button>
                <p className="text-brand-light font-semibold">{statusMessage}</p>
            </div>
            
            <div className="flex-grow bg-brand-secondary p-4 rounded-2xl border border-brand-tertiary shadow-lg overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">Transcripción</h2>
                <div className="space-y-4">
                    {transcripts.length === 0 ? (
                        <p className="text-brand-accent text-center py-8">La transcripción aparecerá aquí.</p>
                    ) : (
                        transcripts.map((t, index) => (
                            <div key={index} className="animate-fade-in">
                                <div className="flex items-start gap-3 justify-end">
                                    <div className="bg-brand-interactive/20 p-3 rounded-lg max-w-lg">
                                        <p className="text-white">{t.user}</p>
                                    </div>
                                    <div className="bg-brand-tertiary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">TÚ</div>
                                </div>
                                <div className="flex items-start gap-3 mt-2">
                                    <div className="bg-brand-tertiary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">IA</div>
                                    <div className="bg-brand-tertiary/60 p-3 rounded-lg max-w-lg">
                                        <p className="text-brand-light">{t.model}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AI_AssistantPage;
