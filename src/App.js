import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username");
      setUserData(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://api.github.com/users/${username.trim()}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch user");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>GitHub User Finder</h1>

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
        <div className="user-card">
          <img
            src={userData.avatar_url}
            alt={userData.name || userData.login}
            width="120"
            height="120"
          />
          <h2>{userData.name || userData.login}</h2>
          <p>@{userData.login}</p>
          {userData.bio && <p>{userData.bio}</p>}
          <div className="user-stats">
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
  );
}

export default App;