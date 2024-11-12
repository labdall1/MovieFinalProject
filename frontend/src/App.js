import React from "react";
import NavBar from "./component/nav/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/login/Login";
import SignUp from "./component/signup/SignUp";
import Home from "./component/pages/Home";
import MovieDetail from "./component/screens/MovieDetail";

const App = () => {

  const movieData = {
    title: "Inception",
    image: "https://via.placeholder.com/150",
    description: "A mind-bending thriller by Christopher Nolan.",
    director: "Christopher Nolan",
    genre: "Sci-Fi, Thriller",
  };
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* <Route path="/" element={<TopicList />} /> */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/movie/:id" element={<MovieDetail movie={movieData} />} />
      </Routes>
    </Router>
  );
};

export default App;
