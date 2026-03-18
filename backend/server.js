const express = require("express");
const cors = require("cors");
const db = require("./database");
const authRoutes = require("./auth");
const authenticate = require("./middleware");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.static("../frontend"));

app.use("/api/auth", authRoutes);

// GET alle Produkte
app.get("/api/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET einzelnes Produkt
app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produkt nicht gefunden" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST neues Produkt
app.post("/api/products", authenticate, async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "Name und Preis sind erforderlich" });
  }
  try {
    const result = await db.query("INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *", [name, price]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Produkt aktualisieren
app.put("/api/products/:id", async (req, res) => {
  const { name, price } = req.body;
  try {
    const result = await db.query("UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *", [name, price, req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produkt nicht gefunden" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Produkt löschen
app.delete("/api/products/:id", authenticate, async (req, res) => {
  try {
    const result = await db.query("DELETE FROM products WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produkt nicht gefunden" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "../frontend" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
