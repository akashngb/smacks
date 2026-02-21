import { useState } from 'react';
import { Patient } from '../types';
import { RISK_CONFIG } from '../data/mockData';

interface Props {
  patients: Patient[];
  onClose: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DATES = ['Feb 23', 'Feb 24', 'Feb 25', 'Feb 26', 'Feb 27'];
const HOURS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

export default function CalendarView({ patients, onClose }: Props) {
  const [selectedAppt, setSelectedAppt] = useState<any>(null);

  // Flatten all appointments from all patients
  const allPatients = [
    { id: '1', name: 'James Thornton', riskLevel: 'red' as const, appointments: [{ id: 'a1', date: 'Feb 24, 2026', time: '10:00 AM', duration: 60, type: 'Oral Cancer Screening', notes: 'Follow up on high risk MouthWatch result' }] },
    { id: '2', name: 'Sarah Mitchell', riskLevel: 'yellow' as const, appointments: [{ id: 'a2', date: 'Feb 25, 2026', time: '2:00 PM', duration: 30, type: 'Routine Checkup', notes: 'Monitor moderate risk result' }] },
    { id: '3', name: 'Michael Rodriguez', riskLevel: 'green' as const, appointments: [{ id: 'a3', date: 'Feb 26, 2026', time: '11:00 AM', duration: 45, type: 'Cleaning', notes: '' }] },
    { id: '4', name: 'Emily Chen', riskLevel: 'red' as const, appointments: [{ id: 'a4', date: 'Feb 24, 2026', time: '9:00 AM', duration: 90, type: 'Urgent Consultation', notes: 'High risk — prior cancer history' }] },
  ];

  const getApptForSlot = (date: string, hour: string) => {
    for (const p of allPatients) {
      const appt = p.appointments.find(a => a.date === `${date}, 2026` && a.time === hour);
      if (appt) return { ...appt, patientName: p.name, riskLevel: p.riskLevel, patientId: p.id };
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Weekly Schedule</div>
          <div style={styles.subtitle}>Feb 23 – 27, 2026</div>
        </div>
        <button style={styles.closeBtn} onClick={onClose}>← Back to Model</button>
      </div>

      <div style={styles.calendarContainer}>
        {/* Time column */}
        <div style={styles.timeCol}>
          <div style={styles.timeColHeader} />
          {HOURS.map(hour => (
            <div key={hour} style={styles.timeSlot}>
              <span style={styles.timeLabel}>{hour}</span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {DAYS.map((day, di) => (
          <div key={day} style={styles.dayCol}>
            <div style={styles.dayHeader}>
              <div style={styles.dayName}>{day}</div>
              <div style={styles.dayDate}>{DATES[di]}</div>
            </div>
            {HOURS.map(hour => {
              const appt = getApptForSlot(DATES[di], hour);
              const risk = appt ? RISK_CONFIG[appt.riskLevel] : null;
              return (
                <div
                  key={hour}
                  style={styles.slot}
                  onClick={() => appt && setSelectedAppt(appt)}
                >
                  {appt && (
                    <div style={{
                      ...styles.apptBlock,
                      backgroundColor: risk ? `${risk.color}18` : undefined,
                      borderLeft: risk ? `3px solid ${risk.color}` : undefined,
                      cursor: 'pointer',
                    }}>
                      <div style={{ ...styles.apptName, color: risk?.color }}>
                        {appt.patientName}
                      </div>
                      <div style={styles.apptType}>{appt.type}</div>
                      <div style={styles.apptDuration}>{appt.duration} min</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div style={styles.modal} onClick={() => setSelectedAppt(null)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>{selectedAppt.type}</div>
              <button style={styles.modalClose} onClick={() => setSelectedAppt(null)}>✕</button>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalLabel}>Patient</span>
              <span style={styles.modalValue}>{selectedAppt.patientName}</span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalLabel}>Time</span>
              <span style={styles.modalValue}>{selectedAppt.time} · {selectedAppt.duration} min</span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalLabel}>Risk Level</span>
              <span style={{
                ...styles.modalValue,
                color: RISK_CONFIG[selectedAppt.riskLevel as keyof typeof RISK_CONFIG].color,
                fontWeight: 700,
              }}>
                {RISK_CONFIG[selectedAppt.riskLevel as keyof typeof RISK_CONFIG].label}
              </span>
            </div>
            {selectedAppt.notes && (
              <div style={styles.modalNotes}>{selectedAppt.notes}</div>
            )}
            <div style={styles.pdfSection}>
              <div style={styles.pdfTitle}>📄 MouthWatch Patient Report</div>
              <div style={styles.pdfPreview}>
                <div style={styles.pdfRow}>
                  <span style={styles.pdfLabel}>Latest Score</span>
                  <span style={styles.pdfValue}>67.6 / 100</span>
                </div>
                <div style={styles.pdfRow}>
                  <span style={styles.pdfLabel}>ML Confidence</span>
                  <span style={styles.pdfValue}>82.8%</span>
                </div>
                <div style={styles.pdfRow}>
                  <span style={styles.pdfLabel}>Risk Factors</span>
                  <span style={styles.pdfValue}>Tobacco · Alcohol</span>
                </div>
                <div style={styles.pdfRow}>
                  <span style={styles.pdfLabel}>Trend</span>
                  <span style={{ ...styles.pdfValue, color: '#ff1744' }}>Increasing ↑</span>
                </div>
              </div>
              <button style={styles.downloadBtn}>↓ Download Full Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#0a0f1e',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  title: { fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  closeBtn: {
    background: 'rgba(0,194,255,0.08)',
    border: '1px solid rgba(0,194,255,0.2)',
    color: '#00c2ff',
    borderRadius: 20,
    padding: '6px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  calendarContainer: {
    flex: 1,
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  timeCol: {
    width: 72,
    flexShrink: 0,
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  timeColHeader: { height: 52, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  timeSlot: {
    height: 64,
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: 8,
    paddingRight: 10,
    justifyContent: 'flex-end',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  timeLabel: { fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500 },
  dayCol: {
    flex: 1,
    borderRight: '1px solid rgba(255,255,255,0.04)',
  },
  dayHeader: {
    height: 52,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    gap: 2,
  },
  dayName: { fontSize: 12, fontWeight: 700, color: '#ffffff' },
  dayDate: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  slot: {
    height: 64,
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    padding: 4,
  },
  apptBlock: {
    borderRadius: 6,
    padding: '6px 8px',
    height: '100%',
    overflow: 'hidden',
  },
  apptName: { fontSize: 12, fontWeight: 700, marginBottom: 2 },
  apptType: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 1 },
  apptDuration: { fontSize: 10, color: 'rgba(255,255,255,0.3)' },
  modal: {
    position: 'absolute' as const,
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalCard: {
    backgroundColor: '#0d1321',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    width: 380,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: { fontSize: 17, fontWeight: 800, color: '#ffffff' },
  modalClose: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 18,
    cursor: 'pointer',
  },
  modalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  modalValue: { fontSize: 13, color: '#ffffff', fontWeight: 600 },
  modalNotes: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: '10px 12px',
    lineHeight: 1.5,
    borderLeft: '3px solid rgba(0,194,255,0.4)',
  },
  pdfSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  pdfTitle: { fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 4 },
  pdfPreview: { display: 'flex', flexDirection: 'column', gap: 6 },
  pdfRow: { display: 'flex', justifyContent: 'space-between' },
  pdfLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  pdfValue: { fontSize: 12, color: '#ffffff', fontWeight: 600 },
  downloadBtn: {
    marginTop: 4,
    backgroundColor: 'rgba(0,194,255,0.1)',
    border: '1px solid rgba(0,194,255,0.25)',
    color: '#00c2ff',
    borderRadius: 8,
    padding: '8px 0',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
};