import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUser = async (userToFetch) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://api.github.com/users/${userToFetch}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message || "User not found");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setError("Please enter a GitHub username.");
      setUserData(null);
      return;
    }

    fetchUser(trimmedUser);
  };

  return (
    <div className="App">
      <div className="card">
        <h1>GitHub User Finder</h1>
        <p>Search a GitHub username to see profile details.</p>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="username"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p>Loading...</p>}

        {error && <p className="error-message">{error}</p>}

        {userData && (
          <div className="user-details">
            <img
              src={userData.avatar_url}
              alt={userData.name || userData.login}
              width="100"
              height="100"
            />
            <h2>{userData.name || userData.login}</h2>
            <p>@{userData.login}</p>
            {userData.bio && <p>{userData.bio}</p>}
            {userData.location && <p>{userData.location}</p>}

            <div className="stats">
              <p>Followers: {userData.followers}</p>
              <p>Following: {userData.following}</p>
              <p>Public Repos: {userData.public_repos}</p>
            </div>

            <a
              href={userData.html_url}
              target="_blank"
              rel="noreferrer"
            >
              View Profile
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;