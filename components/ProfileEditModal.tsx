import React, { useState, useEffect } from 'react';
import { Diver, CivilStatus } from '../types';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Diver>) => void;
    user: Diver;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState<Partial<Diver>>(user);

    useEffect(() => {
        setFormData(user);
    }, [user, isOpen]);

    if (!isOpen) return null;

    const commonInputClasses = "w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-3 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive transition-all duration-200";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const InputField: React.FC<{ label: string; name: keyof Diver; type?: string; required?: boolean; }> = ({label, name, type='text', required=false}) => (
        <div>
            <label htmlFor={name.toString()} className="block text-sm font-medium text-brand-accent mb-2">{label}</label>
            <input
                type={type}
                id={name.toString()}
                name={name.toString()}
                value={(formData[name] as string) || ''}
                onChange={handleChange}
                required={required}
                className={commonInputClasses}
            />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
            <div className="bg-brand-secondary rounded-2xl border border-brand-tertiary shadow-2xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-brand-tertiary">
                      <h2 id="edit-profile-title" className="text-xl font-bold text-white">Editar Perfil</h2>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white border-b border-brand-tertiary/50 pb-3 mb-4">Información Personal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <InputField label="Nombre Completo" name="name" required />
                               <InputField label="Email" name="email" type="email" required />
                               <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-brand-accent mb-2">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''}
                                        onChange={handleDateChange}
                                        className={commonInputClasses}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="civilStatus" className="block text-sm font-medium text-brand-accent mb-2">Estado Civil</label>
                                    <select
                                        id="civilStatus"
                                        name="civilStatus"
                                        value={formData.civilStatus || ''}
                                        onChange={handleChange}
                                        className={commonInputClasses}
                                    >
                                        <option value="">Seleccione...</option>
                                        {Object.values(CivilStatus).map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                                <InputField label="Teléfono" name="phone" type="tel" />
                                <InputField label="Ciudad" name="city" />
                                <div className="md:col-span-2">
                                    <InputField label="Dirección" name="address" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white border-b border-brand-tertiary/50 pb-3 mb-4 pt-4">Información Previsional</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Inst. Salud" name="healthInsurance" />
                                <InputField label="AFP" name="pensionFund" />
                                <div className="md:col-span-2">
                                  <InputField label="Seguro Adicional" name="insurance" />
                                </div>
                             </div>
                        </div>
                    </div>
                    <div className="bg-brand-secondary px-6 py-4 flex justify-end space-x-3 rounded-b-2xl">
                        <button type="button" onClick={onClose} className="bg-brand-tertiary hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Cancelar</button>
                        <button type="submit" className="bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;