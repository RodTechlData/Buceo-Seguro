import React, { useState } from 'react';
import { Diver, DiverStatus, MedicalStatus } from '../types';

interface DiverFormProps {
  onSave: (diverData: {
      name: string;
      team: string;
      status: DiverStatus;
      medicalStatus: MedicalStatus;
  }) => void;
  onCancel: () => void;
}

const InputField: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-brand-accent mb-2">{label}</label>
        {children}
    </div>
);

const DiverForm: React.FC<DiverFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        team: 'Alfa',
        status: DiverStatus.Active,
        medicalStatus: MedicalStatus.Fit,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            alert('El nombre es obligatorio.');
            return;
        }
        onSave(formData);
    };

    const commonInputClasses = "w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-3 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive transition-all duration-200";

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Agregar Nuevo Buzo</h1>
            <form onSubmit={handleSubmit} className="bg-brand-secondary p-8 rounded-2xl border border-brand-tertiary shadow-lg max-w-2xl mx-auto space-y-6">
                
                <InputField label="Nombre Completo">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required 
                    className={commonInputClasses}/>
                </InputField>

                <InputField label="Equipo Asignado">
                    <select name="team" value={formData.team} onChange={handleChange}
                    className={commonInputClasses}>
                        <option>Alfa</option>
                        <option>Bravo</option>
                        <option>Charlie</option>
                    </select>
                </InputField>
                
                <InputField label="Estado Inicial">
                    <select name="status" value={formData.status} onChange={handleChange}
                    className={commonInputClasses}>
                        {Object.values(DiverStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </InputField>

                <InputField label="Estado Médico Inicial">
                    <select name="medicalStatus" value={formData.medicalStatus} onChange={handleChange}
                    className={commonInputClasses}>
                         {Object.values(MedicalStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </InputField>

                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-brand-tertiary hover:bg-brand-accent text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">Cancelar</button>
                    <button type="submit" className="bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive">Guardar Buzo</button>
                </div>
            </form>
        </div>
    );
};

export default DiverForm;