/*eslint-disable */
import {
  CameraControls,
  CameraShake,
  Environment,
  shaderMaterial,
} from "@react-three/drei";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { SphereGeometry, TextureLoader } from "three";

import * as THREE from "three";

import { useEffect, useMemo, useRef } from "react";

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Glitch,
} from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { button, useControls } from "leva";
// import { AbsShader } from "./shaders/abstractShader";
import { MusicShader } from "../../../component/shaders/Adef/musicWaveShader";
import { gsap } from "gsap";
import { SunsetEnv } from "../../../component/Environment";
class Visualizer {
  constructor(mesh, frequencyUniformName) {
    this.mesh = mesh;
    this.frequencyUniformName = frequencyUniformName;
    // audio listener
    this.listener = new THREE.AudioListener();
    this.mesh.add(this.listener);
    // global audio source
    this.sound = new THREE.Audio(this.listener);
    this.loader = new THREE.AudioLoader();
    // analyser
    this.analyser = new THREE.AudioAnalyser(this.sound, 32);
  }
  load(path) {
    this.loader.load(path, (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      alert("done");
      // console.log("log done" ,this.sound);
      // this.sound.play();
    });
  }

  playOrPause() {
    if (this.sound.isPlaying) this.sound.pause();
    else this.sound.play();
  }

  getFrequency() {
    return this.analyser.getAverageFrequency();
  }

  update() {
    const freq = Math.max(this.getFrequency() - 100, 0) / 50;
    // console.log(freq);
    return freq;
  }
}

export default function MusicViewShader() {
  const adu = useRef(null);

  const { shake } = useControls({
    shake: false,
  });

  useEffect(() => {
    console.log("adu", adu);
  }, []);
  return (
    <>
      {/* <Audio></Audio> */}
      {/* <audio ref={adu} controls src={TRACK}/> */}
      <Canvas>
        <color attach="background" args={["#000"]} />
        {/* <pointLight position={[0 ,5, 0]}/> */}
        <ambientLight />
        {/* <axesHelper args={[5]} /> */}
        <Scene adu={adu} />
        <CameraControls />
        <SunsetEnv />
        {/* <mesh position={[0, 3, 0]}>
          <planeGeometry></planeGeometry>
          <meshNormalMaterial color={"#FFF"}></meshNormalMaterial>
        </mesh> */}
        {/* <Environment background preset="night" blur={1} /> */}
        <EffectComposer multisampling={8}>
          <Bloom
            kernelSize={3}
            luminanceThreshold={0}
            luminanceSmoothing={0.4}
            intensity={0.2}
          />
          <Bloom
            kernelSize={KernelSize.HUGE}
            luminanceThreshold={0}
            luminanceSmoothing={0}
            intensity={0.2}
          />
          {/* <Glitch/> */}
          <ChromaticAberration ref={adu} offset={[0.0, 0.0]} />
        </EffectComposer>
        {shake && (
          <CameraShake
            maxYaw={0.1} // Max amount camera can yaw in either direction
            maxPitch={0.1} // Max amount camera can pitch in either direction
            maxRoll={0.1} // Max amount camera can roll in either direction
            yawFrequency={0.1} // Frequency of the the yaw rotation
            pitchFrequency={0.1} // Frequency of the pitch rotation
            rollFrequency={0.1} // Frequency of the roll rotation
            intensity={2} // initial intensity of the shake
            decayRate={0.1} // if decay = true this is the rate at which intensity will reduce at />
          />
        )}
        {/* <Environment preset="night" blur={0.8} background /> */}
      </Canvas>
    </>
  );
}

extend({ MusicShader });

function Scene({ adu = null }) {
  const refs = useRef([]);
  const geo = useMemo(() => new SphereGeometry(1, 100, 100), []);
  const mat = useMemo(() => new MusicShader(), []);
  const ico = useMemo(() => new THREE.Mesh(geo, mat), []);
  const wireframe = useMemo(() => new THREE.LineSegments(geo, mat), []);
  const WIREFRAME_DELTA = 0.015;
  wireframe.scale.setScalar(1 + WIREFRAME_DELTA);
  ico.add(wireframe);

  const visualiler = useMemo(() => new Visualizer(ico, "uAudioFrequency"), []);

  const {} = useControls("shader", {
    // PLAY: button(() => {
    //   visualiler.load(TRACK);
    // }),
    play: button(() => {
      visualiler.playOrPause();
    }),
  });

  useFrame(({ clock }) => {
    let freq = visualiler.getFrequency();
    refs.current.forEach((item) => {
      if (freq) {
        item.material.uniforms.uTime.value = clock.getElapsedTime();
        const freqUniform = item.material.uniforms.uAudioFrequency;
        gsap.to(freqUniform, {
          duration: 1.5,
          ease: "Slow.easeOut",
          value: freq / 60,
        });
        const offset = new THREE.Vector2((0.01 * freq) / 50);
        if (adu.current) adu.current.offset = offset;
      }
    });
  });
  useEffect(() => {
    visualiler.load("/music/Ronald Jenkees - Guitar Sound.mp3");
  }, []);
  return (
    <group>
      <primitive object={ico} ref={(ref) => (refs.current[0] = ref)} />
    </group>
  );
}
