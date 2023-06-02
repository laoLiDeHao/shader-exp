import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from '../pages/home/home';
import About from '../pages/about/about';
import APlane from '../pages/shader/Aplane';
import SmileAnimation from '../pages/shader/shaders/SmileAnimation';
import Grassmaterial from "../pages/shader/shaders/Grassmaterial";
import ClassNoisematerial from "../pages/shader/shaders/ClassNoisematerial";
function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Inits/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/APlane' element={<APlane/>}></Route>

        <Route path='/SmileAnimation' element={<SmileAnimation/>}></Route>
        <Route path='/Grassmaterial' element={<Grassmaterial/>}></Route>
        <Route path='/ClassNoisematerial' element={<ClassNoisematerial/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoute;


function Inits() {
  return (<div className="App">
    <header className="App-header">
      <p>
        welcome my blog Edit with Reactjs
      </p>
      <p>
        shaders:
      </p>
      <p>
        👉：<a href="/SmileAnimation">Smile face</a> <br />
        👉：<a href="/Grassmaterial">Grass material</a><br />
        👉：<a href="/ClassNoisematerial">ClassNoise material</a><br />
      </p>
    </header>
  </div>)
}


