import React, { useState, useEffect } from 'react';
import ProfileEditModal from './ProfileEditModal';
import { Diver, CivilStatus } from '../types';

interface SettingsPageProps {
    users: Diver[];
    onSave: (diverId: string, data: Partial<Diver>) => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; }> = ({ label, enabled, setEnabled }) => (
  <div className="flex items-center justify-between py-4">
    <span className="text-brand-light">{label}</span>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? 'bg-brand-interactive' : 'bg-brand-tertiary'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-interactive`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out`}
      />
    </button>
  </div>
);

const ProfileInfoItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
    <div className="bg-brand-tertiary/30 p-4 rounded-lg">
        <dt className="text-sm font-medium text-brand-accent truncate">{label}</dt>
        <dd className="mt-1 text-md text-white font-semibold">{value || 'No especificado'}</dd>
    </div>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ users, onSave }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDiverId, setSelectedDiverId] = useState(users[0]?.id || '');
    
    const [notifications, setNotifications] = useState({
        equipment: true,
        health: true,
        diveLimits: false,
    });
    const [theme, setTheme] = useState('dark');

    const selectedUser = users.find(u => u.id === selectedDiverId) || users[0];

    useEffect(() => {
        if (!selectedDiverId && users.length > 0) {
            setSelectedDiverId(users[0].id);
        }
    }, [users, selectedDiverId]);

    const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
        setNotifications(prev => ({...prev, [key]: value}));
    };
    
    const handleSaveProfile = (data: Partial<Diver>) => {
        if (!selectedDiverId) return;
        onSave(selectedDiverId, data);
        setIsEditModalOpen(false);
    };

    const calculateAge = (birthDate?: Date): number | undefined => {
        if (!birthDate) return undefined;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    
    if (!selectedUser) {
        return (
            <div className="p-8 text-white">
                Cargando... o no hay buzos para mostrar.
            </div>
        );
    }
    
    return (
        <>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-white mb-8">Ajustes</h1>
                <div className="max-w-4xl mx-auto space-y-10">
                    
                    {/* Profile Section */}
                    <div className="bg-brand-secondary p-6 rounded-2xl border border-brand-tertiary shadow-lg">
                        <div className="flex justify-between items-start mb-6">
                           <h2 className="text-xl font-bold text-white">Perfil y Cuenta</h2>
                           <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="bg-brand-tertiary hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm">
                                Editar Perfil
                           </button>
                        </div>

                         <div className="mb-6">
                            <label htmlFor="user-select" className="block text-sm font-medium text-brand-accent mb-2">Mostrando perfil de:</label>
                            <select 
                                id="user-select" 
                                value={selectedDiverId} 
                                onChange={(e) => setSelectedDiverId(e.target.value)}
                                className="w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-3 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive transition-all duration-200"
                            >
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>


                        <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-brand-tertiary">
                            <img src={selectedUser.avatarUrl} alt="User" className="w-24 h-24 rounded-full border-4 border-brand-tertiary" />
                            <div>
                                <h3 className="text-2xl font-semibold text-white">{selectedUser.name}</h3>
                                <p className="text-md text-brand-accent">{selectedUser.email || 'Sin correo electrónico'}</p>
                            </div>
                        </div>
                        
                        <dl className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <ProfileInfoItem label="Fecha de Nacimiento" value={selectedUser.dateOfBirth?.toLocaleDateString()} />
                                    <ProfileInfoItem label="Edad" value={calculateAge(selectedUser.dateOfBirth)} />
                                    <ProfileInfoItem label="Estado Civil" value={selectedUser.civilStatus} />
                                    <ProfileInfoItem label="Teléfono" value={selectedUser.phone} />
                                    <ProfileInfoItem label="Ciudad" value={selectedUser.city} />
                                    <ProfileInfoItem label="Dirección" value={selectedUser.address} />
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Información Previsional</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <ProfileInfoItem label="Inst. Salud" value={selectedUser.healthInsurance} />
                                    <ProfileInfoItem label="AFP" value={selectedUser.pensionFund} />
                                    <ProfileInfoItem label="Seguro Adicional" value={selectedUser.insurance} />
                                </div>
                            </div>

                        </dl>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-brand-secondary p-6 rounded-2xl border border-brand-tertiary shadow-lg">
                        <h2 className="text-xl font-bold text-white border-b border-brand-tertiary pb-3 mb-2">Notificaciones</h2>
                        <div className="divide-y divide-brand-tertiary/50">
                            <ToggleSwitch label="Alertas de Mantenimiento de Equipo" enabled={notifications.equipment} setEnabled={(val) => handleNotificationChange('equipment', val)} />
                            <ToggleSwitch label="Alertas de Estado de Salud" enabled={notifications.health} setEnabled={(val) => handleNotificationChange('health', val)} />
                            <ToggleSwitch label="Alertas de Límites de Buceo" enabled={notifications.diveLimits} setEnabled={(val) => handleNotificationChange('diveLimits', val)} />
                        </div>
                    </div>
                    
                     {/* Appearance Section */}
                    <div className="bg-brand-secondary p-6 rounded-2xl border border-brand-tertiary shadow-lg">
                        <h2 className="text-xl font-bold text-white border-b border-brand-tertiary pb-3 mb-4">Apariencia</h2>
                        <div>
                            <h3 className="text-brand-light mb-2">Tema</h3>
                            <div className="flex space-x-4">
                               <button onClick={() => setTheme('dark')} className={`flex-1 p-3 rounded-lg border-2 transition-all ${theme === 'dark' ? 'border-brand-interactive bg-brand-interactive/10' : 'border-brand-tertiary bg-brand-tertiary/50 hover:border-brand-accent'}`}>
                                   <span className="font-semibold text-white">Oscuro</span>
                               </button>
                               <button onClick={() => setTheme('light')} className={`flex-1 p-3 rounded-lg border-2 cursor-not-allowed ${theme === 'light' ? 'border-brand-interactive bg-brand-interactive/10' : 'border-brand-tertiary bg-brand-tertiary/50'}`} disabled>
                                   <span className="font-semibold text-white/50">Claro (Próximamente)</span>
                               </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && selectedUser && (
                 <ProfileEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveProfile}
                    user={selectedUser}
                />
            )}
        </>
    );
};

export default SettingsPage;