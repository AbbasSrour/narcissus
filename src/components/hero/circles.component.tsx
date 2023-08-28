import { Canvas, useFrame } from '@react-three/fiber';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import {
  BufferGeometry,
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3,
} from 'three';

const CircleMesh = () => {
  const circleMeshRef = React.useRef<MeshStandardMaterial>(null);
  const circleGeoRef = React.useRef<BufferGeometry>(null);
  const meshRef = useRef<Mesh>(null);

  const circle = new CircleGeometry(1, 128);
  const originalVertices = React.useRef<Vector3[]>(new Array<Vector3>());

  const planeGeometry = new PlaneGeometry(100, 100); // Adjust dimensions as needed
  const planeMaterial = new MeshBasicMaterial({ visible: false }); // Invisible plane
  const planeMesh = new Mesh(planeGeometry, planeMaterial);

  const [restoring, setRestoring] = React.useState(false);

  useFrame(({ raycaster, camera, mouse }) => {
    if (circleMeshRef?.current && circleGeoRef?.current && meshRef?.current) {
      const mesh = meshRef.current;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planeMesh, true);
      const mousePosition =
        intersects.length > 0 ? intersects[0].point : new Vector3(0, 0, 0);

      const position = new Vector3();
      mesh.getWorldPosition(position);

      const distance = position.distanceTo(mousePosition);
      const vertices = circleGeoRef.current.attributes.position;
      const displacedVertices = new Float32Array(vertices.count * 3);

      if (distance < 1.2 && distance > 0.9) {
        if (restoring) setRestoring(false);
        for (let i = 0; i < vertices.count; i++) {
          const currentVertexPosition = new Vector3().fromBufferAttribute(
            vertices,
            i,
          );
          const originalVertexPosition = originalVertices!.current![i];
          const mouseDistanceFromVertex = mousePosition.distanceTo(
            originalVertexPosition,
          );

          const maxInfluenceDistance = 20;
          let displacedVertexPosition;

          if (mouseDistanceFromVertex < maxInfluenceDistance) {
            const influence =
              1 - mouseDistanceFromVertex / maxInfluenceDistance;
            const dynamicInfluence = Math.pow(influence, 50) * 0.05;
            const directionToMouse = new Vector3()
              .subVectors(mousePosition, originalVertexPosition)
              .normalize();
            const displacementVector =
              directionToMouse.multiplyScalar(dynamicInfluence);
            displacedVertexPosition = originalVertexPosition
              .clone()
              .add(displacementVector);
          } else {
            displacedVertexPosition = currentVertexPosition.lerp(
              originalVertexPosition,
              0.1,
            ); // Gradually restore the original position
          }

          displacedVertices.set(
            [
              displacedVertexPosition.x,
              displacedVertexPosition.y,
              displacedVertexPosition.z,
            ],
            i * 3,
          );
        }

        vertices.array = displacedVertices;
        vertices.needsUpdate = true;
      } else {
        setRestoring(true);
        // Interpolate each vertex back to its original position
        if (!restoring) {
          for (let i = 0; i < vertices.count; i++) {
            const originalVertexPosition = new Vector3(
              originalVertices.current[i * 3],
              originalVertices.current[i * 3 + 1],
              originalVertices.current[i * 3 + 2],
            );
            const currentVertexPosition = new Vector3().fromBufferAttribute(
              vertices,
              i,
            );
            const displacedVertexPosition = currentVertexPosition.lerp(
              originalVertexPosition,
              0.1,
            );

            displacedVertices.set(
              [
                displacedVertexPosition.x,
                displacedVertexPosition.y,
                displacedVertexPosition.z,
              ],
              i * 3,
            );
          }
        }
      }
    }
  });

  const setOriginalVertices = () => {
    if (circleGeoRef.current && originalVertices.current.length === 0) {
      const position = circleGeoRef.current.attributes.position;
      for (let i = 0; i < position.count; i++) {
        originalVertices.current.push(
          new Vector3(position.getX(i), position.getY(i), position.getZ(i)),
        );
      }
    }
  };

  useEffect(() => {
    setOriginalVertices();
  }, [circleGeoRef]);

  return (
    <mesh ref={meshRef}>
      <bufferGeometry attach={'geometry'} ref={circleGeoRef} {...circle} />
      <meshStandardMaterial
        attach={'material'}
        ref={circleMeshRef}
        color={'black'}
      />
    </mesh>
  );
};

export const CirclesComponent = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  return (
    <div className={'w-screen h-screen absolute z-0'}>
      <Canvas camera={{ position: [0, 0, 2] }} ref={canvasRef}>
        <color attach={'transparent'} args={['transparent']} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <CircleMesh />
        {/*<OrbitControls />*/}
      </Canvas>
    </div>
  );
};
