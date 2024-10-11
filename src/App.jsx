import axios from "axios";
import { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [info, setInfo] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const signup = async () => {
    if (!formData.username || !formData.password) {
      alert("Please enter both username and password.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/signup", {
        username: formData.username,
        password: formData.password,
      });
      if (response) {
        alert("Welcome! You are signed up");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error during signup.");
    }
  };

  const login = async () => {
    if (!formData.username || !formData.password) {
      alert("Please enter both username and password.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: formData.username,
        password: formData.password,
      });
      if (response) {
        localStorage.setItem("token", response.data.message);
        alert("Welcome! You are logged in");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error during login.");
    }
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

  const getInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/me", {
        headers: { token },
      });
      if (response) {
        setInfo(
          `Username: ${response.data.username}, Password: ${response.data.password}`
        );
      }
    } catch (error) {
      console.error("Get info error:", error);
      alert("Error fetching user information.");
    }
  };

  const FormFields = () => (
    <>
      <label htmlFor="username">Username: </label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
    </>
  );

  return (
    <>
      <div>
        <h2>Sign Up</h2>
        <FormFields />
        <button onClick={signup}>Sign Up</button>
      </div>

      <div>
        <h2>Login</h2>
        <FormFields />
        <button onClick={login}>Login</button>
      </div>

      <div>
        <h1>User Information:</h1>
        <div id="information">{info}</div>
        <button onClick={getInfo}>Get Info</button>
      </div>

      <button onClick={logout}>Logout</button>
    </>
  );
};

export default App;
