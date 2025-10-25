
import React from 'react';
import { Diver, Dive, Equipment, Alert, DiverStatus, MedicalStatus, DiveStatus, AlertType, EquipmentStatus, DiveLog, CivilStatus, ContingencyPlan, PlanStatus } from './types';

// Mock Data
const now = new Date();

export const MOCK_DIVERS: Diver[] = [
  {
    id: 'D001',
    name: 'Javier Castillo',
    email: 'javier.castillo@example.com',
    status: DiverStatus.Diving,
    team: 'Alfa',
    avatarUrl: 'https://picsum.photos/seed/javier/100/100',
    totalDives: 152,
    lastDive: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    medicalStatus: MedicalStatus.Fit,
    certifications: [
      { id: 'C1', name: 'Buceo Avanzado en Aguas Abiertas', issuer: 'PADI', issueDate: new Date('2021-05-15'), expiryDate: new Date('2025-05-15') },
      { id: 'C2', name: 'Buzo Comercial', issuer: 'ADCI', issueDate: new Date('2022-01-20') },
    ],
    medicalHistory: [
      { id: 'M1', checkupDate: new Date('2024-01-10'), doctor: 'Dr. Ana Rojas', status: MedicalStatus.Fit, notes: 'Apto para todas las actividades de buceo.' }
    ],
    diveHistory: [
      { id: 'DH001', diverId: 'D001', diverName: 'Javier Castillo', startTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), maxDepth: 28, bottomTime: 35, status: DiveStatus.Completed },
      { id: 'DH002', diverId: 'D001', diverName: 'Javier Castillo', startTime: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), maxDepth: 22, bottomTime: 40, status: DiveStatus.Completed },
      { id: 'DH003', diverId: 'D001', diverName: 'Javier Castillo', startTime: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000), maxDepth: 30, bottomTime: 25, status: DiveStatus.Completed },
    ],
    dateOfBirth: new Date('1990-03-25'),
    civilStatus: CivilStatus.Married,
    address: 'Av. del Mar 1234',
    city: 'Coquimbo',
    phone: '+56 9 8765 4321',
    healthInsurance: 'Fonasa',
    pensionFund: 'AFP Modelo',
    insurance: 'Seguros de Vida S.A.'
  },
  {
    id: 'D002',
    name: 'Sofia Reyes',
    email: 'sofia.reyes@example.com',
    status: DiverStatus.OnStandby,
    team: 'Alfa',
    avatarUrl: 'https://picsum.photos/seed/sofia/100/100',
    totalDives: 98,
    lastDive: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    medicalStatus: MedicalStatus.Fit,
    certifications: [
        { id: 'C3', name: 'Buzo de Rescate', issuer: 'PADI', issueDate: new Date('2022-08-01'), expiryDate: new Date('2026-08-01') },
        // FIX: Corrected typo in year from '203' to '2023' to create a valid date.
        { id: 'C4', name: 'Soldadura Submarina', issuer: 'TechDive', issueDate: new Date('2023-03-15') },
    ],
    medicalHistory: [
      { id: 'M2', checkupDate: new Date('2023-11-20'), doctor: 'Dr. Ana Rojas', status: MedicalStatus.Fit, notes: 'Excelente condición.' }
    ],
    diveHistory: [
      { id: 'DH004', diverId: 'D002', diverName: 'Sofia Reyes', startTime: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000), maxDepth: 18, bottomTime: 50, status: DiveStatus.Completed },
      { id: 'DH005', diverId: 'D002', diverName: 'Sofia Reyes', startTime: new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000), maxDepth: 25, bottomTime: 30, status: DiveStatus.Completed },
    ]
  },
  {
    id: 'D003',
    name: 'Mateo Vargas',
    email: 'mateo.vargas@example.com',
    status: DiverStatus.Active,
    team: 'Bravo',
    avatarUrl: 'https://picsum.photos/seed/mateo/100/100',
    totalDives: 210,
    lastDive: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    medicalStatus: MedicalStatus.Restricted,
    certifications: [
      { id: 'C5', name: 'Buzo Comercial', issuer: 'ADCI', issueDate: new Date('2020-07-30') },
    ],
    medicalHistory: [
      { id: 'M3', checkupDate: new Date('2024-03-05'), doctor: 'Dr. Carlos Mena', status: MedicalStatus.Restricted, notes: 'Barotrauma de oído menor. Restringido a profundidades menores de 20m por 2 semanas.' }
    ],
    diveHistory: [
      { id: 'DH006', diverId: 'D003', diverName: 'Mateo Vargas', startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), maxDepth: 15, bottomTime: 45, status: DiveStatus.Aborted },
      { id: 'DH007', diverId: 'D003', diverName: 'Mateo Vargas', startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), maxDepth: 19, bottomTime: 35, status: DiveStatus.Completed },
    ]
  },
  {
    id: 'D004',
    name: 'Isabella Flores',
    email: 'isabella.flores@example.com',
    status: DiverStatus.Inactive,
    team: 'Bravo',
    avatarUrl: 'https://picsum.photos/seed/isabella/100/100',
    totalDives: 55,
    lastDive: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    medicalStatus: MedicalStatus.Unfit,
    certifications: [],
    medicalHistory: [
        { id: 'M4', checkupDate: new Date('2024-02-15'), doctor: 'Dr. Carlos Mena', status: MedicalStatus.Unfit, notes: 'De licencia médica.' }
    ],
    diveHistory: []
  },
];

