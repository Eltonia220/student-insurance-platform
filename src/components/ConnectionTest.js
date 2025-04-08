import React, { useState, useEffect } from "react";
import apiClient from "../api/client";

const ConnectionTest = () => {
  const [status, setStatus] = useState("Checking...");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await apiClient.get("/api/health");
        setStatus("Connected ✅");
        setDetails(response);
      } catch (err) {
        setStatus("Connection Failed ❌");
        setError(err.message);
        console.error("Connection error:", err);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>API Connection Test</h3>
      <p>
        <strong>Status:</strong> {status}
      </p>

      {details && (
        <div>
          <h4>Response Details:</h4>
          <pre>{JSON.stringify(details, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ color: "red" }}>
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;
