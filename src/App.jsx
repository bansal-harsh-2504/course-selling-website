import axios from "axios";
import { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [info, setInfo] = useState("");
  const signup = async () => {
    const response = await axios.post("http://localhost:3000/signup", {
      username: formData.username,
      password: formData.password,
    });
    if (response) {
      alert("Welcome! You are signed up");
    }
    return;
  };
  const logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/logout", {
        headers: { token },
      });
      if (response.data) {
        alert("Log Out Successful!");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error during logout.");
    }
  };
  const login = async () => {
    const response = await axios.post("http://localhost:3000/login", {
      username: formData.username,
      password: formData.password,
    });
    if (response) {
      localStorage.setItem("token", response.data.message);
      alert("Welcome! You are logged in");
    }
    return;
  };

  const getInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }
    const response = await axios.get("http://localhost:3000/me", {
      headers: { token },
    });
    if (response) {
      setInfo(
        `Username: ${response.data.username} Password: ${response.data.password}`
      );
    }
    return;
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <div>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={(e) => handleChange(e)}
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e)}
        />
        <br />
        <button onClick={signup}>SignUp</button>
      </div>

      <div>
        <br />
        <br />
        <label htmlFor="user">Username: </label>
        <input
          type="text"
          id="user"
          name="username"
          value={formData.username}
          onChange={(e) => handleChange(e)}
        />
        <br />
        <label htmlFor="pass">Password: </label>
        <input
          type="password"
          id="pass"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e)}
        />
        <br />
        <button onClick={login}>Login</button>
      </div>

      <div>
        <h1>User Information: </h1>
        <div id="information">{info}</div>
        <button onClick={getInfo}>Get Info</button>
      </div>
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default App;
