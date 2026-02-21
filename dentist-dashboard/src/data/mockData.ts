import { Patient } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'James Thornton',
    age: 54,
    email: 'james.thornton@email.com',
    phone: '+1 (416) 555-0201',
    lastScan: {
      id: 's1',
      date: 'Feb 21, 2026',
      riskLevel: 'red',
      score: 67.6,
      mlConfidence: 82.8,
      riskFactors: ['Daily tobacco use', 'Occasional alcohol'],
    },
    scanHistory: [
      { id: 's1', date: 'Feb 21, 2026', riskLevel: 'red', score: 67.6, mlConfidence: 82.8, riskFactors: ['Daily tobacco use'] },
      { id: 's2', date: 'Feb 13, 2026', riskLevel: 'yellow', score: 45.2, mlConfidence: 71.0, riskFactors: ['Daily tobacco use'] },
      { id: 's3', date: 'Feb 6, 2026', riskLevel: 'green', score: 22.1, mlConfidence: 61.0, riskFactors: [] },
    ],
    appointments: [
      { id: 'a1', patientId: '1', date: 'Feb 24, 2026', time: '10:00 AM', duration: 60, type: 'Oral Cancer Screening', notes: 'Follow up on high risk MouthWatch result' },
    ],
    clinicalNotes: '• Suspicious lesion lower left buccal mucosa\n• MouthWatch flagged high risk Feb 21\n• Daily smoker — cessation counselling provided\n• Recommend biopsy if lesion persists >2 weeks\n• F/U booked Feb 24',
    annotations: [
      { id: 'ann1', position: [-0.3, -0.2, 0.4], severity: 'urgent', label: 'Suspicious lesion', note: 'Flagged by MouthWatch — monitor closely' },
      { id: 'ann2', position: [0.4, -0.1, 0.35], severity: 'watch', label: 'Early cavity', note: 'Early demineralization — review at next visit' },
    ],
  },
  {
    id: '4',
    name: 'Emily Chen',
    age: 61,
    email: 'emily.chen@email.com',
    phone: '+1 (416) 555-0204',
    lastScan: {
      id: 's7',
      date: 'Feb 20, 2026',
      riskLevel: 'red',
      score: 78.4,
      mlConfidence: 88.2,
      riskFactors: ['Prior oral cancer history', 'Daily tobacco use', 'HPV positive'],
    },
    scanHistory: [
      { id: 's7', date: 'Feb 20, 2026', riskLevel: 'red', score: 78.4, mlConfidence: 88.2, riskFactors: ['Prior cancer', 'Tobacco'] },
      { id: 's8', date: 'Feb 5, 2026', riskLevel: 'red', score: 71.1, mlConfidence: 84.0, riskFactors: ['Prior cancer'] },
    ],
    appointments: [
      { id: 'a4', patientId: '4', date: 'Feb 24, 2026', time: '9:00 AM', duration: 90, type: 'Urgent Consultation', notes: 'High risk — prior cancer history. Refer to oral surgeon.' },
    ],
    clinicalNotes: '• Prior oral cancer 2019 — treated successfully\n• Two consecutive high risk MouthWatch scans\n• HPV positive\n• Referring to oral surgeon for evaluation\n• Biopsy likely required\n• URGENT: do not delay referral',
    annotations: [
      { id: 'ann4', position: [-0.4, -0.15, 0.38], severity: 'urgent', label: 'Recurrence risk area', note: 'Prior cancer site — monitor extremely closely' },
      { id: 'ann5', position: [0.1, -0.25, 0.42], severity: 'moderate', label: 'New lesion', note: 'Appeared since last visit' },
      { id: 'ann6', position: [0.45, -0.05, 0.35], severity: 'watch', label: 'Early cavity', note: 'Lower right molar' },
    ],
  },
  {
    id: '7',
    name: 'Robert Okafor',
    age: 48,
    email: 'r.okafor@email.com',
    phone: '+1 (416) 555-0207',
    lastScan: {
      id: 's13',
      date: 'Feb 19, 2026',
      riskLevel: 'red',
      score: 71.2,
      mlConfidence: 85.1,
      riskFactors: ['Heavy alcohol consumption', 'Daily tobacco use'],
    },
    scanHistory: [
      { id: 's13', date: 'Feb 19, 2026', riskLevel: 'red', score: 71.2, mlConfidence: 85.1, riskFactors: ['Heavy alcohol', 'Tobacco'] },
      { id: 's14', date: 'Feb 10, 2026', riskLevel: 'yellow', score: 52.3, mlConfidence: 74.0, riskFactors: ['Heavy alcohol'] },
    ],
    appointments: [
      { id: 'a7', patientId: '7', date: 'Feb 25, 2026', time: '3:00 PM', duration: 60, type: 'Oral Cancer Screening', notes: 'Increasing risk trend — comprehensive exam required' },
    ],
    clinicalNotes: '• Heavy alcohol + daily tobacco — dual risk factors\n• Risk trend increasing across last 2 scans\n• White patch noted on right lateral tongue\n• Urgent screening booked Feb 25\n• Advised to reduce alcohol intake immediately',
    annotations: [
      { id: 'ann10', position: [0.3, -0.2, 0.4], severity: 'urgent', label: 'White patch', note: 'Right lateral tongue — leukoplakia suspected' },
      { id: 'ann11', position: [-0.25, -0.1, 0.38], severity: 'moderate', label: 'Inflamed gum', note: 'Likely alcohol-related — monitor' },
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
    clinicalNotes: '• Moderate risk on latest scan — likely benign\n• No significant oral health history\n• Occasional alcohol noted on intake form\n• Risk trend stable → slight increase, monitor\n• Review at next visit in 4 weeks',
    annotations: [
      { id: 'ann3', position: [0.2, 0.3, 0.8], severity: 'watch', label: 'Minor irritation', note: 'Likely from grinding — recommend night guard' },
    ],
  },
  {
    id: '8',
    name: 'Priya Nair',
    age: 29,
    email: 'priya.nair@email.com',
    phone: '+1 (416) 555-0208',
    lastScan: {
      id: 's15',
      date: 'Feb 17, 2026',
      riskLevel: 'yellow',
      score: 38.7,
      mlConfidence: 62.4,
      riskFactors: ['HPV unknown'],
    },
    scanHistory: [
      { id: 's15', date: 'Feb 17, 2026', riskLevel: 'yellow', score: 38.7, mlConfidence: 62.4, riskFactors: ['HPV unknown'] },
    ],
    appointments: [
      { id: 'a8', patientId: '8', date: 'Feb 26, 2026', time: '1:00 PM', duration: 30, type: 'Routine Checkup', notes: 'First visit — follow up on MouthWatch yellow flag' },
    ],
    clinicalNotes: '• First time patient — referred via MouthWatch app\n• Yellow flag on first scan — low concern but worth monitoring\n• HPV status unknown — recommend testing\n• No tobacco or alcohol use reported\n• Book 3-month follow up',
    annotations: [],
  },
  {
    id: '5',
    name: 'Daniel Park',
    age: 41,
    email: 'd.park@email.com',
    phone: '+1 (416) 555-0205',
    lastScan: {
      id: 's9',
      date: 'Feb 16, 2026',
      riskLevel: 'green',
      score: 11.3,
      mlConfidence: 94.2,
      riskFactors: [],
    },
    scanHistory: [
      { id: 's9', date: 'Feb 16, 2026', riskLevel: 'green', score: 11.3, mlConfidence: 94.2, riskFactors: [] },
      { id: 's10', date: 'Feb 2, 2026', riskLevel: 'green', score: 9.8, mlConfidence: 92.0, riskFactors: [] },
    ],
    appointments: [
      { id: 'a5', patientId: '5', date: 'Feb 27, 2026', time: '10:00 AM', duration: 30, type: 'Routine Cleaning', notes: '' },
    ],
    clinicalNotes: '• Consistently low risk across all scans\n• Excellent oral hygiene — no concerns\n• Non-smoker, non-drinker\n• Routine cleaning only\n• Next visit in 6 months',
    annotations: [],
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
    clinicalNotes: '• Healthy patient — low risk\n• Excellent oral hygiene\n• No risk factors reported\n• Routine cleaning only\n• 6-month recall',
    annotations: [],
  },
  {
    id: '6',
    name: 'Linda Osei',
    age: 67,
    email: 'linda.osei@email.com',
    phone: '+1 (416) 555-0206',
    lastScan: {
      id: 's11',
      date: 'Feb 14, 2026',
      riskLevel: 'yellow',
      score: 44.8,
      mlConfidence: 70.3,
      riskFactors: ['Age 65+', 'Occasional tobacco (historical)'],
    },
    scanHistory: [
      { id: 's11', date: 'Feb 14, 2026', riskLevel: 'yellow', score: 44.8, mlConfidence: 70.3, riskFactors: ['Age 65+'] },
      { id: 's12', date: 'Jan 28, 2026', riskLevel: 'yellow', score: 41.2, mlConfidence: 67.0, riskFactors: ['Age 65+'] },
    ],
    appointments: [
      { id: 'a6', patientId: '6', date: 'Feb 27, 2026', time: '2:00 PM', duration: 45, type: 'Checkup', notes: 'Persistent moderate risk — age-related monitoring' },
    ],
    clinicalNotes: '• Age 67 — elevated baseline risk\n• Former smoker (quit 2015)\n• Two consecutive yellow flags on MouthWatch\n• Scores stable — not escalating\n• Continue 3-month monitoring schedule\n• Dry mouth reported — recommend saliva substitute',
    annotations: [
      { id: 'ann8', position: [-0.1, -0.15, 0.4], severity: 'watch', label: 'Dry tissue area', note: 'Xerostomia-related — recommend hydration + saliva substitute' },
      { id: 'ann9', position: [0.35, -0.05, 0.36], severity: 'info', label: 'Old restoration', note: 'Crown from 2018 — still intact' },
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