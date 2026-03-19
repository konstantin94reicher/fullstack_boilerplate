import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "./config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fehler, setFehler] = useState(null);
  const navigate = useNavigate();

  // Falls bereits eingeloggt, weiterleiten
  if (localStorage.getItem("token")) {
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFehler(data.error);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setFehler("Verbindungsfehler");
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Einloggen</button>
      </form>
      {fehler && <p style={{ color: "red" }}>{fehler}</p>}
      <p>
        Noch kein Konto? <Link to="/register">Registrieren</Link>
      </p>
    </div>
  );
}

export default Login;
