import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./SearchModal.css"; // Import the new CSS file

const baseurl = process.env.REACT_APP_API_URL;

function SearchModal({ show, onHide }) {
  const [movieTitle, setMovieTitle] = useState(""); // Movie title from input
  const [movieData, setMovieData] = useState(null); // Movie data fetched
  const [error, setError] = useState(""); // Error message
  const [debounceTimer, setDebounceTimer] = useState(null); // Timer for debounce

  const searchMovie = async (query) => {
    try {
      if (!query) {
        setMovieData(null);
        setError("");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_MOVIE_DB_API}`,
        {
          params: {
            api_key: `${process.env.REACT_APP_MOVIE_DB_API_KEY}`,
            query,
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        setMovieData(response.data.results[0]); // Display the first result
        setError("");
      } else {
        setMovieData(null);
        setError("No results found for this title.");
      }
    } catch (error) {
      setError("Error fetching movie data.");
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMovieTitle(value);

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      searchMovie(value);
    }, 500);

    setDebounceTimer(timer);
  };

  const onSubmit = async () => {
    if (!movieData) {
      setError("No movie selected.");
      return;
    }

    const originalRating = movieData.vote_average || 0; // TMDb rating on a scale of 1-10
    const convertedRating = (originalRating / 10) * 5; // Map to 1-5 scale

    try {
      const response = await axios.post(
        `${baseurl}movies`,
        {
          title: movieData.title,
          imageUrl: `${process.env.REACT_APP_MOVIE_DB_API_IMAGE_URL}${movieData.poster_path}`,
          summary: movieData.overview,
          releaseDate: movieData.release_date,
          rating: convertedRating.toFixed(1), // Limit to one decimal
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status <= 210) {
        setError(""); // Clear any previous error
        onHide(); // Close modal after successful submission
      }
    } catch (error) {
      console.error("Failed to add movie:", error);
      setError("Failed to add movie to the list.");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="search-modal" // Add className for styling
    >
      <Modal.Header closeButton>
        <Modal.Title>Search Movies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={movieTitle}
          onChange={handleInputChange}
          placeholder="Enter movie title"
          className="form-control mb-3"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        {movieData && (
          <div className="movie-details">
            <h5>{movieData.title}</h5>
            {movieData.poster_path && (
              <img
                src={`${process.env.REACT_APP_MOVIE_DB_API_IMAGE_URL}${movieData.poster_path}`}
                alt={`${movieData.title} Poster`}
              />
            )}
            <p>
              <strong>Description:</strong> {movieData.overview}
            </p>
            <p>
              <strong>Release Date:</strong> {movieData.release_date}
            </p>
            <p>
              <strong>Rating (1-5):</strong>{" "}
              {((movieData.vote_average / 10) * 5).toFixed(1)}
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-primary" onClick={onSubmit}>
          Add to List
        </Button>
        <Button className="btn-secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SearchModal;
