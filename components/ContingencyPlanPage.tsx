
import React, { useState } from 'react';
import { ContingencyPlan, PlanStatus } from '../types';

interface ContingencyPlanPageProps {
    plans: ContingencyPlan[];
    onSave: (plan: ContingencyPlan) => void;
}

const emptyPlan: Omit<ContingencyPlan, 'id' | 'lastUpdated'> = {
    name: 'Nuevo Plan de Contingencia',
    version: '1.0',
    status: PlanStatus.Draft,
    company: '',
    policy: '',
    primaryCareCenter: '',
    contactPhone: '',
    riskAssessment: '',
    communicationSystem: '',
};

const ContingencyPlanPage: React.FC<ContingencyPlanPageProps> = ({ plans, onSave }) => {
    const [currentPlan, setCurrentPlan] = useState<ContingencyPlan | Omit<ContingencyPlan, 'id' | 'lastUpdated'>>(emptyPlan);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentPlan(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectPlan = (plan: ContingencyPlan) => {
        setCurrentPlan(plan);
        setSelectedPlanId(plan.id);
    };

    const handleCreateNew = () => {
        setCurrentPlan(emptyPlan);
        setSelectedPlanId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const planToSave = {
            ...currentPlan,
            status: PlanStatus.InReview, // When saving, it goes to review
            id: 'id' in currentPlan ? currentPlan.id : '', // Pass id if it exists
        };
        onSave(planToSave as ContingencyPlan);
        handleCreateNew(); // Reset form after saving
    };
    
    const getStatusClass = (status: PlanStatus) => {
        switch(status) {
            case PlanStatus.Approved: return "text-green-600";
            case PlanStatus.InReview: return "text-yellow-600";
            case PlanStatus.Draft: return "text-gray-500";
            default: return "text-gray-500";
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-100 text-gray-800 font-sans grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-y-auto">
            {/* Main Form */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Plan de Contingencia para Emergencias</h1>
                    <p className="text-gray-500 mt-1">Cree y gestione planes de contingencia para cada área de trabajo o contratista.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Identificación del Titular y Empresa</label>
                        <input type="text" name="company" value={currentPlan.company} onChange={handleInputChange} placeholder="Ej: Servicios Submarinos G&M Ltda." className="w-full bg-gray-100 border border-gray-300 p-3 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos y Política de Prevención</label>
                        <textarea name="policy" value={currentPlan.policy} onChange={handleInputChange} placeholder="Describa la política de la empresa para la prevención de riesgos..." rows={4} className="w-full bg-gray-100 border border-gray-300 p-3 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Centro Asistencial Primario</label>
                            <input type="text" name="primaryCareCenter" value={currentPlan.primaryCareCenter} onChange={handleInputChange} placeholder="Hospital Naval Almirante Nef" className="w-full bg-gray-100 border border-gray-300 p-3 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fono de Contacto</label>
                            <input type="text" name="contactPhone" value={currentPlan.contactPhone} onChange={handleInputChange} placeholder="+56 32 257 1111" className="w-full bg-gray-100 border border-gray-300 p-3 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Evaluación de Riesgos y Plan de Acción</label>
                        <textarea name="riskAssessment" value={currentPlan.riskAssessment} onChange={handleInputChange} placeholder="Detalle los riesgos específicos de la faena y las acciones a tomar..." rows={4} className="w-full bg-gray-100 border border-gray-300 p-3 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sistema de Comunicaciones</label>
                        <textarea name="communicationSystem" value={currentPlan.communicationSystem} onChange={handleInputChange} placeholder="Radios VHF Canal 16, Teléfonos satelitales..." rows={3} className="w-full bg-gray-100 border border-gray-300 p-3 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-[#21262D] hover:bg-[#343a40] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                            Guardar y Enviar para Aprobación
                        </button>
                    </div>
                </form>
            </div>

            {/* Saved Plans Sidebar */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md flex flex-col">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Planes Guardados</h2>
                    <p className="text-gray-500 mt-1">Acceda a los planes de contingencia aprobados.</p>
                </div>
                <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                    {plans.map(plan => (
                        <div key={plan.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{plan.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Versión {plan.version} - <span className={getStatusClass(plan.status)}>{plan.status}</span>
                                    </p>
                                </div>
                                <button onClick={() => handleSelectPlan(plan)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm flex items-center transition-colors border border-gray-300">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    Ver
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="mt-6">
                    <button onClick={handleCreateNew} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center border border-gray-300">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-1-4h.01M4 17h16a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Crear Nuevo Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContingencyPlanPage;
