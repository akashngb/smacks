import { useState } from 'react';
import { Patient, CenterView, Annotation, AnnotationSeverity } from './types';
import { MOCK_PATIENTS } from './data/mockData';
import Sidebar from './components/Sidebar';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(MOCK_PATIENTS[0]);
  const [centerView, setCenterView] = useState<CenterView>('model');
  const [selectedSeverity, setSelectedSeverity] = useState<AnnotationSeverity>('watch');
  const [clinicalNotes, setClinicalNotes] = useState(MOCK_PATIENTS[0].clinicalNotes);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setClinicalNotes(patient.clinicalNotes);
    setCenterView('model');
  };

  const handleAddAnnotation = (annotation: Annotation) => {
    const updated = patients.map(p =>
      p.id === selectedPatient.id
        ? { ...p, annotations: [...p.annotations, annotation] }
        : p
    );
    setPatients(updated);
    setSelectedPatient(prev => ({
      ...prev,
      annotations: [...prev.annotations, annotation],
    }));
  };

  const handleSaveNotes = (notes: string) => {
    setClinicalNotes(notes);
    setPatients(patients.map(p =>
      p.id === selectedPatient.id ? { ...p, clinicalNotes: notes } : p
    ));
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚕</span>
            <span style={styles.logoText}>MouthWatch</span>
            <span style={styles.logoBadge}>Dentist Portal</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.onlineIndicator}>
            <div style={styles.onlineDot} />
            <span style={styles.onlineText}>Dr. Sarah Kim</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={styles.main}>
        <Sidebar
          patients={patients}
          selectedPatient={selectedPatient}
          onSelectPatient={handleSelectPatient}
          centerView={centerView}
          onSetCenterView={setCenterView}
        />
        <CenterPanel
          patient={selectedPatient}
          centerView={centerView}
          selectedSeverity={selectedSeverity}
          onSetSeverity={setSelectedSeverity}
          onAddAnnotation={handleAddAnnotation}
          onSetCenterView={setCenterView}
        />
        <RightPanel
          patient={selectedPatient}
          clinicalNotes={clinicalNotes}
          onSaveNotes={handleSaveNotes}
        />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#080e1a',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 56,
    backgroundColor: '#0d1321',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { fontSize: 20 },
  logoText: {
    fontSize: 18,
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  logoBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: '#00c2ff',
    backgroundColor: 'rgba(0,194,255,0.1)',
    border: '1px solid rgba(0,194,255,0.25)',
    borderRadius: 20,
    padding: '2px 10px',
    marginLeft: 4,
  },
  headerRight: { display: 'flex', alignItems: 'center' },
  onlineIndicator: { display: 'flex', alignItems: 'center', gap: 8 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00e676',
  },
  onlineText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 500,
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
};