import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
export const ClassNoise1 = shaderMaterial(
  {
    uTime: 0,
    uSample:0
  },
  glsl`
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vPattern;
    varying vec2 vUv; //   不加flat将以整个材质为整体渲染，加上flat将以 1 网格结构为整体渲染
    varying vec2 iPos;
    varying vec2 fPos;
    varying vec2 vTile;
    varying float vRnd;
    varying float vValue;

   
    float random (vec2 st) {
      return fract(sin(dot(st.xy,
                           vec2(12.9898,78.233)))*
          43758.5453123);
    }

    vec2 truchetPattern(in vec2 _st, in float _index){
      _index = fract(((_index-0.5)*2.0));
      if (_index > 0.750) {
          _st = vec2(1.0) - _st;
      } else if (_index > 0.5) {
          _st = vec2(1.0-_st.x,_st.y);
      } else if (_index > 0.250) {
          _st = 1.0-vec2(1.0-_st.x,_st.y);
      }
      return _st;
  }


    void main() {
      vNormal = normal;
      vPosition = position;
      vUv = uv;
      vec2 st = uv;
      float rnd = random( st );
      st *= 10.0; // Scale the coordinate system by 10
      vec2 ipos = floor(st);  // get the integer coords
      vec2 fpos = fract(st);  // get the fractional coords
      vec3 pattern = vec3(random( ipos ));
      // GOTO 10 迷宫
      vec2 tile = truchetPattern(fpos, random( ipos ));

      gl_Position = projectionMatrix*modelViewMatrix * vec4(position, 1.0);

      iPos = ipos;
      fPos = fpos;
      vTile = tile;
      vRnd = rnd;
      vPattern = pattern;

    }
`,
  glsl`
    uniform float uTime;
    uniform float uSample;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vPattern;
    varying vec2 vUv; //   不加flat将以整个材质为整体渲染，加上flat将以 1 网格结构为整体渲染
    varying vec2 ipos;
    varying vec2 fpos;
    varying vec2 vTile;
    varying float vValue;
    varying float vRnd;
    #define PI 3.14159265359
   

    void main() {
      float blur = .05;
      vec3 col=vec3(.1,1.,.1);
      vec2 tile = vTile;
      float GOTO10 = smoothstep(tile.x-blur,tile.x,tile.y)-smoothstep(tile.x,tile.x+blur,tile.y);
      
      
      if(uSample ==  0. ){
        col = vec3(vRnd);
      }else if(uSample == 1.){
        col = vPattern;
      }else if(uSample == 2.){
        col = vec3(GOTO10);
      }
      
      // col = vPattern;
      // col = vec3(GOTO10);

      gl_FragColor = vec4(col,1.);
    }
`,
);