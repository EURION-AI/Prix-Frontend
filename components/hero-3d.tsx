'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Center, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function DependencyGraph() {
  const meshRef = useRef<THREE.Group>(null)
  const [activeId, setActiveId] = useState<number | null>(null)
  
  useEffect(() => {
    const handleHover = (e: CustomEvent) => setActiveId(e.detail.id)
    window.addEventListener('feature-hover', handleHover as EventListener)
    return () => window.removeEventListener('feature-hover', handleHover as EventListener)
  }, [])

  // Create a grid of nodes and lines
  const nodes = useMemo(() => {
    const n = []
    for (let i = 0; i < 24; i++) {
      n.push({
        position: [
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        ],
        id: i
      })
    }
    return n
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.04
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.02
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={meshRef}>
        {nodes.map((node, i) => {
          const isActive = activeId !== null && (i % 6 === activeId % 6)
          return (
            <mesh key={i} position={node.position as [number, number, number]}>
              <sphereGeometry args={[isActive ? 0.08 : 0.045, 16, 16]} />
              <meshPhysicalMaterial 
                color={isActive ? "#ec4899" : i % 8 === 0 ? "#22c55e" : "#ffffff"} 
                emissive={isActive ? "#ec4899" : i % 8 === 0 ? "#22c55e" : "#ffffff"}
                emissiveIntensity={isActive ? 4 : 0.4}
                transparent
                opacity={isActive ? 1 : 0.6}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          )
        })}
        
        {/* Connection lines */}
        {nodes.map((node, i) => {
          // Connect to a few nearby nodes for a realistic graph feel
          const connections = [
            nodes[(i + 1) % nodes.length],
            nodes[(i + 3) % nodes.length],
          ]
          
          return connections.map((target, j) => {
            const isActive = activeId !== null && (i % 6 === activeId % 6) && (nodes.indexOf(target) % 6 === activeId % 6)
            
            return (
              <line key={`line-${i}-${j}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([...node.position, ...target.position])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial 
                  color={isActive ? "#ec4899" : "#ffffff"} 
                  transparent 
                  opacity={isActive ? 0.6 : 0.1} 
                  linewidth={isActive ? 2 : 1} 
                />
              </line>
            )
          })
        })}
      </group>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
      <DependencyGraph />
      <Particles count={60} />
    </>
  )
}

function Particles({ count }: { count: number }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 12
      p[i * 3 + 1] = (Math.random() - 0.5) * 12
      p[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return p
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#22c55e"
        transparent
        opacity={0.2}
        sizeAttenuation
      />
    </points>
  )
}

export function Hero3D() {
  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-[700px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }} dpr={1}>
        <Scene />
      </Canvas>
    </div>
  )
}
