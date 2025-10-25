import React, { useState, useEffect } from 'react';
import { Diver, DiverStatus, MedicalStatus, DiveStatus } from '../types';
import DiverForm from './DiverForm';

interface DiversPageProps {
    divers: Diver[];
    onAddDiver: (diver: Diver) => void;
}

const getStatusClasses = (status: DiverStatus) => {
    switch (status) {
        case DiverStatus.Diving: return 'bg-brand-interactive/20 text-brand-interactive-hover';
        case DiverStatus.Active: return 'bg-green-500/20 text-green-400';
        case DiverStatus.OnStandby: return 'bg-yellow-500/20 text-yellow-400';
        case DiverStatus.Inactive: return 'bg-gray-500/20 text-gray-400';
        default: return 'bg-gray-200 text-gray-800';
    }
};

const getMedicalStatusClasses = (status: MedicalStatus) => {
    switch (status) {
        case MedicalStatus.Fit: return 'text-status-safe';
        case MedicalStatus.Restricted: return 'text-status-warning';
        case MedicalStatus.Unfit: return 'text-status-danger';
        default: return 'text-brand-accent';
    }
};

const getDiveStatusClasses = (status: DiveStatus) => {
    switch (status) {
        case DiveStatus.Completed: return 'bg-green-500/20 text-green-400';
        case DiveStatus.Aborted: return 'bg-red-500/20 text-red-400';
        case DiveStatus.Decompression: return 'bg-yellow-500/20 text-yellow-400';
        case DiveStatus.InProgress: return 'bg-sky-500/20 text-sky-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};


const DiverDetail: React.FC<{ diver: Diver; onClose: () => void }> = ({ diver, onClose }) => {
    const [activeTab, setActiveTab] = useState('resumen');
    
    const tabs = ['resumen', 'médico', 'certificaciones', 'historial'];

    useEffect(() => {
        setActiveTab('resumen');
    }, [diver]);

    return (
        <div className="bg-brand-secondary p-6 rounded-2xl border border-brand-tertiary shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                    <img src={diver.avatarUrl} alt={diver.name} className="w-24 h-24 rounded-full mr-6 border-4 border-brand-tertiary" />
                    <div>
                        <h3 className="text-3xl font-bold text-white">{diver.name}</h3>
                        <p className="text-brand-accent text-lg">Equipo {diver.team}</p>
                        <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(diver.status)}`}>{diver.status}</span>
                    </div>
                </div>
                <button onClick={onClose} className="text-brand-accent hover:text-white text-3xl font-bold transition-colors">&times;</button>
            </div>
            
            <div className="border-b border-brand-tertiary mb-4">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${activeTab === tab ? 'border-brand-interactive text-brand-interactive-hover' : 'border-transparent text-brand-accent hover:text-white hover:border-gray-500'}`}>
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                {activeTab === 'resumen' && (
                    <div className="space-y-4 text-md p-2">
                        <div className="flex justify-between"><span className="text-brand-accent">Inmersiones Totales:</span><span className="font-semibold text-white">{diver.totalDives}</span></div>
                        <div className="flex justify-between"><span className="text-brand-accent">Última Inmersión:</span><span className="font-semibold text-white">{diver.lastDive.toLocaleDateString()}</span></div>
                        <div className="flex justify-between"><span className="text-brand-accent">Estado Médico:</span><span className={`font-semibold ${getMedicalStatusClasses(diver.medicalStatus)}`}>{diver.medicalStatus}</span></div>
                    </div>
                )}
                {activeTab === 'médico' && (
                    <ul className="space-y-3 text-sm">
                        {diver.medicalHistory.map(record => (
                             <li key={record.id} className="p-4 bg-brand-tertiary/40 rounded-lg border border-brand-tertiary/50">
                                <p className="font-semibold text-white">Revisado el {record.checkupDate.toLocaleDateString()} por {record.doctor}</p>
                                <p className={`font-bold ${getMedicalStatusClasses(record.status)}`}>Estado: {record.status}</p>
                                <p className="text-brand-accent mt-1">{record.notes}</p>
                             </li>
                        ))}
                    </ul>
                )}
                {activeTab === 'certificaciones' && (
                     <ul className="space-y-3 text-sm">
                        {diver.certifications.map(cert => (
                             <li key={cert.id} className="p-4 bg-brand-tertiary/40 rounded-lg border border-brand-tertiary/50">
                                <p className="font-semibold text-white">{cert.name}</p>
                                <p className="text-brand-accent">Emisor: {cert.issuer} | Emitido: {cert.issueDate.toLocaleDateString()}</p>
                                {cert.expiryDate && <p className="text-brand-accent">Expira: {cert.expiryDate.toLocaleDateString()}</p>}
                             </li>
                        ))}
                    </ul>
                )}
                {activeTab === 'historial' && (
                    <div className="space-y-3 text-sm">
                        {diver.diveHistory && diver.diveHistory.length > 0 ? (
                            diver.diveHistory.map(dive => (
                                <div key={dive.id} className="p-4 bg-brand-tertiary/40 rounded-lg border border-brand-tertiary/50">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-white">Fecha: {new Date(dive.startTime).toLocaleDateString()}</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDiveStatusClasses(dive.status)}`}>{dive.status}</span>
                                    </div>
                                    <div className="mt-2 flex space-x-6 text-brand-accent">
                                        <span>Profundidad Máx: <span className="font-bold text-white">{dive.maxDepth}m</span></span>
                                        <span>Tiempo de Fondo: <span className="font-bold text-white">{dive.bottomTime} min</span></span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-brand-accent text-sm text-center py-4">No hay historial de inmersiones para este buzo.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const DiversPage: React.FC<DiversPageProps> = ({ divers, onAddDiver }) => {
    const [selectedDiver, setSelectedDiver] = useState<Diver | null>(null);
    const [view, setView] = useState<'list'|'form'>('list');
    
    useEffect(() => {
      if (!selectedDiver && divers.length > 0) {
        setSelectedDiver(divers[0]);
      }
    }, [divers, selectedDiver]);
    
    const handleAddNewDiver = () => {
        setSelectedDiver(null);
        setView('form');
    }
    
    const handleSaveDiver = (diverData: { name: string; team: string; status: DiverStatus; medicalStatus: MedicalStatus; }) => {
        const newDiver: Diver = {
            id: `D${Date.now()}`,
            name: diverData.name,
            team: diverData.team,
            status: diverData.status,
            medicalStatus: diverData.medicalStatus,
            email: `${diverData.name.split(' ').join('.').toLowerCase()}@example.com`,
            avatarUrl: `https://picsum.photos/seed/${diverData.name.split(' ').join('')}/100/100`,
            totalDives: 0,
            lastDive: new Date(),
            certifications: [],
            medicalHistory: [],
            diveHistory: [],
        };
        onAddDiver(newDiver);
        setSelectedDiver(newDiver);
        setView('list');
    };
    
    const handleCancel = () => {
        setView('list');
         if (!selectedDiver && divers.length > 0) {
            setSelectedDiver(divers[0]);
        }
    };

    if (view === 'form') {
        return <DiverForm onSave={handleSaveDiver} onCancel={handleCancel} />;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Gestión de Buzos</h1>
                <button 
                  onClick={handleAddNewDiver} 
                  className="bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-2 px-5 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 100-2h-1v-1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1z" /></svg>
                  Agregar Buzo
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-brand-secondary p-4 rounded-2xl border border-brand-tertiary shadow-lg overflow-y-auto max-h-[calc(100vh-200px)]">
                    <ul className="space-y-2">
                        {divers.map(diver => (
                            <li key={diver.id}>
                                <button onClick={() => setSelectedDiver(diver)} className={`w-full text-left p-3 rounded-lg flex items-center transition-all duration-200 border border-transparent ${selectedDiver?.id === diver.id ? 'bg-brand-interactive/10 border-brand-interactive' : 'hover:bg-brand-tertiary/50'}`}>
                                    <img src={diver.avatarUrl} alt={diver.name} className="w-12 h-12 rounded-full mr-4"/>
                                    <div>
                                        <p className="font-semibold text-white">{diver.name}</p>
                                        <p className="text-sm text-brand-accent">Equipo {diver.team}</p>
                                    </div>
                                    <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClasses(diver.status)}`}>{diver.status}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:col-span-2">
                    {selectedDiver ? (
                        <DiverDetail diver={selectedDiver} onClose={() => setSelectedDiver(null)} />
                    ) : (
                        <div className="bg-brand-secondary p-6 rounded-2xl border border-brand-tertiary shadow-lg h-full flex items-center justify-center">
                            <p className="text-brand-accent">Seleccione un buzo para ver los detalles</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiversPage;