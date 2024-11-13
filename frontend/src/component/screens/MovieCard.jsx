import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const MovieCard = ({ title, image, rating, description, movieID }) => {
  const renderStars = (rating) => {
    // Ensure rating is within the range 0 to 5
    const clampedRating = Math.max(0, Math.min(rating, 5));
    const fullStars = Math.floor(clampedRating);
    const emptyStars = 5 - fullStars;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-warning" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-warning" />
        ))}
      </>
    );
  };

  return (
    <Card className="shadow-sm" style={{ width: "18rem" }}>
      <Card.Img variant="top" src={image} alt={title} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="d-flex align-items-center mb-2">
          {renderStars(rating)}
          <span className="ms-2">{rating}/5</span>
        </div>
        <Card.Text>{description}</Card.Text>
        <Link to={`/movie/${movieID}`}>
          <Button variant="primary">Learn More</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
