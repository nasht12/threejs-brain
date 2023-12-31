import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { data } from "./data";
import * as THREE from "three";
import { extend } from '@react-three/fiber'
import { useRef } from "react";
import { shaderMaterial } from '@react-three/drei'

const paths = data.economics[0].paths;
const randomLength = (min, max) => Math.random() * (max - min) + min;

let curves = [];
for (let i = 0; i < 100; i++) {
  let points = [];
  const length = randomLength(0.2, 1);
  for (let j = 0; j < 100; j++) {
    points.push(
      new THREE.Vector3().setFromSphericalCoords(
        1,
        Math.PI - (j / 100) * Math.PI * length,
        (Math.PI * 2 * i) / 100
      )
    );
  }
  let tempcurve = new THREE.CatmullRomCurve3(points);
  curves.push(tempcurve);
}

let brainCurves = [];
paths.forEach((path) => {
  let points = [];
  for(let i = 0; i < path.length; i+=3) {
    points.push(new THREE.Vector3(path[i], path[i+1], path[i+2]));
  }
  let tempcurve = new THREE.CatmullRomCurve3(points);
  brainCurves.push(tempcurve);
});

function Tube({ cur }) {
  const brainRef = useRef();

  const { viewport } = useThree();

  useFrame(({ clock, mouse }) => {
    brainRef.current.uniforms.time.value = clock.getElapsedTime();
    brainRef.current.uniforms.mouse.value = new THREE.Vector3(
        mouse.x * viewport.width / 2,
        mouse.y * viewport.height / 2,
        0
    );
  });
  const BrainMaterial = shaderMaterial(
    { time: 0, color: new THREE.Color(0.1, 0.3, 0.6), mouse: new THREE.Vector3() },
    // vertex shader
    /*glsl*/`
      varying vec2 vUv;
      uniform float time;
      uniform vec3 mouse;
      varying float vProgess;

      void main() {
        vUv = uv;
        vProgess = smoothstep(-1.,1.,sin(vUv.x * 8. + time*3.));

        vec3 p = position;
        float maxDistance = 0.05;
        float dist = length(mouse - p);
        if (dist < maxDistance){
            vec3 direction = normalize(mouse - p);
            direction*=(1. - dist/maxDistance);
            p -=direction*0.04;
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    // fragment shader
    /*glsl*/`
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      varying float vProgess;
      void main() {
        vec3 finalColor = mix(color, color*0.20, vProgess);
        float hiddenCorners = smoothstep(0.0, 0.1, vUv.x) + smoothstep(1.0, 0.9, vUv.x);
        gl_FragColor.rgba = vec4(finalColor, hiddenCorners);
      }
    `
  )
  
  // declaratively
  extend({ BrainMaterial })

  return (
    <>
      <mesh>
        <tubeGeometry args={[cur, 64, 0.001, 3, false]} />
        <brainMaterial ref={brainRef} side={THREE.DoubleSide}
        opacity={0.5}
        transparent={true}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        wireFrame={true}
        />
      </mesh>
    </>
  );
}

export default function Tubes({ allthecurves}) {
  return (
    <>
      {allthecurves.map((cur, i) => (
        <Tube cur={cur} key={i} />
      ))}
    </>
  );
}