
import React, { useState } from 'react';
import { Equipment, EquipmentStatus, Diver } from '../types';

interface EquipmentFormProps {
    equipment?: Equipment | null;
    onSave: (equipmentData: Equipment) => void;
    onCancel: () => void;
    divers: Diver[];
}

const InputField: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-brand-accent mb-2">{label}</label>
        {children}
    </div>
);

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onSave, onCancel, divers }) => {
    const [formData, setFormData] = useState({
        name: equipment?.name || '',
        type: equipment?.type || 'Soporte Vital',
        status: equipment?.status || EquipmentStatus.Operational,
        nextInspection: equipment?.nextInspection || new Date(),
        assignedTo: equipment?.assignedTo || '',
    });

    React.useEffect(() => {
        if (equipment) {
            setFormData({
                name: equipment.name,
                type: equipment.type,
                status: equipment.status,
                nextInspection: equipment.nextInspection,
                assignedTo: equipment.assignedTo || '',
            });
        }
    }, [equipment]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value ? new Date(e.target.value) : new Date();
        setFormData(prev => ({...prev, nextInspection: dateValue}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            alert('El nombre del equipo es obligatorio.');
            return;
        }
        const equipmentData: Equipment = {
            id: equipment?.id || '',
            lastInspection: equipment?.lastInspection || new Date(),
            ...formData,
        };
        onSave(equipmentData);
    };

    const commonInputClasses = "w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-3 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive transition-all duration-200";

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">{equipment ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}</h1>
            <form onSubmit={handleSubmit} className="bg-brand-secondary p-8 rounded-2xl border border-brand-tertiary shadow-lg max-w-3xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Nombre del Equipo">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required 
                        className={commonInputClasses}/>
                    </InputField>

                    <InputField label="Tipo de Equipo">
                        <select name="type" value={formData.type} onChange={handleChange}
                        className={commonInputClasses}>
                            <option>Soporte Vital</option>
                            <option>Soporte</option>
                            <option>Seguridad</option>
                            <option>Herramienta</option>
                            <option>Otro</option>
                        </select>
                    </InputField>

                    <InputField label="Estado Inicial">
                        <select name="status" value={formData.status} onChange={handleChange}
                        className={commonInputClasses}>
                            {Object.values(EquipmentStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </InputField>

                    <InputField label="Próxima Inspección">
                        <input type="date" name="nextInspection" value={formData.nextInspection.toISOString().split('T')[0]} onChange={handleDateChange} required 
                        className={commonInputClasses}/>
                    </InputField>
                    
                    <div className="md:col-span-2">
                         <InputField label="Asignado a (Opcional)">
                            <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}
                                className={commonInputClasses}>
                                <option value="">Sin Asignar</option>
                                {divers.map(diver => (
                                    <option key={diver.id} value={diver.name}>{diver.name}</option>
                                ))}
                            </select>
                        </InputField>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-brand-tertiary hover:bg-brand-accent text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">Cancelar</button>
                    <button type="submit" className="bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive">Guardar Equipo</button>
                </div>
            </form>
        </div>
    );
};

export default EquipmentForm;