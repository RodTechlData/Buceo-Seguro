
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ImageEditorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('Agregar un filtro retro');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setEditedImage(null);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const fileToGenerativePart = (path: string, mimeType: string) => {
        return {
            inlineData: {
                data: path.split(',')[1],
                mimeType
            }
        };
    }
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!originalImage) {
            setError("Por favor, suba una imagen.");
            return;
        }
        if (!prompt) {
            setError("Por favor, escriba una instrucción de edición.");
            return;
        }
        setIsLoading(true);
        setEditedImage(null);
        setError(null);

        try {
            const imageMimeType = originalImage.substring(originalImage.indexOf(":") + 1, originalImage.indexOf(";"));
            const imagePart = fileToGenerativePart(originalImage, imageMimeType);
            const textPart = { text: prompt };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            const firstPart = response.candidates?.[0]?.content?.parts?.[0];
            if (firstPart && firstPart.inlineData) {
                const base64ImageBytes = firstPart.inlineData.data;
                const mimeType = firstPart.inlineData.mimeType;
                setEditedImage(`data:${mimeType};base64,${base64ImageBytes}`);
            } else {
                throw new Error("La API no devolvió una imagen. Intente con otra instrucción.");
            }

        } catch (e: any) {
            console.error(e);
            setError(`Error al editar la imagen: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Editor de Imágenes con IA</h1>
            <p className="text-brand-accent mb-6">Utilice Gemini para editar imágenes con instrucciones de texto simples.</p>
            
            <form onSubmit={handleSubmit} className="bg-brand-secondary p-8 rounded-2xl border border-brand-tertiary shadow-lg space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-brand-accent mb-2">1. Subir Imagen</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-tertiary border-dashed rounded-md cursor-pointer hover:border-brand-interactive transition-colors"
                    >
                        {originalImage ? (
                            <img src={originalImage} alt="Preview" className="max-h-60 rounded-lg object-contain"/>
                        ) : (
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-brand-accent" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div className="flex text-sm text-brand-accent">
                                    <p className="pl-1">Haga clic para subir un archivo</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                            </div>
                        )}
                    </div>
                    <input ref={fileInputRef} onChange={handleFileChange} type="file" accept="image/*" className="hidden"/>
                </div>

                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-brand-accent mb-2">2. Instrucción de Edición</label>
                    <input 
                        type="text"
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Ej: "Quitar a la persona del fondo", "Convertir a blanco y negro"'
                        className="w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-3 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive transition-all duration-200"
                    />
                </div>

                <div>
                    <button 
                        type="submit"
                        disabled={isLoading || !originalImage}
                        className="w-full bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive disabled:bg-brand-tertiary disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Procesando...
                            </>
                        ) : '3. Generar Imagen'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            
            {editedImage && (
                 <div className="mt-8">
                    <h2 className="text-xl font-bold text-white mb-4">Resultado</h2>
                    <div className="bg-brand-secondary p-4 rounded-2xl border border-brand-tertiary shadow-lg">
                        <img src={editedImage} alt="Edited result" className="w-full max-w-lg mx-auto rounded-lg object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageEditorPage;
