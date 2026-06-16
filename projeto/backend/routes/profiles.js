const express  = require("express");
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, idade, peso, altura, objetivo, created_at")
      .eq("id", req.userId)
      .single();

    if (error) return res.status(404).json({ error: "Usuário não encontrado." });
    res.json({ user: data });
  } catch (err) { next(err); }
});

router.patch("/", async (req, res, next) => {
  try {
    const { name, idade, peso, altura, objetivo } = req.body;
    const updates = {};

    if (name     !== undefined) updates.name     = name.trim();
    if (idade    !== undefined) updates.idade    = Number(idade)  || null;
    if (peso     !== undefined) updates.peso     = Number(peso)   || null;
    if (altura   !== undefined) updates.altura   = Number(altura) || null;
    if (objetivo !== undefined) updates.objetivo = objetivo;

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ error: "Nenhum campo para atualizar." });

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", req.userId)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Perfil atualizado.", user: data });
  } catch (err) { next(err); }
});

router.patch("/email", async (req, res, next) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ error: "Novo e-mail é obrigatório." });

    const { error } = await supabase.auth.admin.updateUserById(req.userId, {
      email: newEmail.toLowerCase().trim(),
    });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "E-mail atualizado. Verifique sua caixa de entrada." });
  } catch (err) { next(err); }
});

router.patch("/password", async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ error: "Nova senha deve ter ao menos 6 caracteres." });

    const { error } = await supabase.auth.admin.updateUserById(req.userId, {
      password: newPassword,
    });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Senha atualizada com sucesso." });
  } catch (err) { next(err); }
});

router.get("/stats", async (req, res, next) => {
  try {
    const [workoutsRes, kmRes, minutesRes, kcalRes] = await Promise.all([
      supabase.from("workouts").select("id", { count: "exact", head: true }).eq("user_id", req.userId),
      supabase.from("workouts").select("distance_km").eq("user_id", req.userId),
      supabase.from("workouts").select("duration_min").eq("user_id", req.userId),
      supabase.from("meals").select("kcal").eq("user_id", req.userId)
        .gte("logged_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);

    const totalKm      = (kmRes.data      || []).reduce((s, r) => s + (r.distance_km  || 0), 0);
    const totalMinutes = (minutesRes.data || []).reduce((s, r) => s + (r.duration_min || 0), 0);
    const weeklyKcal   = (kcalRes.data    || []).reduce((s, r) => s + (r.kcal         || 0), 0);

    res.json({
      totalWorkouts:      workoutsRes.count || 0,
      totalKm:            +totalKm.toFixed(2),
      totalMinutes,
      weeklyKcalConsumed: weeklyKcal,
    });
  } catch (err) { next(err); }
});

module.exports = router;
