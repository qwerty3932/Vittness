const express = require("express");
const { getDb } = require("../../../../../database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// ─── ROTINAS ─────────────────────────────────────────────────────────────────

// GET /routine
router.get("/", (req, res, next) => {
  try {
    const db = getDb();
    const routines = db.prepare(
      "SELECT * FROM routines WHERE user_id = ? ORDER BY created_at DESC"
    ).all(req.userId);

    // Inclui exercícios de cada rotina
    const result = routines.map(r => ({
      ...r,
      exercises: db.prepare(
        "SELECT * FROM routine_exercises WHERE routine_id = ? ORDER BY order_index ASC"
      ).all(r.id),
    }));

    res.json({ routines: result });
  } catch (err) {
    next(err);
  }
});

// POST /routine
// Body: { name, goal, frequency, exercises: [{ name, sets, reps, duration_min }] }
router.post("/", (req, res, next) => {
  try {
    const { name, goal, frequency, exercises = [] } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ error: "Nome da rotina é obrigatório." });

    const db = getDb();

    const result = db.prepare(
      "INSERT INTO routines (user_id, name, goal, frequency) VALUES (?, ?, ?, ?)"
    ).run(req.userId, name.trim(), goal || null, frequency || null);

    const routineId = result.lastInsertRowid;

    // Insere exercícios em lote
    const insertEx = db.prepare(
      "INSERT INTO routine_exercises (routine_id, name, sets, reps, duration_min, order_index) VALUES (?, ?, ?, ?, ?, ?)"
    );
    exercises.forEach((ex, i) => {
      insertEx.run(routineId, ex.name, ex.sets || null, ex.reps || null, ex.duration_min || null, i);
    });

    const routine = db.prepare("SELECT * FROM routines WHERE id = ?").get(routineId);
    const exList = db.prepare("SELECT * FROM routine_exercises WHERE routine_id = ? ORDER BY order_index").all(routineId);

    res.status(201).json({ message: "Rotina criada.", routine: { ...routine, exercises: exList } });
  } catch (err) {
    next(err);
  }
});

// PATCH /routine/:id
router.patch("/:id", (req, res, next) => {
  try {
    const { name, goal, frequency } = req.body;
    const db = getDb();

    const routine = db.prepare("SELECT * FROM routines WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.userId);
    if (!routine) return res.status(404).json({ error: "Rotina não encontrada." });

    const fields = [], values = [];
    if (name) { fields.push("name = ?"); values.push(name.trim()); }
    if (goal !== undefined) { fields.push("goal = ?"); values.push(goal); }
    if (frequency !== undefined) { fields.push("frequency = ?"); values.push(frequency); }

    if (fields.length === 0)
      return res.status(400).json({ error: "Nenhum campo para atualizar." });

    values.push(req.params.id);
    db.prepare(`UPDATE routines SET ${fields.join(", ")} WHERE id = ?`).run(...values);

    res.json({ message: "Rotina atualizada." });
  } catch (err) {
    next(err);
  }
});

// DELETE /routine/:id
router.delete("/:id", (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare(
      "DELETE FROM routines WHERE id = ? AND user_id = ?"
    ).run(req.params.id, req.userId);

    if (result.changes === 0)
      return res.status(404).json({ error: "Rotina não encontrada." });

    res.json({ message: "Rotina excluída." });
  } catch (err) {
    next(err);
  }
});

// ─── TREINOS REALIZADOS ───────────────────────────────────────────────────────

// GET /routine/workouts?days=30
router.get("/workouts", (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 365);
    const db = getDb();

    const workouts = db.prepare(`
      SELECT w.*, r.name AS routine_name
      FROM workouts w
      LEFT JOIN routines r ON w.routine_id = r.id
      WHERE w.user_id = ? AND w.logged_at >= datetime('now', ? || ' days')
      ORDER BY w.logged_at DESC
    `).all(req.userId, `-${days}`);

    const stats = db.prepare(`
      SELECT
        COUNT(*)                          AS total_workouts,
        COALESCE(SUM(duration_min), 0)    AS total_minutes,
        COALESCE(SUM(kcal_burned), 0)     AS total_kcal,
        COALESCE(SUM(distance_km), 0)     AS total_km
      FROM workouts
      WHERE user_id = ? AND logged_at >= datetime('now', ? || ' days')
    `).get(req.userId, `-${days}`);

    res.json({ days, workouts, stats });
  } catch (err) {
    next(err);
  }
});

// POST /routine/workouts
// Body: { name, routine_id?, kcal_burned?, duration_min?, distance_km? }
router.post("/workouts", (req, res, next) => {
  try {
    const { name, routine_id, kcal_burned, duration_min, distance_km } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ error: "Nome do treino é obrigatório." });

    const db = getDb();

    const result = db.prepare(`
      INSERT INTO workouts (user_id, routine_id, name, kcal_burned, duration_min, distance_km)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      req.userId,
      routine_id || null,
      name.trim(),
      kcal_burned ? Math.round(Number(kcal_burned)) : null,
      duration_min ? Math.round(Number(duration_min)) : null,
      distance_km ? Number(distance_km) : null
    );

    const workout = db.prepare("SELECT * FROM workouts WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ message: "Treino registrado.", workout });
  } catch (err) {
    next(err);
  }
});

// DELETE /routine/workouts/:id
router.delete("/workouts/:id", (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare(
      "DELETE FROM workouts WHERE id = ? AND user_id = ?"
    ).run(req.params.id, req.userId);

    if (result.changes === 0)
      return res.status(404).json({ error: "Treino não encontrado." });

    res.json({ message: "Treino removido." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
