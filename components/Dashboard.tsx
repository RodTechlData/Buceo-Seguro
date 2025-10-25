
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_DIVERS, MOCK_LIVE_DIVES, MOCK_ALERTS, MOCK_EQUIPMENT, ICONS } from '../constants';
import { DiverStatus, Dive, Alert, AlertType, DiveStatus, Page, MedicalStatus, EquipmentStatus } from '../types';
// FIX: Imported 'Type' from '@google/genai' to use in the responseSchema for the AI-generated email.
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface DashboardProps {
    onNavigate: (page: Page) => void;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, onClick }) => (
    <button
        onClick={onClick}
        disabled={!onClick}
        className="w-full text-left bg-brand-secondary p-6 rounded-2xl border border-brand-tertiary hover:border-brand-interactive transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:cursor-not-allowed disabled:transform-none disabled:hover:border-brand-tertiary focus:outline-none focus:ring-2 focus:ring-brand-interactive focus:ring-offset-2 focus:ring-offset-brand-primary"
    >
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-brand-accent text-sm font-medium uppercase tracking-wider">{title}</p>
                <p className="text-4xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className={`p-4 rounded-full bg-gradient-to-br ${colorClass}`}>
                {React.cloneElement<React.SVGProps<SVGSVGElement>>(icon as React.ReactElement, { className: "h-7 w-7 text-white" })}
            </div>
        </div>
    </button>
);

