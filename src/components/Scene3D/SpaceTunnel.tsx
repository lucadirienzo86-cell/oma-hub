'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Tunnel spaziale che reagisce al movimento del mouse
 */
function SpaceTunnel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Posizione mouse normalizzata (-1 a 1)
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;

    // Interpolazione morbida verso la posizione del mouse
    mouse.current.x = THREE.MathUtils.lerp(
      mouse.current.x,
      (state.pointer.x * 0.3),
      0.05
    );
    mouse.current.y = THREE.MathUtils.lerp(
      mouse.current.y,
      (state.pointer.y * 0.3),
      0.05
    );

    // Rotazione del tunnel basata sul mouse
    meshRef.current.rotation.x = mouse.current.y;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 + mouse.current.x;

    // Leggera deformazione pulsante
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    meshRef.current.scale.set(scale, scale, scale);
  });

  // Geometria del tunnel con molti segmenti
  const tubeGeometry = useMemo(() => {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, -20),
      new THREE.Vector3(0, 0, -30),
    ]);
    return new THREE.TubeGeometry(path, 100, 8, 32, false);
  }, []);

  // Particelle fluttuanti nel tunnel
  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
      const z = (Math.random() - 0.5) * 60;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  return (
    <>
      {/* Tunnel principale */}
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#D4C5B5"
          side={THREE.BackSide}
          roughness={0.8}
          metalness={0.1}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Particelle */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#8B7D6B"
          size={0.08}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Illuminazione */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 10]} intensity={0.8} color="#F5F0EB" />
      <pointLight position={[0, 0, -10]} intensity={0.4} color="#B8A99A" />
    </>
  );
}

/**
 * Componente wrapper principale per la scena 3D
 */
export default function SpaceTunnelScene() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#F5F0EB']} />
        <fog attach="fog" args={['#F5F0EB', 10, 40]} />
        <Suspense fallback={null}>
          <SpaceTunnel />
        </Suspense>
      </Canvas>
    </div>
  );
}
