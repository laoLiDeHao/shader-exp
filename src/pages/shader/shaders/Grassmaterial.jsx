import { CameraControls, Grid } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {  PlaneGeometry } from "three";
import { GrassmaterialShader } from "../../../component/shaders/Adef/GrassmaterialShader";
import { SunsetEnv } from "../../../component/Environment";


// import { GridChange1 } from "./04GridsChange";



export default function Grassmaterial() {
  useEffect(()=>{

  },[])
  return (
    <>
      <Canvas>
        <Grid
          renderOrder={-1}
          position={[0, -1.85, 0]}
          infiniteGrid
          cellSize={0.6}
          cellThickness={0.6}
          sectionSize={3.3}
          sectionThickness={1.5}
          sectionColor={[0.5, 0.5, 10]}
          fadeDistance={30}
        />
        <Scene/>
       <SunsetEnv/>
        <CameraControls />
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none',color:'#fff' }}>
      <a  href="https://pmnd.rs/" style={{  position: 'absolute', bottom: 40, left: 90, fontSize: '13px',pointerEvents:'all' }}>
        pmnd.rs
        <br />
        dev collective
      </a>
      <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px', fontFamily: 'Meslo', lineHeight: '1.6em', whiteSpace: 'pre' ,pointerEvents:'all'}}>
        &gt; contact me on Youtube EmberUB
        <br />
        &gt; ll
        <br />
        {`-rw-r--r-- 1 ph  SAME AS BILIBILI`}
        <br />
        {`-rw-r--r-- 1 ph XIIAN CN`}
      </div>
      <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>30/05*2023</div>
      <div style={{ position: 'absolute', bottom: 40, right: 400, fontSize: '13px', pointerEvents:'all' }}>
        <button>点我</button>
      </div>
    </div>
    </>
  );
}

function Scene() {
  const refs = useRef([]);
  const geo = new PlaneGeometry(4, 4, 400, 400);
  const mat = useMemo(() => new GrassmaterialShader(), []);
  
  useFrame(({ clock }) => {
    refs.current.forEach((item) => {
      // console.log(item.material);
      item.material.uniforms.uTime.value = clock.getElapsedTime();
    });

    // ref.current.uTime = clock.getElapsedTime() / 10; //z z xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxs
  });
  return (
    <group>
      <mesh
        geometry={geo}
        ref={(ref) => (refs.current[0] = ref)}
        material={mat}
        position={[0, -2, 0]}
        rotation={[-Math.PI/2,0,0]}
      ></mesh>
    </group>
  );
}
