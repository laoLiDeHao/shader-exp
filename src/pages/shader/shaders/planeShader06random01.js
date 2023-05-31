import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
export const PlaneShader06random01 = shaderMaterial(
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


    // 噪点
    float random (vec2 st) {
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*1000.); //vec(x,y) x , y的变大会使得x,y正方向而来的黑色区域变多
        // return fract(sin(dot(st.xy,vec2(1.,1.)))*43758.5453123);
    }
  

  vec2 truchetPattern(in vec2 _st, in float _index){
      _index = fract(((_index-0.5)*1.0));
      if (_index > 0.75) {
          _st = vec2(1.0) - _st;
      } else if (_index > 0.5) {
          _st = vec2(1.0-_st.x,_st.y);
      } else if (_index > 0.25) {
          _st = 1.0-vec2(1.0-_st.x,_st.y);
      }
      return _st;
  }

    void main() {
      
      vec2 st = vUv;

      // 雪花屏幕
      // float rnd = random( st );
  
      // gl_FragColor = vec4(vec3(rnd),1.0);

      st *= 10.;
      // st = (st-vec2(5.0))*(abs(sin(uTime*0.2))*5.);
      // st.x += uTime*3.0;
  
      vec2 ipos = floor(st);  // integer
      vec2 fpos = fract(st);  // fraction
  
      vec2 tile = truchetPattern(fpos, random( ipos ));
  
      float color = 0.0;
  
      // Maze
      color = smoothstep(tile.x-0.3,tile.x,tile.y )-
              smoothstep(tile.x,tile.x+0.3,tile.y );
  
      // Circles
      color = (step(length(tile),0.6) -
               step(length(tile),0.4) ) +
              (step(length(tile-vec2(1.)),0.6) -
               step(length(tile-vec2(1.)),0.4) );
  
      // Truchet (2 triangles)
      // color = step(tile.x,tile.y);
      // color = random( ipos );

      color = dot(tile.x,tile.y);
      // gl_FragColor = vec4(vec3(tile,1.),1.0);//最终是生成了方向不同的小片，然后对小片的颜色在处理就是随机的图案了
      gl_FragColor = vec4(vec3(1.),1.0);
    }
`,
);