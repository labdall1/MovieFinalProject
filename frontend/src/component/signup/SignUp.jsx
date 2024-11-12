import React from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Make API request to register user
      const response = await axios.post(
        "https://localhost:7219/api/auth/register",
        {
          username: data.name, // Assuming name is used as the username
          password: data.password,
          email: data.email,
        }
      );

      console.log("Registration successful:", response.data);
      toast.success("Registration successful!"); // Show success message
      // Optionally redirect or clear form fields here
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        // Handle API response errors
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Registration failed";
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.error("Network Error: Unable to reach the server.");
      }
    }
  };

  // Watch password field for password confirmation validation
  const password = watch("password");

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 shadow-sm rounded bg-light"
          >
            {/* Name Field */}
            <Form.Group controlId="formBasicName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
                isInvalid={errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name && errors.name.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email Field */}
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                isInvalid={errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email && errors.email.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password Field */}
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

            {/* Confirm Password Field */}
            <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
              <Form.Label>Re-enter Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                {...register("confirmPassword", {
                  required: "Please re-enter your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                isInvalid={errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword && errors.confirmPassword.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Sign Up
            </Button>

            <div className="text-center">
              <small>
                Already have an account? <Link to="/login">Log in here</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
