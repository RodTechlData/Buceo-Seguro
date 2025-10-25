
import React, { useState, useMemo } from 'react';
import { DiveLog, Diver } from '../types';
import DiveLogForm from './DiveLogForm';

interface ReportsPageProps {
  logs: DiveLog[];
  onSave: (log: DiveLog) => void;
  divers: Diver[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ logs, onSave, divers }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [selectedLog, setSelectedLog] = useState<DiveLog | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  const supervisors = useMemo(() => {
    const supervisorNames = new Set(logs.map(log => log.supervisor));
    divers.forEach(diver => supervisorNames.add(diver.name));
    return Array.from(supervisorNames).sort();
  }, [logs, divers]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = log.date;
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        if (logDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        if (logDate > end) return false;
      }
      if (selectedSupervisor && log.supervisor !== selectedSupervisor) {
        return false;
      }
      return true;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [logs, startDate, endDate, selectedSupervisor]);

  const handleCreateNew = () => {
    setSelectedLog(null);
    setView('form');
  };

  const handleEdit = (log: DiveLog) => {
    setSelectedLog(log);
    setView('form');
  };

  const handleSave = (logData: DiveLog) => {
    onSave(logData);
    setView('list');
    setSelectedLog(null);
  };
  
  const handleCancel = () => {
    setView('list');
    setSelectedLog(null);
  };
  
  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedSupervisor('');
  };

  if (view === 'form') {
    return <DiveLogForm log={selectedLog} onSave={handleSave} onCancel={handleCancel} divers={divers} />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Historial de Bitácoras</h1>
        <button 
          onClick={handleCreateNew} 
          className="bg-brand-interactive hover:bg-brand-interactive-hover text-white font-bold py-2 px-5 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-glow-interactive">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Crear Nueva Bitácora
        </button>
      </div>

      <div className="bg-brand-secondary p-4 rounded-2xl border border-brand-tertiary shadow-lg mb-6 flex flex-col sm:flex-row flex-wrap items-end gap-4">
        <div className="flex-grow w-full sm:w-auto">
          <label htmlFor="startDate" className="block text-sm font-medium text-brand-accent mb-1">Desde</label>
          <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-2 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive" />
        </div>
        <div className="flex-grow w-full sm:w-auto">
          <label htmlFor="endDate" className="block text-sm font-medium text-brand-accent mb-1">Hasta</label>
          <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-2 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive" />
        </div>
        <div className="flex-grow w-full sm:w-auto">
          <label htmlFor="supervisor" className="block text-sm font-medium text-brand-accent mb-1">Supervisor</label>
          <select id="supervisor" value={selectedSupervisor} onChange={e => setSelectedSupervisor(e.target.value)} className="w-full bg-brand-tertiary/50 border border-brand-tertiary text-white p-2 rounded-lg focus:ring-2 focus:ring-brand-interactive focus:border-brand-interactive">
            <option value="">Todos</option>
            {supervisors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={handleClearFilters} className="w-full sm:w-auto bg-brand-tertiary hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-lg transition-colors">Limpiar</button>
      </div>

      <div className="bg-brand-secondary rounded-2xl border border-brand-tertiary shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-brand-accent">
            <thead className="text-xs text-brand-light uppercase bg-brand-tertiary/50">
              <tr>
                <th scope="col" className="px-6 py-4">Fecha</th>
                <th scope="col" className="px-6 py-4">Localización</th>
                <th scope="col" className="px-6 py-4">Supervisor</th>
                <th scope="col" className="px-6 py-4">Trabajo</th>
                <th scope="col" className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} className="border-b border-brand-tertiary hover:bg-brand-tertiary/30 transition-colors duration-200">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{log.date.toLocaleDateString()}</td>
                  <td className="px-6 py-4">{log.location}</td>
                  <td className="px-6 py-4">{log.supervisor}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{log.jobDescription}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(log)} className="font-medium text-brand-interactive hover:text-brand-interactive-hover transition-colors">Ver / Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-brand-accent">{logs.length > 0 ? 'No hay bitácoras que coincidan con los filtros.' : 'No hay bitácoras registradas.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;