export const MOCK_LIVE_DIVES: Dive[] = [
  {
    id: 'DV001',
    diverId: 'D001',
    diverName: 'Javier Castillo',
    startTime: new Date(now.getTime() - 15 * 60 * 1000),
    maxDepth: 25,
    bottomTime: 30, // plan
    status: DiveStatus.InProgress,
    currentDepth: 22,
    elapsedTime: 15
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'A001',
    type: AlertType.Time,
    message: 'Javier Castillo aproximándose al límite de tiempo de fondo.',
    timestamp: new Date(now.getTime() - 2 * 60 * 1000),
    diverId: 'D001',
    isAcknowledged: false
  },
  {
    id: 'A002',
    type: AlertType.Equipment,
    message: 'Compresor C-02 requiere mantenimiento.',
    timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    equipmentId: 'E002',
    isAcknowledged: true
  },
  {
    id: 'A003',
    type: AlertType.Health,
    message: 'Mateo Vargas tiene una nueva restricción médica.',
    timestamp: new Date(now.getTime() - 26 * 60 * 60 * 1000),
    diverId: 'D003',
    isAcknowledged: false
  }
];

export const MOCK_EQUIPMENT: Equipment[] = [
    { id: 'E001', name: 'Casco de Buceo KMB-1', type: 'Soporte Vital', status: EquipmentStatus.Operational, lastInspection: new Date('2024-03-01'), nextInspection: new Date('2025-03-01'), assignedTo: 'Javier Castillo' },
    { id: 'E002', name: 'Compresor de Aire C-02', type: 'Soporte', status: EquipmentStatus.MaintenanceDue, lastInspection: new Date('2023-09-15'), nextInspection: new Date('2024-03-15') },
    { id: 'E003', name: 'Cámara Hiperbárica H-01', type: 'Seguridad', status: EquipmentStatus.Operational, lastInspection: new Date('2024-01-20'), nextInspection: new Date('2025-01-20') },
    { id: 'E004', name: 'Arnés de Buceo H-15', type: 'Soporte Vital', status: EquipmentStatus.OutOfService, lastInspection: new Date('2024-02-10'), nextInspection: new Date('2024-08-10'), assignedTo: 'Bodega' },
];

