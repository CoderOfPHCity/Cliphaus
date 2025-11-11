'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const NorthernLights = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameId = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    rendererRef.current = renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create northern lights particles
    const particleCount = 2000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const auroraColors = [
      new THREE.Color(0x00ff88), // Green
      new THREE.Color(0x00ccff), // Cyan
      new THREE.Color(0x8844ff), // Purple
      new THREE.Color(0x44ff88), // Light green
      new THREE.Color(0x88ccff), // Light blue
    ]

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Position particles in aurora-like formation
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = Math.random() * 50 + 10
      positions[i3 + 2] = (Math.random() - 0.5) * 100

      // Random colors from aurora palette
      const color = auroraColors[Math.floor(Math.random() * auroraColors.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      sizes[i] = Math.random() * 3 + 1
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;

        void main() {
          vColor = color;

          vec3 pos = position;

          // Wave motion for aurora effect
          pos.x += sin(time * 0.5 + position.y * 0.01) * 5.0;
          pos.z += cos(time * 0.3 + position.x * 0.01) * 3.0;
          pos.y += sin(time * 0.7 + position.x * 0.005) * 2.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float time;

        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));

          if (distanceToCenter > 0.5) discard;

          float alpha = 1.0 - distanceToCenter * 2.0;
          alpha *= (sin(time * 2.0) * 0.3 + 0.7); // Pulsing effect

          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2)
    scene.add(ambientLight)

    // Position camera
    camera.position.z = 30
    camera.position.y = 5

    // Animation loop
    const animate = () => {
      frameId.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      material.uniforms.time.value = time

      // Rotate particles slowly
      particles.rotation.y += 0.0005
      particles.rotation.x += 0.0002

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      if (renderer) {
        renderer.dispose()
      }
      if (geometry) {
        geometry.dispose()
      }
      if (material) {
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(ellipse at center, rgba(0,20,40,0.3) 0%, rgba(0,0,0,0.8) 100%)' }}
    />
  )
}

export default NorthernLights
