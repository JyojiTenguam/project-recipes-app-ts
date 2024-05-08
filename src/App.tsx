import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import rockGlass from './images/rockGlass.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Components/Footer';
import Login from './Components/Login';

function App() {
  return (
    <div className="meals">
      <Routes>
        <Route path="/" element={ <Login /> } />
      </Routes>
      <span className="logo">TRYBE</span>
      <object
        className="rocksGlass"
        type="image/svg+xml"
        data={ rockGlass }
        aria-label="Decorative rock glass"
      >
        Glass
      </object>
      <Footer />
    </div>
  );
}

export default App;
