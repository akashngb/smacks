/// <reference types="@react-three/fiber" />

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Annotation, AnnotationSeverity } from '../types';
import { SEVERITY_CONFIG } from '../data/mockData';

interface AnnotationPinProps {
  annotation: Annotation;
}

function AnnotationPin({ annotation }: AnnotationPinProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const config = SEVERITY_CONFIG[annotation.severity];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.4 : 1.0);
    }
  });

  return (
    <group position={annotation.position as [number, number, number]}>
      {/* Outer glow ring */}
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

      {/* Main pin */}
      <mesh
        ref={meshRef}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(false);
        }}
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

      {/* Hover tooltip */}
      {hovered && (
        <Html distanceFactor={3} style={{ pointerEvents: 'none' }} position={[0, 0.08, 0]}>
          <div
            style={{
              backgroundColor: '#0d1321',
              border: `1px solid ${config.color}60`,
              borderRadius: 10,
              padding: '10px 14px',
              minWidth: 180,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${config.color}20`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: config.color,
                  boxShadow: `0 0 6px ${config.color}`,
                }}
              />
              <span
                style={{
                  color: config.color,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
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

function TeethModel({
  annotations,
  selectedSeverity,
  onAddAnnotation,
}: {
  annotations: Annotation[];
  selectedSeverity: AnnotationSeverity;
  onAddAnnotation: (a: Annotation) => void;
}) {
  const { scene } = useGLTF('/teeth.glb');
  const groupRef = useRef<THREE.Group>(null);

  const clonedScene = scene.clone();

  clonedScene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
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
        onClick={handleClick}
        onPointerOver={() => {
          document.body.style.cursor = 'crosshair';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      />
      {annotations.map((ann) => (
        <AnnotationPin key={ann.id} annotation={ann} />
      ))}
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div
        style={{
          color: '#00c2ff',
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            border: '2px solid rgba(0,194,255,0.3)',
            borderTop: '2px solid #00c2ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        Loading model...
      </div>
    </Html>
  );
}

interface Props {
  annotations: Annotation[];
  selectedSeverity: AnnotationSeverity;
  onAddAnnotation: (a: Annotation) => void;
}

export default function MouthModel({ annotations, selectedSeverity, onAddAnnotation }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 40 }} style={{ background: 'transparent' }} shadows>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 3]} intensity={1.4} castShadow />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} />
      <pointLight position={[0, 2, 4]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#00c2ff" />

      <Suspense fallback={<LoadingFallback />}>
        <TeethModel
          annotations={annotations}
          selectedSeverity={selectedSeverity}
          onAddAnnotation={onAddAnnotation}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.4}
        autoRotate={false}
      />
    </Canvas>
  );
}