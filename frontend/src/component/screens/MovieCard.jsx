import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const MovieCard = ({ title, image, rating, description }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? true : false;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-warning" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-warning" />}
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
          <span className="ms-2">{rating}/10</span>
        </div>
        <Card.Text>{description}</Card.Text>
        <Link to="/movie/342">
          <Button variant="primary">Learn More</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
