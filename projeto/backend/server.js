require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path    = require("path");

const authRoutes      = require("./routes/auth");
const profilesRouter = require("./routes/auth");
const userRoutes      = require("./routes/user");
const nutritionRoutes = require("./routes/nutrition");
const routineRoutes   = require("./routes/routine");
const exerciseRoutes  = require("./routes/exercises");
const aiRoutes        = require("./routes/ai");


const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    "https://seu-projeto.vercel.app",  // substitui pelo URL real do seu site
    "http://localhost:3000",             // mantém o desenvolvimento local funcionando
    "https://vittness-903kzn93w-sarassss-projects.vercel.app"
  ],
  credentials: true,
}));
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
app.use("/exercises", exerciseRoutes);
app.use("/ai",        aiRoutes);
app.use("/profiles", profilesRouter);

app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ─── Frontend — deve vir DEPOIS das rotas da API ──────────────────────────────
app.use(express.static(path.join(__dirname, "build")));

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use((req, res) =>
  res.status(404).json({ error: "Rota não encontrada." })
);

app.use((err, req, res, next) => {
  console.error("[ERRO]", err.message);
  res.status(err.status || 500).json({ error: err.message || "Erro interno do servidor." });
});

// ─── Start ────────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`✅ Vittness Backend rodando em http://localhost:${PORT}`)
  );
}

module.exports = app;