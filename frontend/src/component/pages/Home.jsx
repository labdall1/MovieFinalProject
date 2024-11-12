import React, { useEffect, useState } from "react";
import MovieCard from "../screens/MovieCard";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Define the async function to fetch data
    const fetchData = async () => {
      try {
        // Make the GET request
        const response = await axios.get(
          "https://localhost:7219/api/movies"
        );
        setData(response.data); // Set the data received from the API
      } catch (err) {
        setError(err.message); // Set the error message if the request fails
      } finally {
        setLoading(false); // Turn off the loading state
      }
    };

    fetchData(); // Call the fetchData function
  }, []);

  const movies = [
    {
      title: "Inception",
      image: "https://via.placeholder.com/150", // Replace with actual image URL
      rating: 8.8,
      description: "A mind-bending thriller by Christopher Nolan.",
    },
    {
      title: "The Dark Knight",
      image: "https://via.placeholder.com/150",
      rating: 9.0,
      description: "A gripping tale of Batman and Joker.",
    },
    {
      title: "Interstellar",
      image: "https://via.placeholder.com/150",
      rating: 8.6,
      description: "An epic sci-fi journey through space and time.",
    },
    {
      title: "Memento",
      image: "https://via.placeholder.com/150",
      rating: 8.4,
      description: "A complex mystery that plays with memory and time.",
    },
  ];

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Popular Movies</h1>
      <Row>
        {movies.map((movie, index) => (
          <Col
            md={3}
            key={index}
            className="d-flex justify-content-center mb-4"
          >
            <MovieCard
              title={movie.title}
              image={movie.image}
              rating={movie.rating}
              description={movie.description}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
