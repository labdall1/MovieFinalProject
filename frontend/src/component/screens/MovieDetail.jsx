import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviews, setReviews] = useState([]);
  const hasToken = !!localStorage.getItem("token");

  // Fetch movie details by ID
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7219/api/movies/${id}`
        );
        setMovie(response.data);
        setReviews(response.data.reviews);
      } catch (err) {
        setError("Failed to fetch movie details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://localhost:7219/api/movies/${id}/reviews`,
        {
          content: reviewContent,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setReviews((prev) => [...prev, response.data]);
      setRating(0); // Reset rating
      setReviewContent(""); // Reset content field
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          {movie && (
            <Card className="shadow-sm">
              <Card.Img variant="top" src={movie.imageUrl} alt={movie.title} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {movie.summary}
                </Card.Text>
                <Card.Text>
                  <strong>Release Date:</strong>{" "}
                  {dayjs(movie.releaseDate).format("YYYY-MM-DD")}
                </Card.Text>
                <Card.Text>
                  <strong>Average Rating:</strong> {movie.averageRating}
                </Card.Text>
                <Card.Text>
                  <strong>Reviews:</strong> {movie.reviewCount}
                </Card.Text>

                {/* Display existing reviews */}
                <h4 className="mt-4">Reviews</h4>
                {reviews.map((review) => (
                  <div key={review.id} className="border p-3 mb-3">
                    <strong>{review.userUsername}</strong> -{" "}
                    {dayjs(review.createdAt).format("YYYY-MM-DD")}
                    <p>Rating: {review.rating}</p>
                    <p>{review.content}</p>
                  </div>
                ))}

                {/* Add new review */}
                <h4 className="mt-4">Add a Review</h4>
                <Form onSubmit={handleReviewSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Rating</Form.Label>
                    <div className="d-flex">
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                          <FaStar
                            key={index}
                            size={30}
                            color={
                              starValue <= (hover || rating) ? "gold" : "gray"
                            }
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(rating)}
                          />
                        );
                      })}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Write your review here"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={!hasToken}>
                    Submit Review
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetail;
