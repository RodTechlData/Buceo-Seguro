
export enum Page {
  Dashboard = 'Panel de Control',
  Settings = 'Mi Perfil',
  Equipment = 'Equipos',
  ContingencyPlan = 'Plan de Contingencia',
  DecompressionTables = 'Tablas Descompresión',
  VerifyCompliance = 'Verificar Cumplimiento',
  Divers = 'Gestionar Buzos',
  Reports = 'Reportes',
  ImageEditor = 'Editor de Imágenes',
  AI_Assistant = 'Asistente IA',
}

export enum DiverStatus {
  Active = 'Activo',
  OnStandby = 'En Espera',
  Inactive = 'Inactivo',
  Diving = 'Buceando',
}

export enum MedicalStatus {
  Fit = 'Apto para Bucear',
  Restricted = 'Restringido',
  Unfit = 'No Apto',
}

export enum DiveStatus {
  InProgress = 'En Progreso',
  Completed = 'Completado',
  Decompression = 'Descompresión',
  Aborted = 'Abortado',
}

export enum AlertType {
  Depth = 'Límite de Profundidad',
  Time = 'Límite de Tiempo',
  Health = 'Problema de Salud',
  Equipment = 'Falla de Equipo',
}

export enum EquipmentStatus {
  Operational = 'Operacional',
  MaintenanceDue = 'Mantenimiento Requerido',
  OutOfService = 'Fuera de Servicio',
}

export enum CivilStatus {
  Single = 'Soltero/a',
  Married = 'Casado/a',
  Divorced = 'Divorciado/a',
  Widowed = 'Viudo/a',
}


export interface Dive {
  id: string;
  diverId: string;
  diverName: string;
  startTime: Date;
  maxDepth: number; // in meters
  bottomTime: number; // in minutes
  status: DiveStatus;
  currentDepth?: number;
  elapsedTime?: number; // in minutes
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
}

export interface MedicalRecord {
  id: string;
  checkupDate: Date;
  doctor: string;
  status: MedicalStatus;
  notes: string;
}

export interface Diver {
  id: string;
  name: string;
  email: string;
  status: DiverStatus;
  team: string;
  avatarUrl: string;
  totalDives: number;
  lastDive: Date;
  medicalStatus: MedicalStatus;
  certifications: Certification[];
  medicalHistory: MedicalRecord[];
  diveHistory: Dive[];
  dateOfBirth?: Date;
  civilStatus?: CivilStatus;
  address?: string;
  city?: string;
  phone?: string;
  healthInsurance?: string; // Inst. Salud
  pensionFund?: string; // AFP
  insurance?: string; // Seguros
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: Date;
  diverId?: string;
  equipmentId?: string;
  isAcknowledged: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  lastInspection: Date;
  nextInspection: Date;
  assignedTo?: string;
}

export interface DiveLog {
  id: string;
  date: Date;
  location: string;
  supervisor: string;
  divers: string[];
  jobDescription: string;
  maxDepth: number; // meters
  bottomTime: number; // minutes
  decompressionTable: string;
  workReport: string;
  incidents?: string;
}

export enum PlanStatus {
  Approved = 'Aprobado',
  InReview = 'En Revisión',
  Draft = 'Borrador',
}

export interface ContingencyPlan {
  id: string;
  name: string;
  version: string;
  status: PlanStatus;
  company: string;
  policy: string;
  primaryCareCenter: string;
  contactPhone: string;
  riskAssessment: string;
  communicationSystem: string;
  lastUpdated: Date;
}