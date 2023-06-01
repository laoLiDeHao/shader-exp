import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
export const GridChange1 = shaderMaterial(
  {
    uTime: 0,

  },
  glsl`
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv; //   不加flat将以整个材质为整体渲染，加上flat将以 1 网格结构为整体渲染
    varying vec3 vPattern;

    
    float random (in vec2 _st) {
      return fract(sin(dot(_st.xy,
                           vec2(12.9898,78.233)))*
          43758.5453123);
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
  

      float sample1 = random(st);
      // vec3 newPosition = normal*vec3(random( ipos ))+position*abs(cos(uTime)*2.);//random( st )
      vec3 newPosition = normal*vec3(sample1)+position;//
   
       newPosition.z *= random(uv);

      newPosition.x +=pow(newPosition.z,5.)*abs(sin(uTime)*.5)*.5;

       gl_Position = projectionMatrix*modelViewMatrix * vec4(newPosition, 1.0);

       vPattern = vec3(sample1);
    }
`,
  glsl`
    uniform vec2 u_resolution;
    uniform float uTime;
    varying vec3 vPosition;
    varying vec2 vUv; 
    varying vec3 vPattern;
    #define PI 3.14159265359
    
    float Circle(vec2 uv,vec2 p, float r, float blur){
      float d = length(uv-p);
      float c = smoothstep(r,r-blur,d);
      return c;
    }
    float Band(float t, float start,float end , float blur){
      float step1 = smoothstep(start-blur,start+blur,t);
      float step2 = smoothstep(end+blur,end-blur,t);

      return step1*step2;
    }

    float Ract(vec2 uv,float left,float right,float top, float bottom,float blur){

      float band1 = Band(uv.x,left,right,blur);
      float band2 = Band(uv.y,top,bottom,blur);
      float ract = band1*band2;

      return ract;
    }

    void main() {

      


      vec3 col=vec3(.1,1.,.1)*vPattern*vec3(vUv,.6);
      
      gl_FragColor = vec4(col,1.);
    }
`,
);