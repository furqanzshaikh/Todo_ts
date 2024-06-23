import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./features/login/Login";
import SignUp from "./features/signUp/SignUp";
import Todos from "./features/todos/Todos";



const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/todos" element={<Todos/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