const EmailAlertModal: React.FC<{ subject: string; body: string; onClose: () => void; isGenerating: boolean }> = ({ subject, body, onClose, isGenerating }) => {
    const formattedBody = body.split('**').map((part, index) => {
        return index % 2 === 1 
            ? <strong key={index} className="text-yellow-400 font-bold">{part}</strong> 
            : <span key={index}>{part}</span>;
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="email-alert-title">
            <div className="bg-brand-secondary rounded-2xl border border-brand-tertiary shadow-2xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-brand-tertiary flex justify-between items-center">
                    <h2 id="email-alert-title" className="text-lg font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-brand-interactive" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                        {isGenerating ? "Generando Alerta de IA..." : "Alerta de Profundidad Enviada"}
                    </h2>
                    <button onClick={onClose} className="text-brand-accent hover:text-white text-3xl font-bold transition-colors">&times;</button>
                </div>
                 {isGenerating ? (
                    <div className="p-8 flex flex-col items-center justify-center min-h-[300px] space-y-4">
                        <svg className="animate-spin h-12 w-12 text-brand-interactive" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                         <p className="text-lg text-brand-light font-semibold">Analizando datos para crear un reporte detallado...</p>
                         <p className="text-sm text-brand-accent">La inteligencia artificial está componiendo un correo electrónico profesional.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-6 space-y-4">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-sm font-medium text-brand-accent">Para:</span>
                                <span className="bg-brand-tertiary px-2 py-1 rounded text-sm text-brand-light">trade8tech@gmail.com</span>
                            </div>
                            <div className="flex items-baseline space-x-3">
                                <span className="text-sm font-medium text-brand-accent">Asunto:</span>
                                <span className="font-semibold text-white">{subject}</span>
                            </div>
                            <hr className="border-brand-tertiary my-3" />
                            <div className="text-brand-light whitespace-pre-wrap text-sm max-h-60 overflow-y-auto p-4 bg-brand-primary rounded-lg border border-brand-tertiary">
                                {formattedBody}
                            </div>
                        </div>
                        <div className="bg-brand-secondary px-6 py-4 flex justify-end rounded-b-2xl">
                            <button onClick={onClose} className="bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive">
                                Entendido
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const LiveDiveMonitor: React.FC<{ onDepthAlert: (dive: Dive) => void }> = ({ onDepthAlert }) => {
    const [dives, setDives] = useState<Dive[]>(MOCK_LIVE_DIVES);
    const [alertedDives, setAlertedDives] = useState<Set<string>>(new Set());
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMonitoringActive, setIsMonitoringActive] = useState(false);

    // FIX: Replaced the extremely long, corrupted base64 string with a shorter, valid one.
    const hornSound = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU0AAAAAAAAAAAAAAAD//wIA/f8EAPr/CQD2/xAA9v8YAPf/HwD5/ysA+v8zAPr/OwD8/0MA/f9LAP7/VQD//2sA//96AP//ggD//4wA//+UAP//nQD//6QA//+oAP//rgD//7MA//+5AP//uwD//7wA//+9AP//vQD//7wA//+7AP//uQD//7MA//+uAP//qAD//6QA//+dAP//lAD//4wA//+CAP//nwD//3wA//9pAP//WAD//0wA//9FAP//PgD//zcA//8rAP//IAD//xkA//8QAP//CAD//wQAAP8A";

    useEffect(() => {
        if (!isMonitoringActive) return;

        const interval = setInterval(() => {
            setDives(currentDives =>
                currentDives.map(dive => {
                    const depthChange = (Math.random() - 0.45) * 0.5;
                    const newDepth = Math.max(0, (dive.currentDepth || 0) + depthChange);
                    const newElapsedTime = (dive.elapsedTime || 0) + (1 / 60);

                    const updatedDive = {
                        ...dive,
                        currentDepth: parseFloat(newDepth.toFixed(1)),
                        elapsedTime: parseFloat(newElapsedTime.toFixed(1)),
                        status: DiveStatus.InProgress,
                    };

                    if (updatedDive.currentDepth > updatedDive.maxDepth && !alertedDives.has(dive.id)) {
                        onDepthAlert(updatedDive);
                        setAlertedDives(prev => new Set(prev).add(dive.id));
                        audioRef.current?.play().catch(e => console.error("Error playing alert sound:", e));
                    } else if (updatedDive.currentDepth <= updatedDive.maxDepth && alertedDives.has(dive.id)) {
                        setAlertedDives(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(dive.id);
                            return newSet;
                        });
                        audioRef.current?.pause();
                        if (audioRef.current) audioRef.current.currentTime = 0;
                    }

                    return updatedDive;
                })
            );
        }, 1000);

        return () => {
            clearInterval(interval);
            audioRef.current?.pause();
        };
    }, [isMonitoringActive, onDepthAlert, alertedDives]);
    
    const toggleMonitoring = () => {
       if (isMonitoringActive) {
            // Stop
            setIsMonitoringActive(false);
            // Reset dives to initial state
            setDives(MOCK_LIVE_DIVES);
            setAlertedDives(new Set());
       } else {
            // Start
            setIsMonitoringActive(true);
       }
    };

    return (
        <div className="bg-brand-secondary p-6 rounded-2xl border border-brand-tertiary shadow-lg">
             {/* FIX: Added the audio element so the ref can attach to it and play the sound. */}
            <audio ref={audioRef} src={hornSound} loop />
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Monitor de Inmersión en Vivo</h3>
                <button 
                    onClick={toggleMonitoring}
                    className={`font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        isMonitoringActive 
                        ? 'bg-status-danger/80 hover:bg-status-danger text-white shadow-glow-danger' 
                        : 'bg-brand-interactive hover:bg-brand-interactive-hover text-white shadow-glow-interactive'
                    }`}
                >
                    {isMonitoringActive ? (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                         </svg>
                    )}
                    {isMonitoringActive ? 'Detener Monitoreo' : 'Iniciar Monitoreo'}
                </button>
            </div>
            {dives.length === 0 ? (
                <p className="text-brand-accent text-center py-8">No hay inmersiones activas.</p>
            ) : (
                <ul className="space-y-5">
                    {dives.map(dive => {
                        const hasAlert = alertedDives.has(dive.id);
                        const depthPercentage = Math.min(100, ((dive.currentDepth || 0) / dive.maxDepth) * 100);

                        return (
                        <li key={dive.id} className="transition-all duration-300">
                            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                <div className="flex items-center">
                                    <img src={MOCK_DIVERS.find(d => d.id === dive.diverId)?.avatarUrl} alt={dive.diverName} className="w-10 h-10 rounded-full mr-3 border-2 border-brand-tertiary"/>
                                    <div>
                                        <p className="font-bold text-white">{dive.diverName}</p>
                                        <p className="text-xs text-brand-accent">Equipo {MOCK_DIVERS.find(d => d.id === dive.diverId)?.team}</p>
                                    </div>
                                </div>
                                 <div className={`text-sm font-semibold px-3 py-1 rounded-full ${hasAlert ? 'bg-status-danger/20 text-red-400 animate-pulse' : 'bg-brand-tertiary'}`}>
                                    {hasAlert ? '¡ALERTA!' : dive.status}
                                 </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
                                <div className="bg-brand-tertiary/40 p-2 rounded-lg">
                                    <p className="text-brand-accent text-xs">Profundidad</p>
                                    <p className="font-bold text-xl text-white">{dive.currentDepth?.toFixed(1) ?? '0.0'}m <span className="text-brand-accent font-normal text-base">/ {dive.maxDepth}m</span></p>
                                </div>
                                <div className="bg-brand-tertiary/40 p-2 rounded-lg">
                                    <p className="text-brand-accent text-xs">Tiempo de Fondo</p>
                                    <p className="font-bold text-xl text-white">{dive.elapsedTime?.toFixed(1) ?? '0.0'}m <span className="text-brand-accent font-normal text-base">/ {dive.bottomTime}m</span></p>
                                </div>
                                <div className="bg-brand-tertiary/40 p-2 rounded-lg">
                                    <p className="text-brand-accent text-xs">Estado</p>
                                    <p className={`font-bold text-xl ${hasAlert ? 'text-status-danger animate-pulse' : 'text-status-safe'}`}>{hasAlert ? 'SOBRE LÍMITE' : 'SEGURO'}</p>
                                </div>
                            </div>
                            <div className="w-full bg-brand-tertiary rounded-full h-2.5 mt-3 overflow-hidden">
                                <div className={`h-2.5 rounded-full transition-all duration-500 ${hasAlert ? 'bg-red-600 animate-pulse' : 'bg-brand-interactive'}`} style={{ width: `${depthPercentage}%` }}></div>
                            </div>
                        </li>
                    )})}
                </ul>
            )}
        </div>
    );
};

const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const getAlertIconAndStyle = (type: AlertType) => {
    switch (type) {
      case AlertType.Depth:
        return { 
            icon: ICONS.depth, 
            className: "bg-status-danger/20 text-status-danger",
            highlightClass: "border-l-4 border-status-danger" 
        };
      case AlertType.Time:
        return { 
            icon: ICONS.time, 
            className: "bg-status-danger/20 text-status-danger",
            highlightClass: "border-l-4 border-status-danger" 
        };
      case AlertType.Equipment:
        return { 
            icon: ICONS.tool, 
            className: "bg-status-warning/20 text-status-warning",
            highlightClass: "border-l-4 border-status-warning" 
        };
      case AlertType.Health:
        return { 
            icon: ICONS.health, 
            className: "bg-yellow-500/20 text-yellow-400",
            highlightClass: "border-l-4 border-yellow-400" 
        };
      default:
        return { icon: ICONS.bell, className: "bg-brand-tertiary text-brand-accent", highlightClass: "border-l-4 border-transparent" };
    }
  };


  const handleAcknowledge = (id: string) => {
    setAlerts(currentAlerts =>
      currentAlerts.map(alert =>
        alert.id === id ? { ...alert, isAcknowledged: true } : alert
      )
    );
  };
  
  const unacknowledgedAlerts = alerts.filter(a => !a.isAcknowledged);

  return (
    <div id="alertas" className="bg-brand-secondary p-6 rounded-2xl border border-brand-tertiary shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Alertas Recientes</h3>
      {unacknowledgedAlerts.length > 0 ? (
        <ul className="space-y-3">
          {unacknowledgedAlerts.map(alert => {
             const { icon, className, highlightClass } = getAlertIconAndStyle(alert.type);
             return (
            <li key={alert.id} className={`flex items-center justify-between p-3 bg-brand-tertiary/50 rounded-lg ${highlightClass} transition-all`}>
              <div className="flex items-center flex-grow min-w-0">
                 <div className={`p-2 ${className} rounded-full`}>
                  {icon && React.cloneElement(icon, { className: "h-5 w-5" })}
                </div>
                <div className="ml-4 flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-white truncate pr-2">{alert.type}</p>
                    <p className="text-xs text-gray-400 flex-shrink-0">{alert.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <p className="text-xs text-brand-accent truncate">{alert.message}</p>
                </div>
              </div>
              <button onClick={() => handleAcknowledge(alert.id)} className="ml-4 flex-shrink-0 text-xs bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-1 px-3 rounded-full transition-colors">
                Confirmar
              </button>
            </li>
          )})}
        </ul>
      ) : (
        <p className="text-brand-accent text-sm text-center py-4">No hay alertas pendientes.</p>
      )}
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [emailContent, setEmailContent] = useState({ subject: '', body: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

    const generateEmailAlert = async (dive: Dive) => {
      try {
        const prompt = `
          Generate a formal and urgent safety alert email for a diving supervisor.
          The diver ${dive.diverName} (ID: ${dive.diverId}) has exceeded the maximum planned depth.
          
          Include the following critical information:
          - Diver's Name: ${dive.diverName}
          - Diver's ID: ${dive.diverId}
          - Planned Maximum Depth: ${dive.maxDepth} meters
          - Current Depth: ${dive.currentDepth} meters
          - Exceeded by: ${(dive.currentDepth - dive.maxDepth).toFixed(1)} meters
          - Dive Start Time: ${dive.startTime.toLocaleTimeString()}
          - Elapsed Time: ${dive.elapsedTime.toFixed(1)} minutes
          
          The email should have a clear, urgent subject line. The body should be professional,
          state the facts clearly, and strongly recommend immediate action according to safety protocols.
          Use Markdown for formatting, especially bolding key details with **asterisks**.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING }
                    },
                    required: ["subject", "body"]
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedContent = JSON.parse(jsonText);

        setEmailContent(parsedContent);
      } catch (error) {
        console.error("Error generating AI email:", error);
        setEmailContent({
          subject: "ERROR: No se pudo generar la alerta de IA",
          body: `Hubo un error al contactar el servicio de IA. Por favor, revise la consola para más detalles.\n\nDatos del Incidente:\nBuzo: ${dive.diverName}\nProfundidad Máxima: ${dive.maxDepth}m\nProfundidad Actual: ${dive.currentDepth}m`,
        });
      } finally {
        setIsGeneratingEmail(false);
      }
    };
    
    const handleDepthAlert = useCallback((dive: Dive) => {
        console.warn(`ALERTA DE PROFUNDIDAD para ${dive.diverName}!`);
        setIsModalOpen(true);
        setIsGeneratingEmail(true);
        generateEmailAlert(dive);
    }, []);
    
    const activeDivers = MOCK_DIVERS.filter(d => d.status === DiverStatus.Active || d.status === DiverStatus.Diving).length;
    const totalDivers = MOCK_DIVERS.length;
    const diversInmersion = MOCK_DIVERS.filter(d => d.status === DiverStatus.Diving).length;
    const pendingAlerts = MOCK_ALERTS.filter(a => !a.isAcknowledged).length;

    const scrollToAlerts = () => {
        document.getElementById('alertas')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            {isModalOpen && <EmailAlertModal {...emailContent} onClose={() => setIsModalOpen(false)} isGenerating={isGeneratingEmail} />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Buzos Activos" 
                    value={`${activeDivers}/${totalDivers}`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.063 18.281L12 21.5l-2.063-3.219A9.043 9.043 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10a9.043 9.043 0 01-7.937 6.281zM12 16a4 4 0 100-8 4 4 0 000 8z" /></svg>}
                    colorClass="from-green-500 to-emerald-600"
                    onClick={() => onNavigate(Page.Divers)}
                />
                 <StatCard 
                    title="En Inmersión" 
                    value={diversInmersion}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 13.342a.75.75 0 010-1.06l3-3a.75.75 0 111.06 1.06l-1.72 1.72h3.363a.75.75 0 010 1.5H10.95l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3z" clipRule="evenodd" /></svg>}
                    colorClass="from-sky-500 to-blue-600"
                    onClick={() => onNavigate(Page.Divers)}
                />
                <StatCard 
                    title="Alertas Pendientes" 
                    value={pendingAlerts}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.996 2.003c-.266 0-.525.02-.78.058l-.018.003-.01.002A9.752 9.752 0 002.25 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75c0-4.595-3.158-8.444-7.423-9.522a23.32 23.32 0 00-1.544-.142l-.02-.001-.019-.001zM12 3.51a8.25 8.25 0 016.983 3.992c.023.05.044.1.065.15h-4.328a.75.75 0 000 1.5h4.328a8.25 8.25 0 01-13.966 0h4.328a.75.75 0 000-1.5H5.017a8.25 8.25 0 016.983-3.992z" clipRule="evenodd" /></svg>}
                    colorClass="from-red-500 to-orange-600"
                    onClick={scrollToAlerts}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LiveDiveMonitor onDepthAlert={handleDepthAlert} />
                <AlertList />
            </div>
        </div>
    );
};

export default Dashboard;