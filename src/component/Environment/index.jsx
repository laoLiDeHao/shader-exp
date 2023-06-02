import { Environment } from "@react-three/drei";

export function SunsetEnv (){
    return <Environment background files='/texture/venice_sunset_1k.hdr' blur={0.8} />
}