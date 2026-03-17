require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Kein Token vorhanden" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // Benutzer-Infos werden dem Request hinzugefügt
    next(); // weiter zur eigentlichen Route
  } catch (err) {
    res.status(401).json({ error: "Ungültiges Token" });
  }
}

module.exports = authenticate;
