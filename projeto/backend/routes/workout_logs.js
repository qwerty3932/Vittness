const express  = require("express");
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// ─── POST /workout-logs — Registrar treino concluído ─────────────────────────
router.post("/", async (req, res, next) => {
  try {
    const { routine_id, day_name, kcal_burned, duration_min } = req.body;

    if (!day_name?.trim())
      return res.status(400).json({ error: "day_name é obrigatório." });

    const { data, error } = await supabase
      .from("workout_logs")
      .insert({
        user_id:      req.userId,
        routine_id:   routine_id || null,
        day_name:     day_name.trim(),
        kcal_burned:  kcal_burned ? Number(kcal_burned) : null,
        duration_min: duration_min ? Number(duration_min) : null,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Treino registrado!", log: data });
  } catch (err) { next(err); }
});

// ─── GET /workout-logs — Histórico do usuário ────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("workout_logs")
      .select("*")
      .eq("user_id", req.userId)
      .order("completed_at", { ascending: false })
      .limit(100);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ logs: data || [] });
  } catch (err) { next(err); }
});

// ─── GET /workout-logs/stats — Totais para o painel de progresso ─────────────
router.get("/stats", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("workout_logs")
      .select("kcal_burned, duration_min, completed_at")
      .eq("user_id", req.userId)
      .order("completed_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const logs = data || [];

    // Totais gerais
    const total_workouts  = logs.length;
    const total_kcal      = logs.reduce((s, l) => s + (l.kcal_burned  || 0), 0);
    const total_minutes   = logs.reduce((s, l) => s + (l.duration_min || 0), 0);

    // Atividade dos últimos 7 dias (seg→dom da semana atual)
    const now   = new Date();
    const dow   = now.getDay(); // 0=dom
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dow + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const weekly = Array(7).fill(0); // índice 0=seg … 6=dom
    logs.forEach(l => {
      const d = new Date(l.completed_at);
      if (d >= monday) {
        const idx = (d.getDay() + 6) % 7;
        weekly[idx] += l.kcal_burned || 0;
      }
    });

    // Score de consistência: % de dias com treino nos últimos 30 dias
    const thirty = new Date(now);
    thirty.setDate(now.getDate() - 30);
    const activeDays = new Set(
      logs
        .filter(l => new Date(l.completed_at) >= thirty)
        .map(l => new Date(l.completed_at).toDateString())
    ).size;
    const consistency_score = Math.round((activeDays / 30) * 100);

    res.json({ total_workouts, total_kcal, total_minutes, weekly_kcal: weekly, consistency_score });
  } catch (err) { next(err); }
});

module.exports = router;