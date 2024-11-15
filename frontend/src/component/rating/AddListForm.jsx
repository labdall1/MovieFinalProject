import React from "react";
import { Form, Button } from "react-bootstrap";
import "./MovieRating.css"; // Ensure this file is linked correctly

function AddListForm({ handleListSubmit, newListName, setNewListName }) {
  return (
    <div className="management-card">
      <div className="card-body">
        <h4 className="section-title">Add List</h4>
        <Form onSubmit={handleListSubmit}>
          <Form.Group controlId="listName">
            <Form.Label style={{backgroundColor: "var(--bg-darker, #16161e)"}} className="movie-card-custom section-title">
              Category Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Category"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="border-custom"
            />
          </Form.Group>
          <Button
            type="submit"
            className="learn-more-btn primary mt-3"
          >
            Add Category
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default AddListForm;
