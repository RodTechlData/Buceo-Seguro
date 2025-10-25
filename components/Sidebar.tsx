
import React from 'react';
import { Page } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isOpen: boolean;
}

const NavItem: React.FC<{
  // FIX: Using a more specific type for the icon prop, which includes the className property,
  // allows React.cloneElement to correctly type-check the props.
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  label: Page;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg text-brand-light hover:bg-brand-secondary transition-all duration-300 relative ${
        isActive ? 'bg-brand-interactive/10 text-brand-interactive-hover font-semibold' : ''
      }`}
    >
      {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-brand-interactive rounded-r-full"></div>}
      {React.cloneElement(icon, { className: "h-6 w-6"})}
      <span className="ml-4">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen }) => {
  return (
    <aside 
      className={`w-64 fixed inset-y-0 left-0 bg-brand-secondary border-r border-brand-tertiary transform transition-transform duration-300 ease-in-out z-30 lg:relative lg:translate-x-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      aria-label="Sidebar"
    >
      <div className="overflow-y-auto h-full py-4 px-3 bg-brand-secondary flex flex-col border-r border-brand-tertiary">
        <div className="flex items-center justify-center py-4 px-2 mb-4">
            <span className="text-3xl font-bold text-white tracking-wider">
                <span className="text-brand-interactive">Diver</span>Safe
            </span>
        </div>
        <ul className="space-y-2 flex-grow">
          <NavItem icon={ICONS.dashboard} label={Page.Dashboard} isActive={currentPage === Page.Dashboard} onClick={() => onPageChange(Page.Dashboard)} />
          <NavItem icon={ICONS.settings} label={Page.Settings} isActive={currentPage === Page.Settings} onClick={() => onPageChange(Page.Settings)} />
          <NavItem icon={ICONS.equipment} label={Page.Equipment} isActive={currentPage === Page.Equipment} onClick={() => onPageChange(Page.Equipment)} />
          <NavItem icon={ICONS.contingencyPlan} label={Page.ContingencyPlan} isActive={currentPage === Page.ContingencyPlan} onClick={() => onPageChange(Page.ContingencyPlan)} />
          <NavItem icon={ICONS.decompressionTables} label={Page.DecompressionTables} isActive={currentPage === Page.DecompressionTables} onClick={() => onPageChange(Page.DecompressionTables)} />
          <NavItem icon={ICONS.verifyCompliance} label={Page.VerifyCompliance} isActive={currentPage === Page.VerifyCompliance} onClick={() => onPageChange(Page.VerifyCompliance)} />
          <NavItem icon={ICONS.divers} label={Page.Divers} isActive={currentPage === Page.Divers} onClick={() => onPageChange(Page.Divers)} />
          <NavItem icon={ICONS.reports} label={Page.Reports} isActive={currentPage === Page.Reports} onClick={() => onPageChange(Page.Reports)} />
          <NavItem icon={ICONS.imageEditor} label={Page.ImageEditor} isActive={currentPage === Page.ImageEditor} onClick={() => onPageChange(Page.ImageEditor)} />
          <NavItem icon={ICONS.aiAssistant} label={Page.AI_Assistant} isActive={currentPage === Page.AI_Assistant} onClick={() => onPageChange(Page.AI_Assistant)} />
        </ul>
        {/* Simulating user role and offline mode as per original image context */}
        <div className="mt-auto pt-4 border-t border-brand-tertiary space-y-4">
            <div>
                <label htmlFor="role-simulator" className="text-xs font-semibold text-brand-accent mb-2 block px-2">Simular Rol de Usuario</label>
                <select id="role-simulator" className="w-full bg-brand-tertiary border border-brand-tertiary/50 text-white p-2 rounded-lg focus:ring-1 focus:ring-brand-interactive focus:border-brand-interactive text-sm">
                    <option>Supervisor de Buceo</option>
                    <option>Jefe de Operaciones</option>
                    <option>Prevencionista</option>
                </select>
            </div>
            <div className="flex items-center justify-between p-2">
                <span className="text-sm font-medium text-brand-light">Modo Offline</span>
                <button
                    className="bg-brand-tertiary relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300"
                    role="switch"
                    aria-checked="false"
                >
                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out" />
                </button>
            </div>
             <div className="text-center text-xs text-brand-accent pt-4">
                <p>www.dataflowia.com</p>
                <p>contacto@dataflowia.com</p>
                <p>© 2025 todos los derechos reservados</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;