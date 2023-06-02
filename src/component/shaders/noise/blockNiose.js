import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
export const BlockNoise = shaderMaterial(
  {
    uTime: 0,
  },
  glsl`
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vPattern;
    varying vec2 vUv; //   不加flat将以整个材质为整体渲染，加上flat将以 1 网格结构为整体渲染





    void main() {
      vNormal = normal;
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix*modelViewMatrix * vec4(position, 1.0);

  

    }
`,
  glsl`
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vPattern;
    varying vec2 vUv; //   不加flat将以整个材质为整体渲染，加上flat将以 1 网格结构为整体渲染


    #define PI 3.14159265359
    // 2D Random
    float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))
                * 43758.5453123);
  }

  // 2D Noise based on Morgan McGuire @morgan3d
  // https://www.shadertoy.com/view/4dS3Wd
  float randomNoise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }

  float random2(vec2 st){
      st = vec2( dot(st,vec2(120.1,311.7)),
                dot(st,vec2(269.5,183.3)) );
      
      return -1.0 + 2.0 * fract( sin( dot( st.xy, vec2(12.9898,78.233) ) ) * 43758.5453123);
  }

  float valueNoise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
    
    vec2 u = f*f*(3.0-2.0*f);

      return mix( mix( random2( i + vec2(0.0,0.0) ), 
                      random2( i + vec2(1.0,0.0) ), u.x),
                  mix( random2( i + vec2(0.0,1.0) ), 
                      random2( i + vec2(1.0,1.0) ), u.x), u.y);
  }

  // Gradient Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/XdXGW8
  vec2 random3(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

  float gradeNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random3(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                    dot( random3(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random3(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                    dot( random3(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }

  void main() {
    vec2 st = vUv;
    vec3 col=vec3(.1,1.,.1);
      // Scale the coordinate system to see
  // some noise in action
  vec2 pos = vec2(st*5.0);
  

  // Use the noise function
  float randNoise = randomNoise(pos);
  float valNoise = valueNoise(vec2(st*10.0))*.5+.5;
  float gradNoise =  gradeNoise(vec2(st*10.0))*.5+.5;

  col = vec3(smoothstep(.4,.5,gradNoise));

   

  gl_FragColor = vec4(col,1.);
  }
`,
);