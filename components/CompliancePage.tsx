
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_PLAN_TEXT = `Plan de Buceo para Revisión y Mantención de Jaulas de Salmonesl. Antecedentes Generales[CampoDetalleFaena a RealizarRevisión y Mantención de Estructuras (Jaulas) de Cultivo.Ubicación Específica[Nombre del Centro de Cultivo y Cuadrante de Jaula(s)]Fecha y Hora Estimada[Día / Hora de inicio y término]Profundidad Máxima25 metrosTiempo Máximo de Fondo35 minutos por inmersión (Según Tablas de Descompresión Normal con Aire del D.S. N° 752 para buceo sin descompresión - Ver Sección III.Modalidad de BuceoBuceo con suministro de aire desde superficie (umbilical).Equipo de BuceoGrupo B (Buzo con suministro de aire desde superficie).N° Mínimo de Buzos3 (Buzo de faena, Buzo de Reserva/Apoyo, Asistente de Buzo).Autoridad MarítimaCapitanía de Puerto de [Nombre]].II. Personal Requerido (Mínimo)Todo el personal debe contar con Matrícula Profesional Vigente otorgada por la Autoridad Marítima (DIRECTEMAR) y Certificado Médico de Aptitud para el Buceo vigente.CargoRequisito MínimoFunciones PrincipalesBuzo de FaenaBuzo Profesional o Buzo Acuícola con Matrícula Vigente.Ejecutar las labores submarinas planificadas.Buzo de Reserva/ApoyoBuzo Profesional o Buzo Acuícola con Matrícula Vigente.Estar equipado y listo para una inmersión inmediata de rescate.Asistente de BuzoPoseer la misma matrícula que el Buzo de Faena (mínimo 16 años).Asistir al Buzo de Faena desde superficie, manejar el umbilical, comunicación y registro.Supervisor/Jefe de FaenaBuzo con experiencia comprobada y conocimiento normativo.Responsable final de la operación, seguridad, cumplimiento del plan y comunicación con la...`;

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
        <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-gray-600 font-semibold">Analizando plan con IA...</p>
        <p className="text-sm text-gray-500">Esto puede tardar unos segundos.</p>
    </div>
);

const ResultDisplay: React.FC<{ result: string }> = ({ result }) => {
    // Simple markdown parser for **bold** text
    const formatResult = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };
    
    // The first line is the title
    const resultLines = result.split('\n');
    const title = resultLines.find(line => line.trim().length > 0) || "Análisis de la IA";
    const explanation = resultLines.slice(1).join('\n').trim();

    return (
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg animate-fade-in h-full flex flex-col">
            <div className="flex items-center mb-4 flex-shrink-0">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-green-800">{title.replace(/\*/g, '')}</h3>
                    <p className="text-sm text-green-700">Resultado del análisis de la IA.</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-md border border-gray-200 flex-grow overflow-y-auto">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Explicación Detallada:</h4>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {formatResult(explanation)}
                </div>
            </div>
        </div>
    );
};

const CompliancePage: React.FC = () => {
    const [planText, setPlanText] = useState(MOCK_PLAN_TEXT);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        if (!planText.trim()) {
            setError("El plan de buceo no puede estar vacío.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const prompt = `Actúa como un supervisor experto en buceo profesional y seguridad para la Armada de Chile. Tu tarea es verificar si el siguiente plan de buceo cumple rigurosamente con la normativa chilena, incluyendo la Circular A-42/002 y el D.S. N° 752.

            Analiza el plan proporcionado y genera una respuesta clara y estructurada.
            
            1.  Si el plan CUMPLE con la normativa, tu respuesta DEBE comenzar EXACTAMENTE con la línea: "Plan Conforme a la Normativa".
            2.  A continuación, proporciona una explicación detallada de por qué cumple. Desglosa los puntos clave de cumplimiento (como personal, equipo, parámetros de buceo, plan de emergencia) y utiliza **negrita** (con dobles asteriscos) para resaltar los elementos más importantes.
            
            Aquí está el plan de buceo para analizar:
            ---
            ${planText}
            ---`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setAnalysisResult(response.text);

        } catch (e: any) {
            console.error(e);
            setError(`Error al verificar el plan: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-100 h-full overflow-hidden animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left Panel: Input */}
                <div className="bg-white p-8 rounded-xl shadow-md flex flex-col">
                     <div className="mb-6 flex-shrink-0">
                        <h1 className="text-2xl font-bold text-gray-900">Verificar Plan de Buceo</h1>
                        <p className="text-gray-500 mt-1">Ingrese los detalles del plan para que la IA verifique su cumplimiento con la normativa A-42/002.</p>
                    </div>
                    <div className="flex-grow flex flex-col min-h-0">
                        <label htmlFor="plan-buceo" className="block text-sm font-medium text-gray-700 mb-2">Plan de Buceo</label>
                        <textarea
                            id="plan-buceo"
                            value={planText}
                            onChange={(e) => setPlanText(e.target.value)}
                            placeholder="Pegue aquí el plan de buceo completo..."
                            className="w-full flex-grow bg-gray-50 border border-gray-300 p-4 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-xs leading-5"
                        />
                    </div>
                    <div className="mt-6 flex-shrink-0">
                        <button 
                            onClick={handleVerify}
                            disabled={isLoading}
                            className="w-full bg-[#21262D] hover:bg-[#343a40] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verificando...' : 'Verificar Cumplimiento'}
                        </button>
                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="bg-white p-8 rounded-xl shadow-md">
                    {isLoading && <LoadingSpinner />}
                    {error && <div className="text-red-600 bg-red-50 p-4 rounded-md">{error}</div>}
                    {analysisResult && <ResultDisplay result={analysisResult} />}
                    {!isLoading && !error && !analysisResult && (
                        <div className="flex items-center justify-center h-full text-center">
                            <p className="text-gray-500">El resultado del análisis de la IA aparecerá aquí.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompliancePage;
