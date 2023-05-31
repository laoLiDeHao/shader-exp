import logo from '../logo.svg';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from '../pages/home/home';
import About from '../pages/about/about';
import APlane from '../pages/shader/Aplane';
function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Inits/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/APlane' element={<APlane/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoute;


function Inits() {
  return (<div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        welcome my blog Edit with Reactjs
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>)
}


