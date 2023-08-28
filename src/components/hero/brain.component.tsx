import { OrbitControls, shaderMaterial } from '@react-three/drei';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { CatmullRomCurve3, Color, DoubleSide, Vector3 } from 'three';

import { brain } from '@/constant/brain';

const curves = new Array<CatmullRomCurve3>();
const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;
const paths = brain[0].paths;

const brainCurves = new Array<CatmullRomCurve3>();

paths.forEach((path) => {
  const points = new Array<Vector3>();
  for (let i = 0; i < path.length; i += 3) {
    points.push(new Vector3(path[i], path[i + 1], path[i + 2]));
  }
  brainCurves.push(new CatmullRomCurve3(points));
});

for (let i = 0; i < 100; i++) {
  const points = new Array<Vector3>();
  const length = randomRange(0.1, 1);

  for (let j = 0; j < 100; j++) {
    points.push(
      new Vector3().setFromSphericalCoords(
        1,
        Math.PI - (j / 100) * Math.PI * length,
        (i / 100) * Math.PI * 2
      )
    );
  }
  curves.push(new CatmullRomCurve3(points));
}

function Tube({ curve }: { curve: CatmullRomCurve3 }) {
  const brainMaterialRef = useRef<never>(null);

  useFrame(({ clock }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (brainMaterialRef?.current?.uniforms) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      brainMaterialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const BrainMaterial = shaderMaterial(
    { time: 0, color: new Color(0.2, 0.4, 0.1) },
    `
    varying vec2 vUv;
    uniform float time;
    varying float vProgress;
    void main() {
      vUv = uv;
      vProgress = smoothstep(1.,-1.,sin(vUv.x * 8. + time));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    varying float vProgress;
    void main() {
      vec3 color1 =vec3(1,0,0);
      vec3 color2 =vec3(1,1,0);
      vec3 finalColor = mix(color1,color2,vProgress);
      gl_FragColor.rgba = vec4(finalColor,1);
    }
  `
  );

  extend({ BrainMaterial });

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.001, 3, false]} />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*// @ts-ignore*/}
      <brainMaterial ref={brainMaterialRef} side={DoubleSide} />
    </mesh>
  );
}

function Tubes() {
  return (
    <>
      {brainCurves.map((curve, index) => (
        <Tube key={index} curve={curve} />
      ))}
    </>
  );
}

export const BrainComponent = () => {
  return (
    <div className={'h-screen w-screen absolute top-0 left-0 z-0'}>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <color attach={'background'} args={['black']} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Tubes />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
