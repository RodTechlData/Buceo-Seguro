
import React, { useState, useMemo } from 'react';
import { Equipment, EquipmentStatus, Diver } from '../types';
import EquipmentForm from './EquipmentForm';
import { ICONS } from '../constants';

interface EquipmentPageProps {
    equipmentList: Equipment[];
    onSaveEquipment: (equipment: Equipment) => void;
    divers: Diver[];
}

const getStatusClasses = (status: EquipmentStatus) => {
    switch (status) {
        case EquipmentStatus.Operational: return 'bg-status-safe/20 text-green-400';
        case EquipmentStatus.MaintenanceDue: return 'bg-status-warning/20 text-yellow-400';
        case EquipmentStatus.OutOfService: return 'bg-status-danger/20 text-red-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};

const EquipmentPage: React.FC<EquipmentPageProps> = ({ equipmentList, onSaveEquipment, divers }) => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [showDueSoon, setShowDueSoon] = useState(false);

    const handleAddNew = () => {
        setSelectedEquipment(null);
        setView('form');
    };

    const handleEdit = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setView('form');
    };
    
    const handleSaveAndCloseForm = (equipment: Equipment) => {
        onSaveEquipment(equipment);
        setView('list');
        setSelectedEquipment(null);
    };

    const handleCancel = () => {
        setView('list');
        setSelectedEquipment(null);
    };

    const isDueForInspection = (inspectionDate: Date): boolean => {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

        return inspectionDate >= today && inspectionDate <= thirtyDaysFromNow;
    };

    const displayedEquipment = useMemo(() => {
        const sortedList = [...equipmentList].sort((a, b) => a.nextInspection.getTime() - b.nextInspection.getTime());
        if (showDueSoon) {
            return sortedList.filter(item => isDueForInspection(item.nextInspection));
        }
        return sortedList;
    }, [equipmentList, showDueSoon]);


    if (view === 'form') {
        return <EquipmentForm equipment={selectedEquipment} onSave={handleSaveAndCloseForm} onCancel={handleCancel} divers={divers} />;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-white">Inventario de Equipos</h1>
                <div className="flex items-center space-x-4">
                     <button
                        onClick={() => setShowDueSoon(!showDueSoon)}
                        className={`font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            showDueSoon 
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/30' 
                            : 'bg-brand-tertiary hover:bg-brand-tertiary/70 text-brand-light'
                        }`}
                    >
                        {ICONS.warning && React.cloneElement(ICONS.warning, {className: "h-5 w-5 mr-2"})}
                        Inspección Próxima (30d)
                    </button>
                    <button 
                      onClick={handleAddNew} 
                      className="bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                      Agregar Equipo
                    </button>
                </div>
            </div>
            <div className="bg-brand-secondary rounded-2xl border border-brand-tertiary shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-brand-accent">
                        <thead className="text-xs text-brand-light uppercase bg-brand-tertiary/50">
                            <tr>
                                <th scope="col" className="px-6 py-4">Equipo</th>
                                <th scope="col" className="px-6 py-4">Tipo</th>
                                <th scope="col" className="px-6 py-4">Estado</th>
                                <th scope="col" className="px-6 py-4">Próxima Inspección</th>
                                <th scope="col" className="px-6 py-4">Asignado a</th>
                                <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedEquipment.map(item => {
                                const isDue = isDueForInspection(item.nextInspection);
                                return (
                                <tr key={item.id} className={`border-b border-brand-tertiary transition-colors duration-200 ${isDue ? 'bg-status-warning/10 hover:bg-status-warning/20' : 'hover:bg-brand-tertiary/30'}`}>
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.name} <span className="text-brand-accent">({item.id})</span></td>
                                    <td className="px-6 py-4">{item.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap ${isDue ? 'font-semibold' : ''}`}>
                                        {isDue 
                                            ? <span className="flex items-center text-status-warning">
                                                {ICONS.warning && React.cloneElement(ICONS.warning, {className: 'h-4 w-4 mr-2 flex-shrink-0 text-status-warning'})}
                                                {item.nextInspection.toLocaleDateString()}
                                              </span>
                                            : item.nextInspection.toLocaleDateString()
                                        }
                                    </td>
                                    <td className="px-6 py-4">{item.assignedTo || 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleEdit(item)} className="font-medium text-brand-interactive hover:text-brand-interactive-hover transition-colors">Editar</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                     {displayedEquipment.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-brand-accent">{showDueSoon ? 'Ningún equipo requiere inspección en los próximos 30 días.' : 'No hay equipos para mostrar.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EquipmentPage;