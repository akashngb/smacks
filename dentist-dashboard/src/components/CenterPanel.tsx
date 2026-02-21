import { Patient, CenterView, Annotation, AnnotationSeverity } from '../types';
import MouthModel from './MouthModel';
import CalendarView from './CalendarView';
import { SEVERITY_CONFIG } from '../data/mockData';

interface Props {
  patient: Patient;
  centerView: CenterView;
  selectedSeverity: AnnotationSeverity;
  onSetSeverity: (s: AnnotationSeverity) => void;
  onAddAnnotation: (a: Annotation) => void;
  onSetCenterView: (v: CenterView) => void;
}

export default function CenterPanel({
  patient, centerView, selectedSeverity,
  onSetSeverity, onAddAnnotation, onSetCenterView
}: Props) {
  return (
    <div style={styles.center}>
      {centerView === 'model' ? (
        <>
          {/* Patient Header */}
          <div style={styles.patientHeader}>
            <div>
              <div style={styles.patientName}>{patient.name}</div>
              <div style={styles.patientSub}>Age {patient.age} · {patient.email}</div>
            </div>
            <div style={styles.scanBadge}>
              Last scan: {patient.lastScan.date}
            </div>
          </div>

          {/* Annotation Toolbar */}
          <div style={styles.toolbar}>
            <span style={styles.toolbarLabel}>Annotation Severity:</span>
            <div style={styles.severityButtons}>
              {(Object.keys(SEVERITY_CONFIG) as AnnotationSeverity[]).map(sev => {
                const config = SEVERITY_CONFIG[sev];
                const isActive = selectedSeverity === sev;
                return (
                  <button
                    key={sev}
                    style={{
                      ...styles.severityBtn,
                      backgroundColor: isActive ? config.bg : 'rgba(255,255,255,0.04)',
                      border: isActive
                        ? `1px solid ${config.color}60`
                        : '1px solid rgba(255,255,255,0.08)',
                      color: isActive ? config.color : 'rgba(255,255,255,0.4)',
                    }}
                    onClick={() => onSetSeverity(sev)}
                  >
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: config.color,
                      display: 'inline-block',
                      marginRight: 6,
                    }} />
                    {config.label}
                  </button>
                );
              })}
            </div>
            <div style={styles.toolbarHint}>
              Click on the model to place annotation
            </div>
          </div>

          {/* 3D Model */}
          <div style={styles.modelContainer}>
            <MouthModel
              annotations={patient.annotations}
              selectedSeverity={selectedSeverity}
              onAddAnnotation={onAddAnnotation}
              patientId={patient.id}
            />
          </div>

          {/* Annotation Legend */}
          <div style={styles.legend}>
            {patient.annotations.map(ann => {
              const config = SEVERITY_CONFIG[ann.severity];
              return (
                <div key={ann.id} style={styles.legendItem}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: config.color,
                    flexShrink: 0,
                  }} />
                  <span style={{ color: config.color, fontWeight: 600, fontSize: 12 }}>
                    {config.label}:
                  </span>
                  <span style={styles.legendText}>{ann.label}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <CalendarView
          patients={[patient]}
          onClose={() => onSetCenterView('model')}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#0a0f1e',
  },
  patientHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  patientName: { fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: -0.3 },
  patientSub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  scanBadge: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '4px 12px',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  toolbarLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  severityButtons: { display: 'flex', gap: 6 },
  severityBtn: {
    padding: '5px 12px',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s',
  },
  toolbarHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    marginLeft: 'auto',
    fontStyle: 'italic',
  },
  modelContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    padding: '10px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
};