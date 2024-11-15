import React from "react";
import { Form, Button } from "react-bootstrap";
import "./MovieRating.css"; // Assuming the CSS file is named `MovieRating.css`

function AddMovieForm({
  handleMovieSubmit,
  selectedList,
  setSelectedList,
  lists,
  newMovie,
  setNewMovie,
}) {
  return (
    <div className="management-card p-4">
      <h4 className="section-title">Add Movie to List</h4>
      <Form onSubmit={handleMovieSubmit}>
        {/* Select List */}
        <Form.Group controlId="selectList" className="mb-4">
          <Form.Label className="h5 text-light">Select List</Form.Label>
          <Form.Control
            as="select"
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            className="list-group-custom"
          >
            <option value="All Items">All Items</option>
            {lists.map((list) => (
              <option key={list.id} value={list.name}>
                {list.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Movie Name */}
        <Form.Group controlId="movieName" className="mb-4">
          <Form.Label className="text-light">Movie Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter movie name"
            value={newMovie.name}
            onChange={(e) =>
              setNewMovie((prev) => ({ ...prev, name: e.target.value }))
            }
            className="movie-card-custom"
            style={{backgroundColor:"white"}}
          />
        </Form.Group>

        {/* Movie Rating */}
        <Form.Group controlId="movieRating" className="mb-4">
          <Form.Label className="text-light">Rating</Form.Label>
          <Form.Control
            type="number"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            value={newMovie.rating}
            onChange={(e) =>
              setNewMovie((prev) => ({ ...prev, rating: e.target.value }))
            }
            className="movie-card-custom"
            style={{backgroundColor:"white"}}

          />
        </Form.Group>

        {/* Movie Image URL */}
        <Form.Group controlId="movieImageUrl" className="mb-4">
          <Form.Label className="text-light">Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image URL"
            value={newMovie.imageUrl || ""}
            onChange={(e) =>
              setNewMovie((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
            className="movie-card-custom"
            style={{backgroundColor:"white"}}

          />
        </Form.Group>

        {/* Release Date */}
        <Form.Group controlId="releaseDate" className="mb-4">
          <Form.Label className="text-light">Release Date</Form.Label>
          <Form.Control
            type="date"
            value={newMovie.releaseDate || ""}
            onChange={(e) =>
              setNewMovie((prev) => ({ ...prev, releaseDate: e.target.value }))
            }
            className="movie-card-custom"
            style={{backgroundColor:"white"}}

          />
        </Form.Group>

        {/* Submit Button */}
        <Button type="submit" className="learn-more-btn primary">
          Add Movie
        </Button>
      </Form>
    </div>
  );
}

export default AddMovieForm;
