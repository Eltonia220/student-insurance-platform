import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Button,
  Spinner,
  Alert,
  Form,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./UserDashboard.css";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:3001";
axios.defaults.withCredentials = true;

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("policies");
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [file, setFile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;
  
      try {
        setLoading(true);
        setError("");
        
        const [policiesRes, claimsRes] = await Promise.all([
          axios.get(`/api/v1/users/${currentUser.id}/policies`),
          axios.get(`/api/v1/users/${currentUser.id}/claims`),
        ]);
        
        setPolicies(policiesRes.data?.data || []);
        setClaims(claimsRes.data?.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentUser]); // Now properly includes currentUser in dependencies
  
  // Return early if no user is authenticated
  if (!currentUser) {
    return (
      <Container className="my-5">
        <Alert variant="info">Please log in to view your dashboard</Alert>
      </Container>
    );
  }

  // Handle document upload
  const handleUpload = async () => {
    if (!file || !selectedClaim) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("document", file);
    formData.append("claimId", selectedClaim.id);

    try {
      await axios.post("/api/v1/claims/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowUploadModal(false);
      // Refresh claims
      const res = await axios.get(`/api/v1/users/${currentUser.id}/claims`);
      setClaims(res.data.data);
      setFile(null);
      setSelectedClaim(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Handle chat message send
  const sendMessage = async () => {
    if (!message.trim()) return;

    setSendingMessage(true);
    try {
      await axios.post("/api/v1/support/chat", { message });
      setChatMessages([
        ...chatMessages,
        {
          text: message,
          sender: "user",
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to send message",
      );
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="my-5">
      <h2 className="mb-4">Welcome, {currentUser.name || "User"}!</h2>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col sm={3}>
            <Card>
              <Card.Header>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="policies">My Policies</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="claims">My Claims</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="support">Support</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
            </Card>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="policies">
                <h3>My Insurance Policies</h3>
                {policies.length > 0 ? (
                  policies.map((policy) => (
                    <Card key={policy.id} className="mb-3">
                      <Card.Body>
                        <Card.Title>{policy.policyName}</Card.Title>
                        <Card.Text>
                          Policy Number: {policy.policyNumber}
                          <br />
                          Coverage: ${policy.coverageAmount}
                          <br />
                          Status: {policy.status}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Alert variant="info">No policies found</Alert>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="claims">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>My Claims</h3>
                  <Button
                    variant="primary"
                    onClick={() => setShowUploadModal(true)}
                  >
                    Submit New Claim
                  </Button>
                </div>
                {claims.length > 0 ? (
                  claims.map((claim) => (
                    <Card key={claim.id} className="mb-3">
                      <Card.Body>
                        <Card.Title>Claim #{claim.claimNumber}</Card.Title>
                        <Card.Text>
                          Amount: ${claim.amount}
                          <br />
                          Status: {claim.status}
                          <br />
                          Date: {new Date(claim.claimDate).toLocaleDateString()}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Alert variant="info">No claims found</Alert>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="support">
                <h3 className="mb-3">Support Chat</h3>
                <div className="chat-container mb-3">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                      <div className="message-content">{msg.text}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
                <Form.Group className="d-flex">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <Button
                    variant="primary"
                    onClick={sendMessage}
                    disabled={sendingMessage}
                    className="ms-2"
                  >
                    {sendingMessage ? "Sending..." : "Send"}
                  </Button>
                </Form.Group>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Upload Document Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Claim Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select document to upload</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserDashboard;
