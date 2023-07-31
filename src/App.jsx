import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { data } from "./data";
import * as THREE from "three";
import { extend } from '@react-three/fiber'

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

console.log(curves);

function Tube({ cur }) {
  // let points = [];
  // console.log(curves);
  // for (let i = 0; i < 10; i++) {
  //   points.push(new THREE.Vector3((i - 5) * 0.5, Math.sin(i * 2) * 10 + 5, 0));
  // }
  // let curve = new THREE.CatmullRomCurve3(points);

  return (
    <>
      <mesh>
        <tubeGeometry args={[cur, 64, 0.007, 8, false]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </>
  );
}

function Tubes() {
  return (
    <>
      {curves.map((cur, i) => (
        <Tube cur={cur} key={i} />
      ))}
    </>
  );
}

function App() {
  return (
    <>
      <Canvas>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Tubes />
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
