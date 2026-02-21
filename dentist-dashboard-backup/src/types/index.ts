export type RiskLevel = 'green' | 'yellow' | 'red';

export type AnnotationSeverity = 'info' | 'watch' | 'moderate' | 'urgent';

export type Annotation = {
  id: string;
  position: [number, number, number];
  severity: AnnotationSeverity;
  label: string;
  note: string;
};

export type Scan = {
  id: string;
  date: string;
  riskLevel: RiskLevel;
  score: number;
  mlConfidence: number;
  riskFactors: string[];
};

export type Appointment = {
  id: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  notes: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  lastScan: Scan;
  scanHistory: Scan[];
  appointments: Appointment[];
  clinicalNotes: string;
  annotations: Annotation[];
};

export type CenterView = 'model' | 'calendar';