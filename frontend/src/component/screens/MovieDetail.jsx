import React, { useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const MovieDetail = ({ movie }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRatingSubmit = () => {
    alert(`You rated ${movie.title} with ${rating} stars.`);
    // Here, you could make an API call to save the rating, if needed.
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Img variant="top" src={movie.image} alt={movie.title} />
            <Card.Body>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text>
                <strong>Description:</strong> {movie.description}
              </Card.Text>
              <Card.Text>
                <strong>Director:</strong> {movie.director}
              </Card.Text>
              <Card.Text>
                <strong>Genre:</strong> {movie.genre}
              </Card.Text>

              <div className="my-3">
                <strong>Your Rating:</strong>
                <div className="d-flex">
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <FaStar
                        key={index}
                        size={30}
                        className="star"
                        color={starValue <= (hover || rating) ? "gold" : "gray"}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(rating)}
                      />
                    );
                  })}
                </div>
                <Button className="mt-3" onClick={handleRatingSubmit}>
                  Submit Rating
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetail;
