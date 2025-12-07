import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    name: ""
  });

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/help-requests");
      const data = await res.json();
      setHelpRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/help-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const newRequest = await res.json();

      setHelpRequests((prev) => [...prev, newRequest]);

      setFormData({ title: "", description: "", name: "" });

    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  return (
    <div className="container">
      <h1>NeighbourNetk — Community Help Requests</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <button type="submit">Submit Help Request</button>
      </form>

      <h2>Existing Help Requests</h2>

      {helpRequests.length === 0 ? (
        <p>No help requests yet.</p>
      ) : (
        helpRequests.map((req) => (
          <div key={req.id} className="request-card">
            <h3>{req.title}</h3>
            <p>{req.description}</p>
            <small><b>Requested by:</b> {req.name}</small>
            <br />
            <small><b>Posted on:</b> {new Date(req.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
