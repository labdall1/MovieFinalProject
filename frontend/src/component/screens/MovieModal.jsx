import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./MovieModal.css"; // Import the CSS file

const baseurl = process.env.REACT_APP_API_URL;

const MovieModal = ({ show, handleClose }) => {
  const { register, handleSubmit, reset } = useForm();

  // Check if there is a token in localStorage
  const hasToken = !!localStorage.getItem("token");

  // API request function on form submit
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${baseurl}movies`,
        {
          title: data.title,
          imageUrl: data.imageUrl,
          summary: data.summary,
          releaseDate: data.releaseDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleClose();
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to add movie:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="movie-modal">
      <Modal.Header closeButton>
        <Modal.Title style={{color: "white"}}>Add New Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie title"
              {...register("title", { required: true })}
              disabled={!hasToken}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImageUrl">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              {...register("imageUrl", { required: true })}
              disabled={!hasToken}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSummary">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter movie summary"
              {...register("summary", { required: true })}
              disabled={!hasToken}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formReleaseDate">
            <Form.Label>Release Date</Form.Label>
            <Form.Control
              type="datetime-local"
              {...register("releaseDate", { required: true })}
              disabled={!hasToken}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={!hasToken}>
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MovieModal;
