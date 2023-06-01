import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
export const ShaderHappy3 = shaderMaterial(
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
    #define S(a,b,t) smoothstep(a,b,t)
    #define sat(x) clamp(x,0.,1.)

    float remap01(float a,float b  ,float t){
      return sat((t-a)/(b-a));
  }

    float remap(float a,float b , float c, float d ,float t){
        return sat((t-a)/(b-a))*(d-c) +c;
    }

    vec2 within (vec2 uv, vec4 rect){

      return (uv-rect.xy)/(rect.zw-rect.xy);
    }

    vec4 Brown (vec2 uv){
      float y = uv.y;
      uv.y += uv.x *.8-.3;
      uv.x -=.1;
      uv -= .5;
      vec4 col =vec4 (0.0);

      float blur = .1;
      float d1 = length(uv);
      float s1 = S(.45, .45-blur,d1);
      float d2 = length(uv-vec2(.1,-.2)*.7);
      float s2 = S(.5,.5-blur,d2);

      float brownMask = sat(s1-s2);

      float colMask = remap01(.7,.8,y)*.75;

      colMask *= S(.6,.9,brownMask);


      vec4 browCol =mix(vec4(.4,.2,.2,1.),vec4(.5),colMask);



   
      col = mix(col,browCol,S(.2,.4,brownMask));
      return col;
    }
    vec4 Eye( vec2 uv,float side){

      uv-= .5;
      uv.x *= side;

      float d =length(uv);
      vec4 irisCol = vec4(.3,.5,1.,.1);//眼睛
      
      vec4 col = mix(vec4(1.),irisCol,S(.1,.7,d)*.5);


      col.rgb*=1.-S(.48,.5,d)*uv.y; //眼影
      col.rgb = mix(col.rgb,vec3(0.),S(.3,.28,d));//眼仁底色


      irisCol.rgb *= 1. +S(.3,.15,d);
      col.rgb = mix(col.rgb,irisCol.rgb,S(.28,.25,d));//眼仁渐变蓝色

      col.rgb = mix(col.rgb,vec3(0.),S(.16,.14,d));//瞳孔
      
      float highlight = S(.1,.05,length(uv-vec2(-.15+sin(uTime)*0.01,.15)));
      highlight += S(.07,.05,length(uv-vec2(-.08+sin(uTime*10.)*0.004,-.08)));


      col.rgb = mix(col.rgb,vec3(1.),highlight);

      col.a = S(.5,.498,d);



      return col;
    }

    vec4 Mouth (vec2 uv) {
      uv -= .5;
      vec4 col = vec4(.5,.18,.05,1.);

      uv.y*=1.5+sin(uTime)*0.08;
      uv.y -=uv.x*uv.x*2. ;//smile


      float d = length(uv);
      col.a = S(.5,.48,d);

      vec3 toothCol = vec3(1.)*S(.6,.35,d);//ADD SHADER to TEETH
      float td = length(uv-vec2(0.,.6)); //teeth
      col.rgb = mix(col.rgb,toothCol,S(.4,.37,td));


      td =length(uv+vec2(0.,.5));
      col.rgb = mix(col.rgb,vec3(1.,.5,.5),S(.5,.2,td));

      return col;
    }

    vec4 Head (vec2 uv) {
      vec4 col = vec4(0.9,0.65,0.1,1.0);
      
      float d = length(uv);

      col.a = S(.5,.49,d);
      

      float edgeShade = remap01(0.35,.5,d);

      edgeShade*=edgeShade; // MORE SMOOTH 

      col.rgb *=1.- edgeShade *.5;

      col.rgb = mix(col.rgb,vec3(.6,.3,.1),S(.47,.5,d));

      float highlight = S(.43 , .405 ,d)*.75;//out high light area
 
      highlight *= remap(.41,-.1,.75,0.,uv.y);// center grade
      highlight *=S(.16,.17,length(uv-vec2(.2,.1)));

      col.rgb = mix (col.rgb , vec3(1.), highlight);


      d = length(uv-vec2(.25,-.2));
      float cheek = S(.2,.1,d)*.22;
      cheek *= S(.18,.115,d);
      col.rgb = mix (col.rgb, vec3(1.,.1,.1),cheek);


      return col;

    }

    vec4 Smiley( vec2 uv){


 
      vec4 col = vec4(vec3(1.),1.0);


      float side = sign(uv.x);
      uv.x = abs(uv.x);
      vec4 head = Head(uv);
      vec4 eye = Eye(within(uv,vec4(.03,-.1,.35,.25)),side);
      vec4 mouth = Mouth(within(uv,vec4(-.3,-.4,.3,-.1)));
      vec4 brown = Brown(within(uv,vec4(.03, .2, .4, .45   )));

      col = mix(col,head,head.a) ;//
      col = mix(col,eye,eye.a) ;//
      col = mix(col,mouth,mouth.a) ;//
      col = mix(col,brown,brown.a);//


      return col;
    }
    void main() {
      
      vec2 uv = vUv;
      uv-=.5;
      
      gl_FragColor =Smiley(uv);
    }
`,
);