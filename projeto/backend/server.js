require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const authRoutes        = require("./routes/auth");
const profileRoutes     = require("./routes/profiles"); 
const nutritionRoutes   = require("./routes/nutrition");
const routineRoutes     = require("./routes/routine");
const exerciseRoutes    = require("./routes/exercises");
const aiRoutes          = require("./routes/ai");
const workoutLogsRoutes = require("./routes/workout_logs");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.endsWith(".vercel.app") || origin === "http://localhost:3000") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Muitas requisições. Tente novamente em breve." },
}));

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use("/auth",         authRoutes);
app.use("/profiles",     profileRoutes);
app.use("/nutrition",    nutritionRoutes);
app.use("/routine",      routineRoutes);
app.use("/exercises",    exerciseRoutes);
app.use("/ai",           aiRoutes);
app.use("/workout-logs", workoutLogsRoutes);

app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

app.use(express.static(path.join(__dirname, "build")));
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use((err, req, res, next) => {
  console.error("[ERRO]", err.message);
  res.status(err.status || 500).json({ error: err.message || "Erro interno do servidor." });
});

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`✅ Vittness Backend rodando em http://localhost:${PORT}`)
  );
}
module.exports = app;
