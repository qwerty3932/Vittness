require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes   = require("./routes/auth");
const userRoutes   = require("./routes/user");
const nutritionRoutes = require("./routes/nutrition");
const routineRoutes   = require("./routes/routine");

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Muitas requisições. Tente novamente em breve." },
});
app.use(limiter);

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use("/auth",      authRoutes);
app.use("/user",      userRoutes);
app.use("/nutrition", nutritionRoutes);
app.use("/routine",   routineRoutes);

app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

app.use((req, res) =>
  res.status(404).json({ error: "Rota não encontrada." })
);

app.use((err, req, res, next) => {
  console.error("[ERRO]", err.message);
  res.status(err.status || 500).json({ error: err.message || "Erro interno do servidor." });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Vittness Backend rodando em http://localhost:${PORT}`)
);