import React, { useEffect, useState } from "react";
import MovieCard from "../screens/MovieCard";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import MovieModal from "../screens/MovieModal";
import Loader from "../screens/Loader";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import "./Home.css";
const baseurl = process.env.REACT_APP_API_URL;

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state

  const { isSignedIn, user, isLoaded } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const handleLogIn = async () => {
    try {
      const response = await axios.post(
        `${baseurl}auth/login`,
        {
          username: userEmail, // Use "username" here
          password: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      const token = response.data?.token; // Adjust according to your API's token structure
      if (token) {
        // Save token to local storage
        localStorage.setItem("token", token);
      }
    } catch (error) {}
  };
  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${baseurl}auth/register`, {
        username: userEmail, // Assuming name is used as the username
        password: userEmail,
        email: userEmail,
      });

      if (response.status >= 200 && response.status < 300) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
          toast.success("Login successful!");
        }
      }
    } catch (error) {
      if (
        error?.response?.data?.errors?.Username[0] ===
        "Username is already taken"
      ) {
        handleLogIn();
      }
    }
  };

  useEffect(() => {
    if (isSignedIn && !localStorage.getItem("token")) {
      handleSignIn();
    }
    if (!isSignedIn) {
      localStorage.removeItem("token");
    }
  }, [isSignedIn]);

  useEffect(() => {
    // Define the async function to fetch data
    const fetchData = async () => {
      try {
        // Make the GET request
        const response = await axios.get(`${baseurl}movies`);
        setData(response.data); // Set the data received from the API
      } catch (err) {
        setError(err.message); // Set the error message if the request fails
      } finally {
        setLoading(false); // Turn off the loading state
      }
    };

    fetchData(); // Call the fetchData function
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Popular Movies</h1>
        <Button
          className="add-movie-btn"
          onClick={handleShow}
        >
          Add Movie
        </Button>
      </div>

      {/* Show Loader while data is loading */}
      {loading ? (
        <Loader loading={loading} type="ring" color="#3498db" size={60} />
      ) : error ? (
        <div className="text-center text-danger">
          <p>{error}</p>
        </div>
      ) : (
        <Row>
          {data?.map((movie, index) => (
            <Col
              md={3}
              key={index}
              className="d-flex justify-content-center mb-4"
            >
              <MovieCard
                movieID={movie.id}
                title={movie.title}
                image={movie.imageUrl}
                rating={movie.averageRating}
                description={movie.summary}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Adding New Movie */}
      <MovieModal show={showModal} handleClose={handleClose} />
    </Container>
  );
};

export default Home;
