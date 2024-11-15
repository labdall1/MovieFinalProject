import React from "react";
import NavBar from "./component/nav/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/login/Login";
import SignUp from "./component/signup/SignUp";
import Home from "./component/pages/Home";
import MovieDetail from "./component/screens/MovieDetail";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; // Ensure this is in the component where the toast is triggered
import MovieRating from "./component/rating/MovieRating";
const App = () => {
  return (
    <>
      <ToastContainer style={{backgroundColor:'var(--bg-darker, #16161e)'}} position="top-right" autoClose={5000} hideProgressBar />
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/rating" element={<MovieRating />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
