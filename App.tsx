
import React, { useState, useEffect } from 'react';
import { Page, Diver, Equipment, DiveLog, ContingencyPlan } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DiversPage from './components/DiversPage';
import EquipmentPage from './components/EquipmentPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import ImageEditorPage from './components/ImageEditorPage';
import AI_AssistantPage from './components/AI_AssistantPage';
import ContingencyPlanPage from './components/ContingencyPlanPage';
import CompliancePage from './components/CompliancePage';
import { MOCK_DIVERS, MOCK_EQUIPMENT, MOCK_DIVE_LOGS, MOCK_CONTINGENCY_PLANS, ICONS } from './constants';

const Header: React.FC<{ user: Diver; onToggleSidebar: () => void; currentPageTitle: string }> = ({ user, onToggleSidebar, currentPageTitle }) => {
    return (
        <header className="flex justify-between items-center p-4 bg-brand-primary/80 backdrop-blur-sm sticky top-0 z-10 border-b border-brand-tertiary flex-shrink-0">
            <div className="flex items-center">
                 <button
                    onClick={onToggleSidebar}
                    className="lg:hidden text-brand-accent hover:text-brand-light mr-3 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-interactive"
                    aria-label="Open sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{currentPageTitle}</h1>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6">
                <button className="relative text-brand-accent hover:text-brand-light transition-colors duration-300">
                    {ICONS.bell}
                    <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-status-danger rounded-full border-2 border-brand-primary"></span>
                    <span className="sr-only">Notifications</span>
                </button>
                <div className="flex items-center">
                    <img src={user.avatarUrl} alt="User" className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-brand-tertiary" />
                    <div className="ml-3 text-left hidden md:block">
                        <p className="text-sm font-semibold text-brand-light">{user.name}</p>
                        <p className="text-xs text-brand-accent">Supervisor</p>
                    </div>
                     {ICONS.chevronDown && React.cloneElement(ICONS.chevronDown, { className: "h-5 w-5 ml-2 text-brand-accent hidden md:block"})}
                </div>
            </div>
        </header>
    );
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage && Object.values(Page).includes(savedPage as Page)) {
        return savedPage as Page;
    }
    return Page.Dashboard;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [divers, setDivers] = useState<Diver[]>(() => {
    try {
      const savedDivers = localStorage.getItem('divers');
      if (!savedDivers) return MOCK_DIVERS;

      const parsedDivers: Diver[] = JSON.parse(savedDivers);
      
      return parsedDivers.map(diver => ({
          ...diver,
          lastDive: new Date(diver.lastDive),
          dateOfBirth: diver.dateOfBirth ? new Date(diver.dateOfBirth) : undefined,
          certifications: (diver.certifications || []).map(cert => ({
              ...cert,
              issueDate: new Date(cert.issueDate),
              expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
          })),
          medicalHistory: (diver.medicalHistory || []).map(record => ({
              ...record,
              checkupDate: new Date(record.checkupDate),
          })),
          diveHistory: (diver.diveHistory || []).map(dive => ({
              ...dive,
              startTime: new Date(dive.startTime),
          })),
      }));
    } catch (error) {
        console.error("Error loading divers from localStorage", error);
        return MOCK_DIVERS;
    }
  });

  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => {
    try {
      const savedEquipment = localStorage.getItem('equipment');
      if (!savedEquipment) return MOCK_EQUIPMENT;

      const parsedEquipment: Equipment[] = JSON.parse(savedEquipment);
      return parsedEquipment.map(item => ({
        ...item,
        lastInspection: new Date(item.lastInspection),
        nextInspection: new Date(item.nextInspection),
      }));
    } catch (error) {
        console.error("Error loading equipment from localStorage", error);
        return MOCK_EQUIPMENT;
    }
  });

  const [diveLogs, setDiveLogs] = useState<DiveLog[]>(() => {
    try {
        const savedLogs = localStorage.getItem('diveLogs');
        if (!savedLogs) return MOCK_DIVE_LOGS;

        const parsedLogs: DiveLog[] = JSON.parse(savedLogs);
        return parsedLogs.map(log => ({
            ...log,
            date: new Date(log.date),
        }));
    } catch (error) {
        console.error("Error loading dive logs from localStorage", error);
        return MOCK_DIVE_LOGS;
    }
  });

  const [contingencyPlans, setContingencyPlans] = useState<ContingencyPlan[]>(() => {
    try {
        const savedPlans = localStorage.getItem('contingencyPlans');
        if (!savedPlans) return MOCK_CONTINGENCY_PLANS;

        const parsedPlans: ContingencyPlan[] = JSON.parse(savedPlans);
        return parsedPlans.map(plan => ({
            ...plan,
            lastUpdated: new Date(plan.lastUpdated),
        }));
    } catch (error) {
        console.error("Error loading contingency plans from localStorage", error);
        return MOCK_CONTINGENCY_PLANS;
    }
  });

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    try {
        localStorage.setItem('divers', JSON.stringify(divers));
    } catch (error) {
        console.error("Error saving divers to localStorage", error);
    }
  }, [divers]);

  useEffect(() => {
    try {
        localStorage.setItem('equipment', JSON.stringify(equipmentList));
    } catch (error) {
        console.error("Error saving equipment to localStorage", error);
    }
  }, [equipmentList]);

  useEffect(() => {
    try {
        localStorage.setItem('diveLogs', JSON.stringify(diveLogs));
    } catch (error) {
        console.error("Error saving dive logs to localStorage", error);
    }
  }, [diveLogs]);
  
  useEffect(() => {
    try {
        localStorage.setItem('contingencyPlans', JSON.stringify(contingencyPlans));
    } catch (error) {
        console.error("Error saving contingency plans to localStorage", error);
    }
  }, [contingencyPlans]);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on navigation on mobile
  };

  const handleAddDiver = (newDiver: Diver) => {
    setDivers(prevDivers => [newDiver, ...prevDivers]);
  };
  
  const handleSaveEquipment = (equipmentData: Equipment) => {
    setEquipmentList(prevList => {
        const existingIndex = prevList.findIndex(e => e.id === equipmentData.id);
        if (equipmentData.id && existingIndex > -1) {
            // Update
            const updatedList = [...prevList];
            updatedList[existingIndex] = equipmentData;
            return updatedList;
        } else {
            // Add
            const newEquipment = { ...equipmentData, id: `E${Date.now()}`};
            return [newEquipment, ...prevList];
        }
    });
  };

  const handleUpdateProfile = (diverId: string, updatedData: Partial<Diver>) => {
    setDivers(prevDivers => {
        return prevDivers.map(diver => {
            if (diver.id === diverId) {
                return { ...diver, ...updatedData };
            }
            return diver;
        });
    });
  };

  const handleSaveDiveLog = (logData: DiveLog) => {
    setDiveLogs(prevLogs => {
        const existingLogIndex = prevLogs.findIndex(l => l.id === logData.id);
        if (logData.id && existingLogIndex > -1) {
            // Update existing log
            const updatedLogs = [...prevLogs];
            updatedLogs[existingLogIndex] = logData;
            return updatedLogs;
        } else {
            // Add new log
            const newLog = { ...logData, id: `LOG${Date.now()}` };
            return [newLog, ...prevLogs].sort((a, b) => b.date.getTime() - a.date.getTime());
        }
    });
  };

  const handleSaveContingencyPlan = (planData: ContingencyPlan) => {
    setContingencyPlans(prevPlans => {
        const existingPlanIndex = prevPlans.findIndex(p => p.id === planData.id);
        if (planData.id && existingPlanIndex > -1) {
            // Update
            const updatedPlans = [...prevPlans];
            updatedPlans[existingPlanIndex] = { ...planData, lastUpdated: new Date() };
            return updatedPlans;
        } else {
            // Add
            const newPlan = { ...planData, id: `CP${Date.now()}`, lastUpdated: new Date() };
            return [newPlan, ...prevPlans];
        }
    });
  };

  const renderPage = () => {
    const mainUser = divers.find(d => d.id === MOCK_DIVERS[0].id) || divers[0];

    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard onNavigate={handlePageChange} />;
      case Page.Divers:
        return <DiversPage divers={divers} onAddDiver={handleAddDiver} />;
      case Page.Equipment:
        return <EquipmentPage equipmentList={equipmentList} onSaveEquipment={handleSaveEquipment} divers={divers}/>;
      case Page.ContingencyPlan:
        return <ContingencyPlanPage plans={contingencyPlans} onSave={handleSaveContingencyPlan} />;
      case Page.DecompressionTables:
        return <div className="p-8 text-white">Página de Tablas de Descompresión - En construcción.</div>;
      case Page.VerifyCompliance:
        return <CompliancePage />;
      case Page.Reports:
        return <ReportsPage logs={diveLogs} onSave={handleSaveDiveLog} divers={divers} />;
      case Page.ImageEditor:
        return <ImageEditorPage />;
      case Page.AI_Assistant:
        return <AI_AssistantPage divers={divers} diveLogs={diveLogs} />;
      case Page.Settings:
        return <SettingsPage users={divers} onSave={handleUpdateProfile} />;
      default:
        return <div className="p-8 text-white">Página no encontrada</div>;
    }
  };
  
  const mainUser = divers.find(d => d.id === MOCK_DIVERS[0].id) || divers[0] || MOCK_DIVERS[0];

  return (
    <div className="flex h-screen bg-brand-primary text-brand-light overflow-hidden">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
            <div 
                onClick={() => setIsSidebarOpen(false)} 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                aria-hidden="true"
            ></div>
        )}
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isOpen={isSidebarOpen}
       />
      <main className="flex-1 flex flex-col bg-brand-primary">
          <Header 
            user={mainUser} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            currentPageTitle={currentPage}
          />
          <div className="overflow-y-auto flex-grow">
            {renderPage()}
          </div>
      </main>
    </div>
  );
};

export default App;