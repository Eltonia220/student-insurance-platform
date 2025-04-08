import React, { useState } from "react";
import { Container } from "react-bootstrap";
import AuthForm from "../components/AuthForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/signup", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="mx-auto" style={{ maxWidth: "400px" }}>
        <AuthForm type="signup" onSubmit={handleSubmit} loading={loading} />
      </div>
    </Container>
  );
};

export default Signup;
