import { useState } from 'react';
import { Patient } from '../types';
import { RISK_CONFIG } from '../data/mockData';

interface Props {
  patient: Patient;
  clinicalNotes: string;
  onSaveNotes: (notes: string) => void;
}

export default function RightPanel({ patient, clinicalNotes, onSaveNotes }: Props) {
  const [notes, setNotes] = useState(clinicalNotes);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveNotes(notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const risk = RISK_CONFIG[patient.lastScan.riskLevel];

  return (
    <div style={styles.panel}>

      {/* Patient Summary */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>PATIENT SUMMARY</div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Latest Risk</span>
            <span style={{ ...styles.summaryValue, color: risk.color, fontWeight: 700 }}>
              {risk.label}
            </span>
          </div>
          <div style={styles.scoreBar}>
            <div style={{
              ...styles.scoreBarFill,
              width: `${patient.lastScan.score}%`,
              backgroundColor: risk.color,
            }} />
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Score</span>
            <span style={styles.summaryValue}>{patient.lastScan.score}/100</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>ML Confidence</span>
            <span style={styles.summaryValue}>{patient.lastScan.mlConfidence}%</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Total Scans</span>
            <span style={styles.summaryValue}>{patient.scanHistory.length}</span>
          </div>
        </div>

        {/* Risk Factors */}
        {patient.lastScan.riskFactors.length > 0 && (
          <div style={styles.riskFactors}>
            {patient.lastScan.riskFactors.map((rf, i) => (
              <div key={i} style={styles.riskFactor}>
                <div style={styles.riskFactorDot} />
                <span style={styles.riskFactorText}>{rf}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.divider} />

      {/* Upcoming Appointment */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>NEXT APPOINTMENT</div>
        {patient.appointments.length > 0 ? (
          <div style={styles.apptCard}>
            <div style={styles.apptType}>{patient.appointments[0].type}</div>
            <div style={styles.apptTime}>
              {patient.appointments[0].date} · {patient.appointments[0].time}
            </div>
            <div style={styles.apptDuration}>{patient.appointments[0].duration} min</div>
            {patient.appointments[0].notes && (
              <div style={styles.apptNotes}>{patient.appointments[0].notes}</div>
            )}
          </div>
        ) : (
          <div style={styles.noAppt}>No upcoming appointments</div>
        )}
      </div>

      <div style={styles.divider} />

      {/* Clinical Notes */}
      <div style={{ ...styles.section, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={styles.notesHeader}>
          <div style={styles.sectionTitle}>CLINICAL NOTES</div>
          <button
            style={{
              ...styles.saveBtn,
              backgroundColor: saved ? 'rgba(0,230,118,0.1)' : 'rgba(0,194,255,0.1)',
              borderColor: saved ? 'rgba(0,230,118,0.3)' : 'rgba(0,194,255,0.25)',
              color: saved ? '#00e676' : '#00c2ff',
            }}
            onClick={handleSave}
          >
            {saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
        <textarea
          style={styles.notesArea}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add clinical notes for this patient..."
          spellCheck={false}
        />
      </div>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    width: 280,
    backgroundColor: '#0d1321',
    borderLeft: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflowY: 'auto',
  },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  summaryValue: { fontSize: 12, color: '#ffffff', fontWeight: 600 },
  scoreBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreBarFill: { height: 3, borderRadius: 2 },
  riskFactors: { marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 },
  riskFactor: { display: 'flex', alignItems: 'center', gap: 8 },
  riskFactorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff1744',
    flexShrink: 0,
  },
  riskFactorText: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  apptCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  apptType: { fontSize: 13, fontWeight: 700, color: '#ffffff' },
  apptTime: { fontSize: 12, color: '#00c2ff', fontWeight: 500 },
  apptDuration: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  apptNotes: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    borderLeft: '2px solid rgba(0,194,255,0.3)',
    paddingLeft: 8,
    marginTop: 4,
    lineHeight: 1.5,
  },
  noAppt: { fontSize: 13, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' },
  notesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveBtn: {
    border: '1px solid',
    borderRadius: 20,
    padding: '3px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  notesArea: {
    flex: 1,
    width: '100%',
    minHeight: 160,
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  },
};