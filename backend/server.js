const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");
const authenticate = require("./middleware");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});
app.use(limiter);

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS nicht erlaubt"));
      }
    },
  })
);

app.use(express.json());
app.use(express.static("../frontend"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "../frontend" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