export const MOCK_DIVE_LOGS: DiveLog[] = [
    {
        id: 'LOG001',
        date: new Date('2024-05-20'),
        location: 'Centro de Cultivo "Los Fiordos"',
        supervisor: 'Javier Castillo',
        divers: ['Sofia Reyes', 'Mateo Vargas'],
        jobDescription: 'Inspección y limpieza de redes de jaula 5.',
        maxDepth: 18,
        bottomTime: 45,
        decompressionTable: 'US Navy Rev. 6',
        workReport: 'Limpieza completada al 95%. Se encontró una rotura menor en la red, la cual fue marcada para reparación. Visibilidad moderada (5m).',
        incidents: 'Ninguno.'
    },
    {
        id: 'LOG002',
        date: new Date('2024-05-18'),
        location: 'Centro de Cultivo "Aguas Claras"',
        supervisor: 'Javier Castillo',
        divers: ['Sofia Reyes'],
        jobDescription: 'Extracción de mortalidad.',
        maxDepth: 22,
        bottomTime: 30,
        decompressionTable: 'US Navy Rev. 6',
        workReport: 'Se extrajo la mortalidad según el protocolo. La operación se realizó sin contratiempos.',
        incidents: 'Corriente leve detectada en el fondo.'
    }
];

export const MOCK_CONTINGENCY_PLANS: ContingencyPlan[] = [
  {
    id: 'CP001',
    name: 'Plan Faena Quintero',
    version: '2.1',
    status: PlanStatus.Approved,
    company: 'Servicios Submarinos G&M Ltda.',
    policy: 'Política de prevención de riesgos laborales para trabajos submarinos...',
    primaryCareCenter: 'Hospital Naval Almirante Nef',
    contactPhone: '+56 32 257 1111',
    riskAssessment: 'Riesgos de enredo, fallas de equipo, barotrauma. Plan de acción incluye chequeos pre-inmersión...',
    communicationSystem: 'Radios VHF Canal 16, Teléfonos satelitales Iridium.',
    lastUpdated: new Date('2024-05-15'),
  },
  {
    id: 'CP002',
    name: 'Plan Varadero Valparaíso',
    version: '1.5',
    status: PlanStatus.Approved,
    company: 'Astilleros y Maestranzas de la Armada (ASMAR)',
    policy: 'Política de seguridad para trabajos de soldadura y corte submarino.',
    primaryCareCenter: 'Hospital Carlos Van Buren',
    contactPhone: '+56 32 220 4000',
    riskAssessment: 'Riesgos de electrocución, explosión, quemaduras. Se requiere equipo de protección personal especializado.',
    communicationSystem: 'Comunicación por cable con superficie, radios VHF.',
    lastUpdated: new Date('2024-04-20'),
  },
  {
    id: 'CP003',
    name: 'Plan General Salmoneras',
    version: '3.0',
    status: PlanStatus.InReview,
    company: 'AquaChile S.A.',
    policy: 'Procedimientos estandarizados para operaciones en centros de cultivo de salmón.',
    primaryCareCenter: 'Hospital de Puerto Montt',
    contactPhone: '+56 65 229 3000',
    riskAssessment: 'Ataques de lobos marinos, enredo en redes, condiciones climáticas adversas.',
    communicationSystem: 'Radios VHF, teléfono celular con cobertura en la zona.',
    lastUpdated: new Date('2024-05-28'),
  },
];


// Icons
export const ICONS = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    divers: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    equipment: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
    contingencyPlan: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    decompressionTables: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M9 20h6" /></svg>,
    verifyCompliance: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.318-3.045A11.955 11.955 0 0112 17.944a11.955 11.955 0 015.682-1.045L21 20.417c.207-3.623-.388-7.244-2.382-10.433z" /></svg>,
    reports: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    imageEditor: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>,
    aiAssistant: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    bell: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    chevronDown: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    warning: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-warning" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
    danger: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-danger" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
    time: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg>,
    depth: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
    health: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>,
    tool: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.96.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
};