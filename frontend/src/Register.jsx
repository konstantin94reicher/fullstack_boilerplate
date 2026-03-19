import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "./config";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fehler, setFehler] = useState(null);
  const [erfolg, setErfolg] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFehler(data.error);
        return;
      }

      setErfolg(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setFehler("Verbindungsfehler");
    }
  }

  return (
    <div>
      <h1>Registrieren</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Registrieren</button>
      </form>
      {fehler && <p style={{ color: "red" }}>{fehler}</p>}
      {erfolg && <p style={{ color: "green" }}>Registrierung erfolgreich — du wirst weitergeleitet...</p>}
      <p>
        Bereits ein Konto? <Link to="/login">Einloggen</Link>
      </p>
    </div>
  );
}

export default Register;
