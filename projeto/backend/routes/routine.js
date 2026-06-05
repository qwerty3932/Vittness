const express  = require("express");
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("routines")
      .select("*, routine_exercises(*), plan_data")
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ routines: data || [] });
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, goal, frequency, exercises = [], plan_data } = req.body;
    if (!name?.trim())
      return res.status(400).json({ error: "Nome da rotina é obrigatório." });

    const { data: routine, error } = await supabase
      .from("routines")
      .insert({ user_id: req.userId, name: name.trim(), goal: goal || null, frequency: frequency || null, plan_data: plan_data || null })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    if (exercises.length > 0) {
      await supabase.from("routine_exercises").insert(
        exercises.map((ex, i) => ({
          routine_id:   routine.id,
          name:         ex.name,
          sets:         ex.sets         || null,
          reps:         ex.reps         || null,
          duration_min: ex.duration_min || null,
          order_index:  i,
        }))
      );
    }

    const { data: full } = await supabase
      .from("routines")
      .select("*, routine_exercises(*)")
      .eq("id", routine.id)
      .single();

    res.status(201).json({ message: "Rotina criada.", routine: full });
  } catch (err) { next(err); }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { name, goal, frequency } = req.body;
    const updates = {};
    if (name)      updates.name      = name.trim();
    if (goal)      updates.goal      = goal;
    if (frequency) updates.frequency = frequency;

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ error: "Nenhum campo para atualizar." });

    const { error } = await supabase
      .from("routines")
      .update(updates)
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Rotina atualizada." });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("routines")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) return res.status(404).json({ error: "Rotina não encontrada." });
    res.json({ message: "Rotina excluída." });
  } catch (err) { next(err); }
});

router.get("/workouts", async (req, res, next) => {
  try {
    const days  = Math.min(parseInt(req.query.days) || 30, 365);
    const since = new Date(Date.now() - days * 86400000).toISOString();

    const { data, error } = await supabase
      .from("workouts")
      .select("*, routines(name)")
      .eq("user_id", req.userId)
      .gte("logged_at", since)
      .order("logged_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const stats = (data || []).reduce(
      (acc, w) => ({
        total_workouts: acc.total_workouts + 1,
        total_minutes:  acc.total_minutes  + (w.duration_min || 0),
        total_kcal:     acc.total_kcal     + (w.kcal_burned  || 0),
        total_km:       acc.total_km       + (w.distance_km  || 0),
      }),
      { total_workouts: 0, total_minutes: 0, total_kcal: 0, total_km: 0 }
    );

    res.json({ days, workouts: data, stats });
  } catch (err) { next(err); }
});

router.post("/workouts", async (req, res, next) => {
  try {
    const { name, routine_id, kcal_burned, duration_min, distance_km } = req.body;
    if (!name?.trim())
      return res.status(400).json({ error: "Nome do treino é obrigatório." });

    const { data, error } = await supabase
      .from("workouts")
      .insert({
        user_id:      req.userId,
        routine_id:   routine_id   || null,
        name:         name.trim(),
        kcal_burned:  kcal_burned  ? Math.round(Number(kcal_burned))  : null,
        duration_min: duration_min ? Math.round(Number(duration_min)) : null,
        distance_km:  distance_km  ? Number(distance_km)              : null,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Treino registrado.", workout: data });
  } catch (err) { next(err); }
});

router.delete("/workouts/:id", async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) return res.status(404).json({ error: "Treino não encontrado." });
    res.json({ message: "Treino removido." });
  } catch (err) { next(err); }
});

module.exports = router;