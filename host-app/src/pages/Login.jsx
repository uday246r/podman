import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Login.css";
import API_CONFIG from "../config/api";
import { setToken, getToken } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (getToken()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_CONFIG.AUTH_API}/api/auth/login`,
        {
          email,
          password,
        }
      );

      // Store in cookie instead of localStorage
      setToken(response.data.token);

      navigate("/dashboard");

    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={loginUser}
      >
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;