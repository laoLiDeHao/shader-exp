import { Vector3 } from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  SpotLight,
  useTexture,
  OrbitControls,
  Html,
} from "@react-three/drei";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

// import * as THREE from "three";
export default function App() {
  return (
    <>
   
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [-2, 2, 6], fov: 80, near: 0.01, far: 20000 }}
      >
        <ambientLight intensity={0.015} />
        <Scene />
        <OrbitControls enablePan={false} />

      </Canvas>
      <div className="topleft">Desgine</div>
    </>
  );
}

function Scene() {
  // This is a super cheap depth buffer that only renders once (frames: 1 is optional!), which works well for static scenes
  // Spots can optionally use that for realism, learn about soft particles here: http://john-chapman-graphics.blogspot.com/2013/01/good-enough-volumetrics-for-spotlights.html
  // const depthBuffer = useDepthBuffer({ frames: 1 });
  const [model, SetModel] = useState(null);
  useEffect(() => {
    new PLYLoader().load("models/ply/Lucy100k.ply", function (geometry) {
      geometry.scale(0.0012, 0.0012, 0.0012);
      geometry.computeVertexNormals();
      SetModel(geometry);
    });
  }, []);
  const [current, setCur] = useState(1);
  const [Pos, setPos] = useState([-0.6, 2.0, 0]);
  useEffect(() => {
    // console.log(current);
    switch (current) {
      case 1:
        setPos([-0.6, 2.0, 0]);
        break;
      case 2:
        setPos([0.6, 2.0, -0.43]);
        break;
      case 3:
        setPos([0.6, 2.0, 0.43]);
        break;
      default:
        console.log("setpos no match", current);
        break;
    }
  }, [current]);

  return (
    <group>
      <MovingSpot position={[4, 3, 5]} />

      <FocusLight position={[-0, 2.0, 0]} Pos={Pos}></FocusLight>
      {model != null && (
        <mesh
          position={[-0.5, -0, 0]}
          rotation={[0, (Math.PI / 3) * 1.5, 0]}
          // castShadow
          receiveShadow
          dispose={null}
          geometry={model}
          onClick={() => setCur(1)}
        >
          <meshLambertMaterial />
        </mesh>
      )}
      {model != null && (
        <mesh
          position={[0.5, -0, -0.43]}
          rotation={[0, (-Math.PI / 3) * 1, 0]}
          // castShadow
          receiveShadow
          dispose={null}
          geometry={model}
          onClick={() => setCur(2)}
        >
          <meshLambertMaterial />
        </mesh>
      )}
      {model != null && (
        <mesh
          position={[0.5, -0, 0.43]}
          rotation={[0, (Math.PI / 3) * 3.5, 0]}
          // castShadow
          receiveShadow
          dispose={null}
          geometry={model}
          onClick={() => setCur(3)}
        >
          <meshLambertMaterial />
        </mesh>
      )}

      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial />
      </mesh>
      <Annotation
        position={[-0.8, 0.3, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={0.1}
      >
        Pure{" "}
        <span
          className="logo"
          onClick={() => setCur(1)}
          style={{ fontSize: "1.5em" }}
        >
          ✨
        </span>
      </Annotation>
      <Annotation
        position={[0.7, 0.8, -0.9]}
        rotation={[0, (Math.PI / 3) * 2.5, 0]}
        scale={0.1}
      >
        Active{" "}
        <span
          className="logo"
          onClick={() => setCur(2)}
          style={{ fontSize: "1.5em" }}
        >
          🌈
        </span>
      </Annotation>
      <Annotation
        position={[0.3, 0, 0.86]}
        rotation={[0, (Math.PI / 3) * 0.8, 0]}
        scale={0.1}
      >
        Stable
        <span
          className="logo"
          onClick={() => setCur(3)}
          style={{ fontSize: "1.5em" }}
        >
          🌎
        </span>
      </Annotation>
    </group>
  );
}

function MovingSpot({ vec = new Vector3(), ...props }) {
  const { position } = props;
  const light = useRef();
  // const viewport = useThree((state) => state.viewport);
  const texture = useTexture("/texture/disturb.jpg");
  useFrame(({ clock }) => {
    // console.log(position);
    light.current.position.x =
      Math.cos(clock.getElapsedTime() / 2) * position[0];
    light.current.position.z =
      Math.sin(clock.getElapsedTime() / 2) * position[2];
  });
  return (
    <SpotLight
      ref={light}
      penumbra={1}
      distance={6}
      angle={0.7}
      attenuation={50}
      anglePower={1000}
      intensity={40}
      {...props}
      map={texture}
    />
  );
}

function FocusLight({ vec = new Vector3(), ...props }) {
  const light = useRef();
  // const viewport = useThree((state) => state.viewport);
  useFrame((state) => {
    light.current.target.position.lerp(
      vec.set(props.Pos[0], 0, props.Pos[2]),
      0.1
    );
    light.current.target.updateMatrixWorld();
  });

  return (
    <SpotLight
      ref={light}
      penumbra={1}
      distance={6}
      angle={0.25}
      attenuation={50}
      anglePower={100000}
      intensity={10}
      {...props}
      // target={0.5,0,0}
    />
  );
}

function Annotation({ children, ...props }) {
  return (
    <Html {...props} transform occlude="blending">
      <div className="annotation">{children}</div>
    </Html>
  );
}
