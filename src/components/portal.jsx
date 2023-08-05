import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  useCursor,
  MeshPortalMaterial,
  CameraControls,
  Gltf,
  Text,
  Float,
} from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { navigate } from "wouter/use-location";
import { easing, geometry } from "maath";
import { suspend } from "suspend-react";
import BrainRender from "../plain-sphere";

extend(geometry);
const regular = import("@pmndrs/assets/fonts/inter_regular.woff");
const medium = import("@pmndrs/assets/fonts/inter_medium.woff");

export const Portal = () => {

  return (
    <Canvas
      camera={{ fov: 85, position: [0, 0, 20] }}
      eventSource={document.getElementById("root")}
      eventPrefix="client"
    >
      <color attach="background" args={["#f0f0f0"]} />
      <Frame
        id="00"
        name={`Home`}
        author=""
        bg="#e4cdac"
        position={[-2.3, 0, 0]}
        rotation={[0, 0, 0]}
      >
        <Gltf src="cozy_day.glb" position={[0, -1.5, -3]} />
      </Frame>
      <Frame
        id="01"
        name={`About`}
        author=""
        bg="#e4cdac"
        position={[-1.15, 0, 0]}
        rotation={[0, 0, 0]}
      >
        <Gltf src="cozy_day.glb" position={[0, -1.5, -3]} />
      </Frame>
      <Frame id="02" name="Projects" author="">
        <Gltf src="fiesta_tea.glb" position={[0, -2, -3]} />
      </Frame>
      <Frame
        id="03"
        name="Travel"
        author=""
        bg="#d1d1ca"
        position={[1.15, 0, 0]}
        rotation={[0, 0, 0]}
      >
        <Gltf
          src="still_life_based_on_heathers_artwork.glb"
          position={[0, -0.9, -1]}
        />
      </Frame>
      <Frame
        id="04"
        name="Misc"
        author=""
        bg="#d1d1ca"
        position={[2.3, 0, 0]}
        rotation={[0, 0, 0]}
      >
        <Gltf src="fiesta_tea.glb" position={[0, -2, -3]} />
      </Frame>
      <Rig />
    </Canvas>
  );
};

function Frame({
  id,
  name,
  author,
  bg,
  width = 1,
  height = 1.61803398875,
  children,
  ...props
}) {
  const portal = useRef();
  const [location, setLocation] = useLocation();
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  useCursor(hovered);

  useEffect(() => {
    const handleUnload = () => {
      // Check if the current route is a valid frame
      if (params?.id === id) {
        // Update the window location to the home page
        window.location.href = "/";
      }
    };

    // Add event listener to listen for page unload (reload)
    window.addEventListener("beforeunload", handleUnload);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [id, params]);
  useFrame((state, dt) => {
    easing.damp(portal.current, "blend", params?.id === id ? 1 : 0, 0.2, dt);
  });
  return (
    <group {...props}>
      <Text
        font={suspend(regular).default}
        fontSize={0.1}
        anchorY="top"
        anchorX="left"
        lineHeight={0.8}
        position={[-0.375, 0.715, 0.01]}
        material-toneMapped={false}
      >
        {name}
      </Text>
      <Text
        font={suspend(regular).default}
        fontSize={0.1}
        anchorX="right"
        position={[0.4, -0.659, 0.01]}
        material-toneMapped={false}
      >
        /{id}
      </Text>
      <Text
        font={suspend(regular).default}
        fontSize={0.04}
        anchorX="right"
        position={[0.0, -0.677, 0.01]}
        material-toneMapped={false}
      >
        {author}
      </Text>
      <mesh
        name={id}
        onClick={(e) => (
          e.stopPropagation(), setLocation("/item/" + e.object.name)
        )}
        onPointerOver={(e) => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial
          ref={portal}
          events={params?.id === id}
          side={THREE.DoubleSide}
        >
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}

function Rig({
  position = new THREE.Vector3(0, 0, 2),
  focus = new THREE.Vector3(0, 0, 1),
}) {
  const { controls, scene } = useThree();
  const [, params] = useRoute("/item/:id");
  useEffect(() => {
    const active = scene.getObjectByName(params?.id);
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 2.25));
      active.parent.localToWorld(focus.set(0, 0, -4));
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
  });
  return (
    <CameraControls
      makeDefault
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      // minAzimuthAngle={-Math.PI / 4}
      // maxAzimuthAngle={Math.PI / 4}
      minDistance={0.5}
      maxDistance={10}
      rotateOnStart
    />
  );
}
