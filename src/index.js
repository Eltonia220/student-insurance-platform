import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js"; // Fixed import
import reportWebVitals from "./reportWebVitals.js";

// Bootstrap imports
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Fixed import

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

reportWebVitals();
