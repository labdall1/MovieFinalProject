import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://localhost:7219/api/auth/login",
        {
          username: data.username, // Use "username" here
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      console.log("first", response);

      const token = response.data?.token; // Adjust according to your API's token structure
      if (token) {
        // Save token to local storage
        localStorage.setItem("token", token);
        toast.success("Login successful!");
      }

      // Example: Redirect to a dashboard page
      // navigate('/dashboard');
    } catch (error) {
      // Handle errors
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <h2 className="text-center mb-4">Login</h2>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 shadow-sm rounded bg-light"
          >
            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                {...register("username", {
                  required: "Username is required",
                })}
                isInvalid={errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username && errors.username.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                isInvalid={errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password && errors.password.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Login
            </Button>

            <div className="text-center">
              <small>
                Don’t have an account? <Link to="/signup">Sign up here</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
