import React, { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";

const AuthForm = ({ type, onSubmit, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <Card.Body>
        <h2 className="text-center mb-4">
          {type === "login" ? "Login" : "Sign Up"}
        </h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8"
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AuthForm;
