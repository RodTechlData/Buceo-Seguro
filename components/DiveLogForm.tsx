import React, { useState } from 'react';
import { DiveLog, Diver } from '../types';

interface DiveLogFormProps {
  log: DiveLog | null;
  onSave: (log: DiveLog) => void;
  onCancel: () => void;
  divers: Diver[];
}

const InputField: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-brand-accent mb-2">{label}</label>
        {children}
    </div>
);

const DiveLogForm: React.FC<DiveLogFormProps> = ({ log, onSave, onCancel, divers }) => {
    const [formData, setFormData] = useState<Omit<DiveLog, 'id'>>({
        date: log?.date || new Date(),
        location: log?.location || '',
        supervisor: log?.supervisor || '',
        divers: log?.divers || [],
        jobDescription: log?.jobDescription || '',
        maxDepth: log?.maxDepth || 0,
        bottomTime: log?.bottomTime || 0,
        decompressionTable: log?.decompressionTable || 'US Navy Rev. 6',
        workReport: log?.workReport || '',
        incidents: log?.incidents || '',
    });

    const commonInputClasses = "w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-3 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive transition-all duration-200";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'maxDepth' || name === 'bottomTime' ? parseFloat(value) : value }));
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, date: new Date(e.target.value)}));
    };
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // FIX: The type of `option` within the `Array.from` map function was incorrectly inferred as `unknown`.
        // Explicitly typing `option` as `HTMLOptionElement` allows access to its `value` property.
        const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFormData(prev => ({...prev, divers: selectedOptions}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: log?.id || '' });
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">{log ? 'Editar Bitácora de Buceo' : 'Nueva Bitácora de Buceo'}</h1>
            <form onSubmit={handleSubmit} className="bg-brand-secondary p-8 rounded-2xl border border-brand-tertiary shadow-lg space-y-8">

                {/* Section 1: General Info */}
                <section>
                    <h2 className="text-xl font-bold text-white border-b border-brand-tertiary pb-3 mb-6">Información General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Fecha">
                            <input type="date" name="date" value={formData.date.toISOString().split('T')[0]} onChange={handleDateChange} required className={commonInputClasses}/>
                        </InputField>
                        <InputField label="Localización">
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className={commonInputClasses}/>
                        </InputField>
                         <InputField label="Supervisor">
                            <select name="supervisor" value={formData.supervisor} onChange={handleChange} required className={commonInputClasses}>
                                <option value="">Seleccione un supervisor</option>
                                {divers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                            </select>
                        </InputField>
                        <InputField label="Buzos Participantes">
                             <select multiple name="divers" value={formData.divers} onChange={handleMultiSelectChange} required className={`${commonInputClasses} h-32`}>
                                {divers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                            </select>
                        </InputField>
                        <div className="md:col-span-2">
                            <InputField label="Descripción del Trabajo">
                                <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} required rows={3} className={commonInputClasses}/>
                            </InputField>
                        </div>
                    </div>
                </section>

                {/* Section 2: Dive Details */}
                <section>
                    <h2 className="text-xl font-bold text-white border-b border-brand-tertiary pb-3 mb-6">Detalles de la Inmersión</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField label="Profundidad Máxima (metros)">
                             <input type="number" name="maxDepth" value={formData.maxDepth} onChange={handleChange} required min="0" className={commonInputClasses}/>
                        </InputField>
                        <InputField label="Tiempo de Fondo (minutos)">
                             <input type="number" name="bottomTime" value={formData.bottomTime} onChange={handleChange} required min="0" className={commonInputClasses}/>
                        </InputField>
                        <InputField label="Tabla de Descompresión">
                            <input type="text" name="decompressionTable" value={formData.decompressionTable} onChange={handleChange} required className={commonInputClasses}/>
                        </InputField>
                    </div>
                </section>
                
                {/* Section 3: Post-Dive Report */}
                <section>
                    <h2 className="text-xl font-bold text-white border-b border-brand-tertiary pb-3 mb-6">Reporte Post-Inmersión</h2>
                    <div className="space-y-6">
                        <InputField label="Reporte del Trabajo Realizado">
                            <textarea name="workReport" value={formData.workReport} onChange={handleChange} required rows={4} className={commonInputClasses}/>
                        </InputField>
                         <InputField label="Incidentes o Novedades (opcional)">
                            <textarea name="incidents" value={formData.incidents} onChange={handleChange} rows={3} className={commonInputClasses}/>
                        </InputField>
                    </div>
                </section>
                
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-brand-tertiary hover:bg-brand-accent text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">Cancelar</button>
                    <button type="submit" className="bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive">Guardar Bitácora</button>
                </div>
            </form>
        </div>
    );
};

export default DiveLogForm;