import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomeMan from "./components/HomeMan";
import './App.css'
import Demo from "./components/Demo";

function App() {
  return (
    <Router>
      <div>
        <nav style={{ margin: "20px" }}>
          <NavLink to="/register" style={{ marginRight: "20px" }}>
            Register
          </NavLink>
          <NavLink to="/demo">DEMO</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homeman" element={<HomeMan />} />
          <Route path="/demo" element={<Demo/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
