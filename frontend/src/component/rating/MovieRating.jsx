import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Dropdown,
  DropdownButton,
  Card,
  Alert,
} from "react-bootstrap";
import AddListForm from "./AddListForm";
import AddMovieForm from "./AddMovieForm";
import axios from "axios";
import './MovieRating.css'
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Ensure this is in the component where the toast is triggered

const baseurl = process.env.REACT_APP_API_URL;

function MovieRating() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState("All Items");
  const [movies, setMovies] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newMovie, setNewMovie] = useState({ name: "", rating: "" });
  const [userData, setUserData] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseurl}auth/me`, {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserLists = async () => {
    try {
      const response = await axios.get(
        `${baseurl}users/${userData?.id}/lists`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLists(response.data);
    } catch (error) {
      console.error("Error fetching user lists:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userData?.id) {
      fetchUserLists();
    }
  }, [userData]);

  useEffect(() => {
    if (selectedList === "All Items") {
      setMovies(lists.flatMap((list) => list.movies.map((item) => item.movie)));
    } else {
      const list = lists.find((list) => list.name === selectedList);
      setMovies(list ? list.movies.map((item) => item.movie) : []);
    }
  }, [selectedList, lists]);

  const handleListSubmit = async (e) => {
    e.preventDefault();

    // Check if the list already exists or if the list name is empty
    if (!newListName) {
      toast.error("List name cannot be empty!"); // Show error toast
      return;
    }
    if (lists.some((list) => list.name === newListName)) {
      toast.error("This list already exists!"); // Show error toast
      return;
    }

    try {
      const response = await axios.post(
        `${baseurl}lists`,
        { name: newListName },
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewListName("");
      await fetchUserLists(); // Reload the lists after adding a new one
      toast.success("List added successfully!"); // Show success toast
    } catch (error) {
      console.error("Error adding list:", error);
      toast.error("Error adding list!"); // Show error toast
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();

    if (newMovie.name && newMovie.rating && selectedList !== "All Items") {
      try {
        const response = await axios.post(
          `${baseurl}list/movies`,
          {
            title: newMovie.name,
            imageUrl: newMovie.imageUrl,
            summary: newMovie.name,
            releaseDate: newMovie.releaseDate || new Date().toISOString(),
            listId: lists.find((list) => list.name === selectedList)?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        await fetchUserLists();
        setNewMovie({ name: "", rating: "", imageUrl: "", releaseDate: "" });
        setSelectedList("All Items");
        toast.success("Movie added successfully!"); // Show success toast
      } catch (error) {
        console.error("Error adding movie:", error);
        toast.error("Error adding movie!"); // Show error toast
      }
    } else {
      toast.error("Please fill in all fields before submitting."); // Show error toast
    }
  };

  const handleMoveMovie = async (movieId, newListId) => {
    try {
      await axios.post(
        `${baseurl}lists/${newListId}/movies?movieId=${movieId}`,
        {}, // Empty request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchUserLists();
      toast.success("Movie moved successfully!"); // Show success toast
    } catch (error) {
      console.error("Error moving movie:", error);
      toast.error("Error moving movie!"); // Show error toast
    }
  };

  return (
    <Container fluid className="movie-rating-container py-5">
      <Row>
        {/* Manage Your Movie Lists */}
        <Col md={4} className="border-end border-custom">
          <h3 className="section-title text-center mb-4">Manage Your Movie Lists</h3>
          <Card className="management-card mb-4">
            <Card.Body>
              <h5 className="mb-3">Add New List</h5>
              <AddListForm
                handleListSubmit={handleListSubmit}
                newListName={newListName}
                setNewListName={setNewListName}
              />
            </Card.Body>
          </Card>
          <Card className="management-card">
            <Card.Body>
              <h5 className="mb-3">Add New Movie</h5>
              <AddMovieForm
                handleMovieSubmit={handleMovieSubmit}
                selectedList={selectedList}
                setSelectedList={setSelectedList}
                lists={lists}
                newMovie={newMovie}
                setNewMovie={setNewMovie}
              />
            </Card.Body>
          </Card>
        </Col>
  
        {/* Movie Lists */}
        <Col md={4}>
          <h4 className="section-title text-center mb-4">Movie Lists</h4>
          <ListGroup className="list-group-custom movie-list-group">
            <ListGroup.Item
              action
              active={selectedList === "All Items"}
              onClick={() => setSelectedList("All Items")}
              className="movie-list-item"
            >
              All Items
            </ListGroup.Item>
            {lists.map((list) => (
              <ListGroup.Item
                key={list.id}
                action
                active={selectedList === list.name}
                onClick={() => setSelectedList(list.name)}
                className="movie-list-item"
              >
                {list.name || "Unnamed List"}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
  
        {/* Movies in Selected List */}
        <Col md={4} className="border-start border-custom">
          <h4 className="section-title text-center mb-4">
            Movies in "{selectedList}"
          </h4>
          <div className="movies-container" >
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <Card key={index} style={{backgroundColor:"var(--bg-darker, #16161e)"}} className="movie-card-custom mb-3 shadow">
                  <Card.Img
                    variant="top"
                    src={movie.imageUrl || "placeholder.jpg"}
                    alt={movie.title}
                    className="movie-card-img"
                  />
                  <Card.Body>
                    <Card.Title className="text-center">{movie.title}</Card.Title>
                    <Card.Subtitle className="text-muted text-center mb-2">
                      {movie.releaseDate.split("T")[0]}
                    </Card.Subtitle>
                    <Card.Text className="text-center">{movie.summary}</Card.Text>
                    <DropdownButton
                      title="Move Movie"
                      variant="primary"
                      className="dropdown-custom w-100 mt-2"
                    >
                      {lists.map((list) => (
                        <Dropdown.Item
                          key={list.id}
                          onClick={() => handleMoveMovie(movie.id, list.id)}
                        >
                          {list.name || "Unnamed List"}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <Alert variant="info" className="text-center">
                No movies in this list.
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
  
}

export default MovieRating;
