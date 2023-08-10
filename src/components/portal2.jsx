import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'

extend(geometry)
const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

export const Portal2 = () => (
  <Canvas camera={{ fov: 100, position: [0, 0, 20] }} eventSource={document.getElementById('root')} eventPrefix="client">
    <color attach="background" args={['#000000']} />
    <Frame id="01" name="home" author="" bg="#e4cdac" position={[-2.4, 0, 0]} rotation={[0, 0.22, 0]}>
      <Gltf src="fiesta_tea.glb" position={[-2.5, -2, -3]} />
    </Frame>
    <Frame id="02" name="about" author="" bg="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0.2, 0]}>
      <Gltf src="cozy_day.glb" position={[0, -0.7, -2]} />
    </Frame>
    <Frame id="03" name="projects" author="">
      <Gltf src="fiesta_tea.glb" position={[0, -2, -3]} />
    </Frame>
    <Frame id="04" name="travel" author="" bg="#d1d1ca" position={[1.15, 0, 0]} rotation={[0, -0.2, 0]}>
      <Gltf src="fiesta_tea.glb" scale={2} position={[0, -0.8, -4]} />
    </Frame>
    <Frame id="05" name="contact" author="" bg="#e4cdac" position={[2.4, 0, 0]} rotation={[0, -0.2, 0]}>
      <Gltf src="fiesta_tea.glb" scale={8} position={[0, -0.7, -2]} />
    </Frame>
    <Rig />
  </Canvas>
)

function Frame({ id, name, author, bg, width = 1, height = 1.61803398875, children, ...props }) {
  const portal = useRef()
  const [, setLocation] = useLocation()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((state, dt) => easing.damp(portal.current, 'blend', params?.id === id ? 1 : 0, 0.2, dt))
  return (
    <group {...props}>
      <Text font={suspend(medium).default} fontSize={0.15} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]} material-toneMapped={false}>
        {name}
      </Text>
      <Text font={suspend(regular).default} fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
        /{id}
      </Text>
      <Text font={suspend(regular).default} fontSize={0.04} anchorX="right" position={[0.0, -0.677, 0.01]} material-toneMapped={false}>
        {author}
      </Text>
      <mesh name={id} onDoubleClick={(e) => (e.stopPropagation(), setLocation('/item/' + e.object.name))} onPointerOver={(e) => hover(true)} onPointerOut={() => hover(false)}>
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={params?.id === id} side={THREE.DoubleSide}>
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function Rig({ position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 1) }) {
  const { controls, scene } = useThree()
  const [, params] = useRoute('/item/:id')
  useEffect(() => {
    const active = scene.getObjectByName(params?.id)
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 2.25))
      active.parent.localToWorld(focus.set(0, 0, -4))
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })
  return <CameraControls makeDefault />
}
