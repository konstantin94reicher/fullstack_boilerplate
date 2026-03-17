const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./database");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Registrierung
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, Email und Passwort sind erforderlich" });
  }

  try {
    // Prüfen ob Email bereits existiert
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email bereits vergeben" });
    }

    // Passwort hashen — 10 ist der "cost factor", höher = sicherer aber langsamer
    const hash = await bcrypt.hash(password, 10);

    // Benutzer speichern
    const result = await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email", [
      name,
      email,
      hash,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email und Passwort sind erforderlich" });
  }

  try {
    // Benutzer suchen
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }

    const user = result.rows[0];

    // Passwort vergleichen
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }

    // JWT erstellen — läuft nach 24 Stunden ab
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
