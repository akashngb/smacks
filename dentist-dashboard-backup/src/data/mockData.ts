import { Patient, Appointment } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'James Thornton',
    age: 54,
    email: 'james.thornton@email.com',
    phone: '+1 (416) 555-0201',
    lastScan: {
      id: 's1',
      date: 'Feb 20, 2026',
      riskLevel: 'red',
      score: 67.6,
      mlConfidence: 82.8,
      riskFactors: ['Daily tobacco use', 'Occasional alcohol'],
    },
    scanHistory: [
      { id: 's1', date: 'Feb 20, 2026', riskLevel: 'red', score: 67.6, mlConfidence: 82.8, riskFactors: ['Daily tobacco use'] },
      { id: 's2', date: 'Feb 13, 2026', riskLevel: 'yellow', score: 45.2, mlConfidence: 71.0, riskFactors: ['Daily tobacco use'] },
      { id: 's3', date: 'Feb 6, 2026', riskLevel: 'green', score: 22.1, mlConfidence: 61.0, riskFactors: [] },
    ],
    appointments: [
      { id: 'a1', patientId: '1', date: 'Feb 24, 2026', time: '10:00 AM', duration: 60, type: 'Oral Cancer Screening', notes: 'Follow up on high risk MouthWatch result' },
    ],
    clinicalNotes: 'Patient presents with a suspicious lesion on the lower left buccal mucosa. MouthWatch flagged high risk on Feb 20. Recommend biopsy if lesion persists beyond 2 weeks. Patient is a daily smoker — counselled on cessation.',
    annotations: [
      { id: 'ann1', position: [-0.3, -0.1, 0.8], severity: 'urgent', label: 'Suspicious lesion', note: 'Flagged by MouthWatch — monitor closely' },
      { id: 'ann2', position: [0.4, 0.2, 0.7], severity: 'watch', label: 'Early cavity', note: 'Early demineralization — review at next visit' },
    ],
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    age: 34,
    email: 'sarah.mitchell@email.com',
    phone: '+1 (416) 555-0202',
    lastScan: {
      id: 's4',
      date: 'Feb 18, 2026',
      riskLevel: 'yellow',
      score: 42.3,
      mlConfidence: 68.5,
      riskFactors: ['Occasional alcohol'],
    },
    scanHistory: [
      { id: 's4', date: 'Feb 18, 2026', riskLevel: 'yellow', score: 42.3, mlConfidence: 68.5, riskFactors: [] },
      { id: 's5', date: 'Feb 4, 2026', riskLevel: 'green', score: 18.0, mlConfidence: 55.0, riskFactors: [] },
    ],
    appointments: [
      { id: 'a2', patientId: '2', date: 'Feb 25, 2026', time: '2:00 PM', duration: 30, type: 'Routine Checkup', notes: 'Monitor moderate risk result' },
    ],
    clinicalNotes: 'Routine patient. Recent MouthWatch scan showed moderate risk — likely benign but worth monitoring. No significant history.',
    annotations: [
      { id: 'ann3', position: [0.2, 0.3, 0.8], severity: 'watch', label: 'Minor irritation', note: 'Likely from grinding — recommend night guard' },
    ],
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    age: 28,
    email: 'm.rodriguez@email.com',
    phone: '+1 (416) 555-0203',
    lastScan: {
      id: 's6',
      date: 'Feb 15, 2026',
      riskLevel: 'green',
      score: 14.2,
      mlConfidence: 91.0,
      riskFactors: [],
    },
    scanHistory: [
      { id: 's6', date: 'Feb 15, 2026', riskLevel: 'green', score: 14.2, mlConfidence: 91.0, riskFactors: [] },
    ],
    appointments: [
      { id: 'a3', patientId: '3', date: 'Feb 26, 2026', time: '11:00 AM', duration: 45, type: 'Cleaning', notes: '' },
    ],
    clinicalNotes: 'Healthy patient. Low risk across all scans. Excellent oral hygiene.',
    annotations: [],
  },
  {
    id: '4',
    name: 'Emily Chen',
    age: 61,
    email: 'emily.chen@email.com',
    phone: '+1 (416) 555-0204',
    lastScan: {
      id: 's7',
      date: 'Feb 19, 2026',
      riskLevel: 'red',
      score: 78.4,
      mlConfidence: 88.2,
      riskFactors: ['Prior oral cancer history', 'Daily tobacco use', 'HPV positive'],
    },
    scanHistory: [
      { id: 's7', date: 'Feb 19, 2026', riskLevel: 'red', score: 78.4, mlConfidence: 88.2, riskFactors: ['Prior cancer', 'Tobacco'] },
      { id: 's8', date: 'Feb 5, 2026', riskLevel: 'red', score: 71.1, mlConfidence: 84.0, riskFactors: ['Prior cancer'] },
    ],
    appointments: [
      { id: 'a4', patientId: '4', date: 'Feb 24, 2026', time: '9:00 AM', duration: 90, type: 'Urgent Consultation', notes: 'High risk — prior cancer history. Refer to oral surgeon.' },
    ],
    clinicalNotes: 'High priority patient. Prior oral cancer (2019, treated). Two consecutive high risk MouthWatch scans. HPV positive. Referring to oral surgeon for evaluation. Biopsy likely required.',
    annotations: [
      { id: 'ann4', position: [-0.5, 0.0, 0.7], severity: 'urgent', label: 'Recurrence risk area', note: 'Prior cancer site — monitor extremely closely' },
      { id: 'ann5', position: [0.1, -0.3, 0.8], severity: 'moderate', label: 'New lesion', note: 'Appeared since last visit' },
      { id: 'ann6', position: [0.5, 0.2, 0.6], severity: 'watch', label: 'Early cavity', note: 'Lower right molar' },
    ],
  },
];

export const SEVERITY_CONFIG = {
  info: { color: '#2196F3', label: 'Informational', bg: 'rgba(33,150,243,0.15)' },
  watch: { color: '#FFD600', label: 'Watch', bg: 'rgba(255,214,0,0.15)' },
  moderate: { color: '#FF6D00', label: 'Moderate', bg: 'rgba(255,109,0,0.15)' },
  urgent: { color: '#FF1744', label: 'Urgent', bg: 'rgba(255,23,68,0.15)' },
};

export const RISK_CONFIG = {
  green: { color: '#00E676', label: 'Low Risk', bg: 'rgba(0,230,118,0.15)' },
  yellow: { color: '#FFD600', label: 'Moderate Risk', bg: 'rgba(255,214,0,0.15)' },
  red: { color: '#FF1744', label: 'High Risk', bg: 'rgba(255,23,68,0.15)' },
};