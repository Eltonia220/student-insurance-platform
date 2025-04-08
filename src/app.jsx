import { useState, useEffect } from "react";

function App() {
  const [plans, setPlans] = useState([]); // State to store fetched plans
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    // Fetch data from the API
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/plans");
        if (!response.ok) {
          throw new Error("Failed to fetch plans. Please try again later.");
        }
        const data = await response.json();
        setPlans(data); // Update the plans state with fetched data
      } catch (err) {
        setError(err.message); // Update the error state
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchPlans();
  }, []); // Run once on component mount

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Student Insurance Plans
      </h1>
      {loading && <p style={{ textAlign: "center" }}>Loading plans...</p>}{" "}
      {/* Show loading message */}
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}{" "}
      {/* Show error message */}
      {!loading && !error && (
        <>
          {plans.length === 0 ? ( // Fallback message when no plans are available
            <p style={{ textAlign: "center" }}>
              No plans available at the moment.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {plans.map((plan) => (
                <li
                  key={plan.id}
                  style={{
                    padding: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  <strong>{plan.name}</strong> - ${plan.price.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default App;
