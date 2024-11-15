import React from "react";
import { Card } from "react-bootstrap";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import './MovieCard.css';

const MovieCard = ({ title, image, rating, description, movieID, variant = "primary" }) => {
  const renderStars = (rating) => {
    const clampedRating = Math.max(0, Math.min(rating, 5));
    const fullStars = Math.floor(clampedRating);
    const emptyStars = 5 - fullStars;

    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="star-filled" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="star-empty" />
        ))}
        <span className="rating-text">{rating}/5</span>
      </div>
    );
  };

  return (
    <Card className="movie-card">
      <Card.Img variant="top" src={image} alt={title} className="movie-image" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="mb-2">
          {renderStars(rating)}
        </div>
        <Card.Text className="movie-description">{description}</Card.Text>
        <Link 
          to={`/movie/${movieID}`} 
          className={`learn-more-btn ${variant} mt-2`}
        >
          Learn More
        </Link>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;