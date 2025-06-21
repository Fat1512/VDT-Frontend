// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_REQUEST, AUTH_REQUEST } from "../axiosConfig";
import { AUTH_SERVICE } from "../Url";
import { setLocalStorageToken } from "../helper";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await API_REQUEST.post(`${AUTH_SERVICE}/api/v1/auth/login`, {
        username,
        password,
      });
        console.log(response)
      const token = response.data.data.accessToken;
      console.log(token)
      setLocalStorageToken(token);
      navigate("/"); // Redirect to protected page
    } catch (err) {
      alert("Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full border px-3 py-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login !
        </button>
      </form>
    </div>
  );
}

export default Login;
