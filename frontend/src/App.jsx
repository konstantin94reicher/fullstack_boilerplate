import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "./config";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Wenn nicht eingeloggt, zu Login weiterleiten
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div>
      <div>
        <span>Hallo, {user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
      <h1>Meine App</h1>
      {/* Hier kommt projektspezifischer Inhalt */}
    </div>
  );
}

export default App;
