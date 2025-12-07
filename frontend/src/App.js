import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  // -----------------------------
  // Fetch all help requests
  // -----------------------------
  useEffect(() => {
    fetch("http://localhost:5000/api/help-requests")
      .then(res => res.json())
      .then(data => setHelpRequests(data))
      .catch(err => console.error("Error fetching requests:", err));
  }, []);

  // -----------------------------
  // Submit help request
  // -----------------------------
  const submitRequest = async () => {
    if (!title || !description || !name) {
      alert("Please fill in all fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/help-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, name })
    });

    const newRequest = await res.json();

    setHelpRequests(prev => [newRequest, ...prev]);
    setTitle("");
    setDescription("");
    setName("");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>NeighbourNetk — Community Help Requests</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <button onClick={submitRequest}>
          Submit Help Request
        </button>

        <h3 style={{ marginTop: "20px" }}>Existing Help Requests</h3>

        {helpRequests.length === 0 && <p>No help requests yet.</p>}

        {helpRequests.map(req => (
          <div key={req.id} className="request-card">
            <h4>{req.title}</h4>
            <p>{req.description}</p>
            <small>Posted by {req.name}</small>

            {/* Volunteer Responses */}
            {req.responses.length > 0 && (
              <div className="responses">
                <h5>Volunteer Responses:</h5>
                {req.responses.map((r, i) => (
                  <div key={i} className="response">
                    <b>{r.volunteerName}:</b> {r.message}
                    <br />
                    <small>{new Date(r.respondedAt).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}

            {/* Add Response Form */}
            <input
              placeholder="Your name"
              onChange={e => (req.tempVolunteer = e.target.value)}
            />

            <input
              placeholder="Message"
              onChange={e => (req.tempMessage = e.target.value)}
            />

            <button
              onClick={async () => {
                const res = await fetch(
                  `http://localhost:5000/api/help-requests/${req.id}/respond`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      volunteerName: req.tempVolunteer,
                      message: req.tempMessage
                    })
                  }
                );

                const newResponse = await res.json();

                setHelpRequests(prev =>
                  prev.map(r =>
                    r.id === req.id
                      ? { ...r, responses: [...r.responses, newResponse] }
                      : r
                  )
                );
              }}
            >
              Respond
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
