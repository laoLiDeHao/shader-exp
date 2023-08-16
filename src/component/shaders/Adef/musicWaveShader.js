import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const MusicShader = shaderMaterial(
  {
    uTime:0,
    uAudioFrequency:0
  },
  glsl`
    uniform float uAudioFrequency;

    uniform float uTime;
    varying vec2 vUv;
    varying float uPattern;
    
    #define PI 3.14159265358979

    int windows = 0;
    vec2 m = vec2(1.3);

    float hash( in vec2 p ) 
    {
        return fract(sin(p.x*15.32+p.y*5.78) * 43758.236237153);
    }


    vec2 hash2(vec2 p)
    {
      return vec2(hash(p*.754),hash(1.5743*p.yx+4.5891))-.5;
    }

    vec2 hash2b( vec2 p )
    {
        vec2 q = vec2( dot(p,vec2(127.1,311.7)), 
              dot(p,vec2(269.5,183.3)) );
      return fract(sin(q)*43758.5453)-.5;
    }


    mat2 m2= mat2(.8,.6,-.6,.8);

    float EsseInQuint (float x){
      return pow (x,5.0);
    }

    // Gabor/Voronoi mix 3x3 kernel (some artifacts for v=1.)
    float gavoronoi3(in vec2 p)
    {    
      // time
      float time = uTime;
      float timeAdd = mix(1.0,3.0,EsseInQuint(uAudioFrequency));

      time+=timeAdd;
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float f = 3.*PI;//frequency
        float v = 1.0;//cell variability <1.
        float dv = 0.0;//direction variability <1.

        vec2 dir = m + cos(uTime);//vec2 m (.7,.7);
        float va = 0.0;
        float wt = 0.0;
        for (int i=-1; i<=1; i++) 
      for (int j=-1; j<=1; j++) 
      {		
            vec2 o = vec2(i, j)-.5;
            vec2 h = hash2(ip - o);
            vec2 pp = fp +o;
            float d = dot(pp, pp);
            float w = exp(-d*4.);
            wt +=w;
            h = dv*h+dir;//h=normalize(h+dir);
            va += cos(dot(pp,h)*f/v)*w;
      }    
        return va/wt;
    }
    
    float noise( vec2 p)
    {   
        return gavoronoi3(p);
    }

    float map(vec2 p){
      return 2.*abs( noise(p*2.));
    }
    
    vec3 nor(in vec2 p)
    {
      const vec2 e = vec2(0.01, 0.0);
      return -normalize(vec3(
        map(p + e.xy) - map(p - e.xy),
        map(p + e.yx) - map(p - e.yx),
        1.0));
    }
    
    void main() {
     

      vec3 light = normalize(vec3(3., 2., -1.));
      float r = dot(nor(uv), light);
      float displacement = clamp(1.0-r,0.0,0.2) + uAudioFrequency/2.0;
      vec3 newPosition = position +normal*displacement;
      gl_Position = projectionMatrix*modelViewMatrix * vec4(newPosition, 1.0);
      vUv = uv;
      uPattern = r;
    }
`,
  glsl`
    uniform float uTime;  
    uniform float uAudioFrequency;
    varying vec2 vUv;
    varying float uPattern;
    
    // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    // Created by S.Guillitte
    //Based on Voronoise by iq :https://www.shadertoy.com/view/Xd23Dh
    //and Gabor 4: normalized  by FabriceNeyret2 : https://www.shadertoy.com/view/XlsGDs


    struct ColorStop {
        vec3 color;
        float position;
    };
    
    /* ** COLOR_RAMP macro by Arya Ross -> based on Blender's ColorRamp Node in the shading tab
    ColorStop[?] colors -> array of color stops that can have any length
    float factor -> the position that you want to know the color of -> [0, 1]
    vec3 finalColor -> the final color based on the factor 
    
    Line 5 Of The Macro:
    // possibly is bad for performance 
    index = isInBetween ? i : index; \
    
    Taken From: https://stackoverflow.com/a/26219603/19561482 
    index = int(mix(float(index), float(i), float(isInBetween))); \
    */
    #define COLOR_RAMP(colors, factor, finalColor) { \
        int index = 0; \
        for(int i = 0; i < colors.length() - 1; i++){ \
          ColorStop currentColor = colors[i]; \
          bool isInBetween = currentColor.position <= factor; \
          index = int(mix(float(index), float(i), float(isInBetween))); \
        } \
        ColorStop currentColor = colors[index]; \
        ColorStop nextColor = colors[index + 1]; \
        float range = nextColor.position - currentColor.position; \
        float lerpFactor = (factor - currentColor.position) / range; \
        finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
    } \


    void main() {
      
    // float time = uTime*3.0*(1.0+uAudioFrequency);
    float time = uTime*3.0*(1.0+uAudioFrequency*10.);
    vec3 color;

    vec3 mainColor = vec3(0.1,0.4,0.9);
    
    mainColor.r *= 0.9+sin(time)/3.2;
    mainColor.g *= 1.1+cos(time/2.0)/2.5;
    mainColor.b *= 0.8+cos(time/5.0)/4.0;

    mainColor.rgb += 0.1;

    ColorStop[4] colors = ColorStop[](
      ColorStop(vec3(1),0.0),
      ColorStop(vec3(1),0.01),
      ColorStop(mainColor,0.1),
      ColorStop(vec3(0.1,0.05,0.0),1.0)
    );

    COLOR_RAMP(colors,uPattern,color);
    gl_FragColor = vec4(color,1);
    // gl_FragColor = vec4(vec3(0.2,0.4,1),1);
  }
`
);
