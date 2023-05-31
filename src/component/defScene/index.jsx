import { Suspense } from "react";
import "./style.scss";
import App from "./App";
import Overlay from "./Overlay";

export default function DefScene() {
  return (
    <>
      <Suspense fallback={null}>
        <App />
      </Suspense>
      <Overlay/>
      <div className="header">
        <span>ART</span>
        <span>Design</span>
        <span>Web</span>
        <span>Support</span>
      </div>
    </>
  );
}
