import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
export const ShaderHappy = shaderMaterial(
  {
    uTime: 0,

  },
  glsl`
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv; //   不加flat将以整个材质为整体渲染，加上flat将以 1 网格结构为整体渲染
    varying vec3 vPattern;
    void main() {
      vNormal = normal;
      vPosition = position;
      vUv = uv;

       gl_Position = projectionMatrix*modelViewMatrix * vec4(position, 1.0);
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

    float Smiley( vec2 uv,vec2 p , float size){

      uv -= p ;
      uv *= 1./size;

      float c = Circle(uv,vec2(.0),.4,.01);
      c-= Circle(uv,vec2(.13,.18),.08,.03);
      c-= Circle(uv,vec2(-.13,.18),.08,.03);

      float mouth = Circle(uv,vec2(.0,.0),.3,.01);
      mouth -=  Circle(uv,vec2(.0,.1),.3,.01);
      float face = c-mouth;


      return face;
    }
    void main() {
      
      vec2 uv = vUv;
      uv-=.5;
      float mask = Smiley(uv,vec2(.0),1.);

      
      vec3 col =vec3(Ract(uv,-0.1,0.1,-0.2,0.2,0.01));
      col = vec3(1.,1.,0.)*mask;
      // gl_FragColor = vec4(vec3(tile,1.),1.0);//最终是生成了方向不同的小片，然后对小片的颜色在处理就是随机的图案了
      gl_FragColor = vec4(vec3(col),1.0);
    }
`,
);