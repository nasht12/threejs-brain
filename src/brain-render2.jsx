import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { data } from "./data";
import BrainTubes from "./brain-tubes";
import { useEffect, useMemo } from "react";
import { shaderMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { extend } from '@react-three/fiber';
import { useRef } from "react";

const paths = data.economics[0].paths;
const randomLength = (min, max) => Math.random() * (max - min) + min;

let brainCurves = [];
paths.forEach((path) => {
  let points = [];
  for (let i = 0; i < path.length; i += 3) {
    points.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]));
  }
  let tempcurve = new THREE.CatmullRomCurve3(points);
  brainCurves.push(tempcurve);
});

function BrainParticles({ allthecurves }) {
  console.log(allthecurves, 'allthecurves');
let density = 10;
let NumberOfPoints = density*allthecurves.length;
  const myPoints = useRef([]);
  const brainGeo = useRef();
  let positions = useMemo(() => {
    let positions = [];
    for (let i = 0; i < NumberOfPoints; i++) {
      positions.push(
        randomLength(-1, 1),
        randomLength(-1, 1),
        randomLength(-1, 1)
      );
    }
    return new Float32Array(positions);
  }, []);

  useEffect(() => {
    for (let i = 0; i < allthecurves.length; i++) {
      for( let j = 0; j < density; j++) {
        myPoints.current.push({
          currentOffset: Math.random(),
          speed: Math.random() * 0.01,
          curve: allthecurves[i],
          curPosition: Math.random(),
        });
      }
    }
  }, []);

  useFrame(({ clock }) => {
    let curPositions = brainGeo.current.attributes.position.array;
    for (let i = 0; i < myPoints.current.length; i++) {
      myPoints.current[i].curPosition += myPoints.current[i].speed;
      myPoints.current[i].curPosition = myPoints.current[i].curPosition % 1;

      let curPoint = myPoints.current[i].curve.getPointAt(myPoints.current[i].curPosition);
      if (curPoint) {
      curPositions[i * 3] = curPoint.x;
      curPositions[i * 3 + 1] = curPoint.y;
      curPositions[i * 3 + 2] = curPoint.z;
      }
    }
    brainGeo.current.attributes.position.needsUpdate = true;
  });

  const BrainParticleMaterial = shaderMaterial(
    { time: 0, color: new THREE.Color(0.1, 0.0, 0.0) },
    // vertex shader
    /*glsl*/ `
      varying vec2 vUv;
      uniform float time;
      varying float vProgress;
  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // gl_PointSize = 50.0;
        gl_PointSize *= (1.0 / - mvPosition.z);
      }
    `,
    // fragment shader
    /*glsl*/ `
      uniform float time;
  
      void main() {
        // Calculate the distance of the fragment from the center of the point
        float dist = length(gl_PointCoord - vec2(0.5));
  
        // Set the alpha (opacity) of the fragment based on the distance
        // You can adjust the values to control the size and opacity of the points
        float alpha = smoothstep(0.5, 0.4, dist);
        gl_FragColor = vec4(vec3(1.0), alpha);
      }
    `
  );
  

  // declaratively
  extend({ BrainParticleMaterial });

  return (
    <>
      <points>
        <bufferGeometry attach="geometry" ref={brainGeo}>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          
        </bufferGeometry>
        <brainParticleMaterial
            attach="material"
            depthTest={false}
            transparent={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
      </points>
    </>
  );
}

function BrainRender2() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 0.3], near: 0.001, far: 5 }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <BrainTubes allthecurves={brainCurves} />
        <BrainParticles allthecurves={brainCurves} />
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default BrainRender2;
