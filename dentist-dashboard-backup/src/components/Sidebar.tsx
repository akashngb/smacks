import { Patient, CenterView } from '../types';
import { RISK_CONFIG } from '../data/mockData';

interface Props {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (p: Patient) => void;
  centerView: CenterView;
  onSetCenterView: (v: CenterView) => void;
}

export default function Sidebar({ patients, selectedPatient, onSelectPatient, centerView, onSetCenterView }: Props) {
  return (
    <div style={styles.sidebar}>

      {/* Patients Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>PATIENTS</span>
          <span style={styles.patientCount}>{patients.length}</span>
        </div>
        <div style={styles.patientList}>
          {patients.map(patient => {
            const risk = RISK_CONFIG[patient.lastScan.riskLevel];
            const isSelected = patient.id === selectedPatient.id;
            return (
              <div
                key={patient.id}
                style={{
                  ...styles.patientRow,
                  ...(isSelected ? styles.patientRowSelected : {}),
                }}
                onClick={() => onSelectPatient(patient)}
              >
                <div style={styles.patientAvatar}>
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={styles.patientInfo}>
                  <div style={styles.patientName}>{patient.name}</div>
                  <div style={styles.patientMeta}>Age {patient.age} · {patient.lastScan.date}</div>
                </div>
                <div style={{
                  ...styles.riskDot,
                  backgroundColor: risk.color,
                  boxShadow: `0 0 6px ${risk.color}80`,
                }} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.divider} />

      {/* Calendar Mini Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>CALENDAR</span>
        </div>
        <div
          style={{
            ...styles.calendarMini,
            ...(centerView === 'calendar' ? styles.calendarMiniActive : {}),
          }}
          onClick={() => onSetCenterView(centerView === 'calendar' ? 'model' : 'calendar')}
        >
          <div style={styles.calendarMiniHeader}>
            <span style={styles.calendarMonth}>February 2026</span>
            <span style={styles.calendarToggle}>
              {centerView === 'calendar' ? '← Back to Model' : 'Expand →'}
            </span>
          </div>
          <div style={styles.calendarGrid}>
            {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
              <div key={i} style={styles.calendarDay}>
                <div style={styles.calendarDayLabel}>{d}</div>
                <div style={styles.calendarDayNum}>{23 + i}</div>
                {i === 1 && <div style={styles.apptDot} />}
                {i === 2 && <div style={styles.apptDot} />}
                {i === 3 && <div style={{ ...styles.apptDot, backgroundColor: '#FF1744' }} />}
              </div>
            ))}
          </div>
          <div style={styles.upcomingLabel}>
            {selectedPatient.appointments.length} upcoming appointment{selectedPatient.appointments.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 260,
    backgroundColor: '#0d1321',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflowY: 'auto',
  },
  section: { padding: '16px 0' },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1.5,
  },
  patientCount: {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: '1px 7px',
  },
  patientList: { display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' },
  patientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 10px',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  patientRowSelected: {
    backgroundColor: 'rgba(0,194,255,0.08)',
    border: '1px solid rgba(0,194,255,0.15)',
  },
  patientAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.6)',
    flexShrink: 0,
  },
  patientInfo: { flex: 1, minWidth: 0 },
  patientName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  patientMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    margin: '0 16px',
  },
  calendarMini: {
    margin: '0 8px',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  calendarMiniActive: {
    backgroundColor: 'rgba(0,194,255,0.06)',
    border: '1px solid rgba(0,194,255,0.2)',
  },
  calendarMiniHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarMonth: {
    fontSize: 12,
    fontWeight: 700,
    color: '#ffffff',
  },
  calendarToggle: {
    fontSize: 10,
    color: '#00c2ff',
    fontWeight: 600,
  },
  calendarGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calendarDay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  calendarDayLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 600,
  },
  calendarDayNum: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 600,
  },
  apptDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#00c2ff',
  },
  upcomingLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
};