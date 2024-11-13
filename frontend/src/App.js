import React from "react";
import NavBar from "./component/nav/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/login/Login";
import SignUp from "./component/signup/SignUp";
import Home from "./component/pages/Home";
import MovieDetail from "./component/screens/MovieDetail";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { ToastContainer } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const movieData = {
    title: "Inception",
    image: "https://via.placeholder.com/150",
    description: "A mind-bending thriller by Christopher Nolan.",
    director: "Christopher Nolan",
    genre: "Sci-Fi, Thriller",
  };
  return (
    <>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
