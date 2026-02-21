/// <reference types="@react-three/fiber" />
import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Annotation, AnnotationSeverity } from '../types';
import { SEVERITY_CONFIG } from '../data/mockData';

interface AnnotationPinProps {
  annotation: Annotation;
}

function AnnotationPin({ annotation }: AnnotationPinProps) {
  const [hovered, setHovered] = useState(false);
  const config = SEVERITY_CONFIG[annotation.severity];

  return (
    <group position={annotation.position as [number, number, number]}>
      <mesh>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh
        onPointerOver={(e: any) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          transparent
          opacity={0.95}
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={3} style={{ pointerEvents: 'none' }} position={[0, 0.08, 0]}>
          <div style={{
            backgroundColor: '#0d1321',
            border: `1px solid ${config.color}60`,
            borderRadius: 10,
            padding: '10px 14px',
            minWidth: 180,
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${config.color}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: config.color }} />
              <span style={{
                color: config.color,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: 'uppercase' as const,
              }}>
                {config.label}
              </span>
            </div>
            <div style={{ color: '#ffffff', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
              {annotation.label}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.4 }}>
              {annotation.note}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function TeethModelWithCenter({
  annotations,
  selectedSeverity,
  onAddAnnotation,
  patientId,
  onCenterFound,
}: {
  annotations: Annotation[];
  selectedSeverity: AnnotationSeverity;
  onAddAnnotation: (a: Annotation) => void;
  patientId: string;
  onCenterFound: (center: [number, number, number]) => void;
}) {
  const { scene } = useGLTF('/teeth.glb');
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const clonedScene = scene.clone();
  const hasCentered = useRef(false);
  const dragRef = useRef(false);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  // Reset centering when patient changes so camera snaps to neutral
  useEffect(() => {
    hasCentered.current = false;
  }, [patientId]);

  // Runs every frame until it fires once per patient
  useEffect(() => {
    if (groupRef.current && !hasCentered.current) {
      hasCentered.current = true;

      const box = new THREE.Box3().setFromObject(groupRef.current);
      const c = new THREE.Vector3();
      box.getCenter(c);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);

      camera.position.set(c.x, c.y + maxDim * 0.3, c.z + maxDim * 1.8);
      camera.lookAt(c.x, c.y, c.z);
      camera.updateProjectionMatrix();

      onCenterFound([c.x, c.y, c.z]);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (dragRef.current) {
      dragRef.current = false;
      return;
    }
    e.stopPropagation();
    const point = e.point;
    const label = window.prompt('Annotation label (e.g. "Early cavity"):') || '';
    if (!label.trim()) return;
    const note = window.prompt('Clinical note:') || '';
    onAddAnnotation({
      id: Date.now().toString(),
      position: [point.x, point.y, point.z],
      severity: selectedSeverity,
      label,
      note,
    });
  };

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        onPointerDown={(e: any) => {
          pointerDownPos.current = { x: e.clientX, y: e.clientY };
          dragRef.current = false;
        }}
        onPointerMove={(e: any) => {
          if (pointerDownPos.current) {
            const dx = e.clientX - pointerDownPos.current.x;
            const dy = e.clientY - pointerDownPos.current.y;
            if (Math.sqrt(dx * dx + dy * dy) > 4) {
              dragRef.current = true;
            }
          }
        }}
        onClick={handleClick}
        onPointerOver={() => { document.body.style.cursor = 'crosshair'; }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          pointerDownPos.current = null;
        }}
      />
      {annotations.map(ann => (
        <AnnotationPin key={ann.id} annotation={ann} />
      ))}
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        color: '#00c2ff',
        fontSize: 14,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        Loading model...
      </div>
    </Html>
  );
}

interface Props {
  annotations: Annotation[];
  selectedSeverity: AnnotationSeverity;
  onAddAnnotation: (a: Annotation) => void;
  patientId: string;
}

export default function MouthModel({ annotations, selectedSeverity, onAddAnnotation, patientId }: Props) {
  const [orbitTarget, setOrbitTarget] = useState<[number, number, number]>([0, 0, 0]);

  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 35, near: 0.1, far: 100 }}
      style={{ background: 'transparent' }}
      shadows
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 3]} intensity={1.4} castShadow />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} />
      <pointLight position={[0, 2, 4]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#00c2ff" />

      <Suspense fallback={<LoadingFallback />}>
        <TeethModelWithCenter
          annotations={annotations}
          selectedSeverity={selectedSeverity}
          onAddAnnotation={onAddAnnotation}
          patientId={patientId}
          onCenterFound={setOrbitTarget}
        />
      </Suspense>

      <OrbitControls
        enablePan={true}
        panSpeed={0.6}
        minDistance={1}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.4}
        target={orbitTarget}
      />
    </Canvas>
  );
}