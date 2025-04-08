import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ensure you have an `App.jsx` file in the same folder

// Create the root and render the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
