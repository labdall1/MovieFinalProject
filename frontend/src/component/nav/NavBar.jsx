import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import SearchModal from "../search/SearchModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NavBar.css";

function NavBar() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Add this to track current route

  const handleOpenModal = () => setShowSearchModal(true);
  const handleCloseModal = () => setShowSearchModal(false);

  const handleRatingClick = (event) => {
    if (!isSignedIn) {
      event.preventDefault();
      toast.warn("You need to sign in first!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
    navigate("/rating");
  };

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar expand="lg" className="navbar-custom" variant="dark">
        <Container>
          <Navbar.Brand href="/" className="navbar-brand">
            Movie Platform
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                eventKey="/" 
                as={Link} 
                to="/" 
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Nav.Link>
              <Nav.Link
                eventKey="rating"
                as={Link}
                to="/rating"
                onClick={handleRatingClick}
                className={`nav-link ${isActive("/rating") ? "active" : ""}`}
              >
                My Rating
              </Nav.Link>
              <NavDropdown
                title="Search"
                id="basic-nav-dropdown"
                className="nav-dropdown"
              >
                <NavDropdown.Item onClick={handleOpenModal}>
                  Search
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto">
              <SignedOut>
                <SignInButton mode="modal" className="btn-signin" />
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: "cl-userButtonBox"
                    }
                  }}
                />
              </SignedIn>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <SearchModal show={showSearchModal} onHide={handleCloseModal} />
    </>
  );
}

export default NavBar;