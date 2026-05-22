const express = require("express");
const { getDb } = require("../database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// ─── REFEIÇÕES ────────────────────────────────────────────────────────────────

// GET /nutrition/meals?date=YYYY-MM-DD
router.get("/meals", (req, res, next) => {
  try {
    const db = getDb();
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    const meals = db.prepare(`
      SELECT id, name, kcal, logged_at
      FROM meals
      WHERE user_id = ? AND date(logged_at) = ?
      ORDER BY logged_at ASC
    `).all(req.userId, date);

    const totalKcal = meals.reduce((s, m) => s + m.kcal, 0);

    res.json({ date, meals, totalKcal });
  } catch (err) {
    next(err);
  }
});

// POST /nutrition/meals
// Body: { name, kcal, logged_at? }
router.post("/meals", (req, res, next) => {
  try {
    const { name, kcal, logged_at } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ error: "Nome da refeição é obrigatório." });
    if (!kcal || isNaN(kcal) || Number(kcal) <= 0)
      return res.status(400).json({ error: "Calorias devem ser um número positivo." });

    const db = getDb();
    const result = db.prepare(
      "INSERT INTO meals (user_id, name, kcal, logged_at) VALUES (?, ?, ?, COALESCE(?, datetime('now')))"
    ).run(req.userId, name.trim(), Math.round(Number(kcal)), logged_at || null);

    const meal = db.prepare("SELECT * FROM meals WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ message: "Refeição registrada.", meal });
  } catch (err) {
    next(err);
  }
});

// DELETE /nutrition/meals/:id
router.delete("/meals/:id", (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare(
      "DELETE FROM meals WHERE id = ? AND user_id = ?"
    ).run(req.params.id, req.userId);

    if (result.changes === 0)
      return res.status(404).json({ error: "Refeição não encontrada." });

    res.json({ message: "Refeição removida." });
  } catch (err) {
    next(err);
  }
});

// GET /nutrition/meals/history?days=7
router.get("/meals/history", (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 90);
    const db = getDb();

    const rows = db.prepare(`
      SELECT date(logged_at) AS day, SUM(kcal) AS total_kcal, COUNT(*) AS entries
      FROM meals
      WHERE user_id = ? AND logged_at >= datetime('now', ? || ' days')
      GROUP BY day
      ORDER BY day ASC
    `).all(req.userId, `-${days}`);

    res.json({ days, history: rows });
  } catch (err) {
    next(err);
  }
});

// ─── HIDRATAÇÃO ───────────────────────────────────────────────────────────────

// GET /nutrition/hydration?date=YYYY-MM-DD
router.get("/hydration", (req, res, next) => {
  try {
    const db = getDb();
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    const rows = db.prepare(`
      SELECT id, amount_ml, logged_at
      FROM hydration
      WHERE user_id = ? AND date(logged_at) = ?
      ORDER BY logged_at ASC
    `).all(req.userId, date);

    const totalMl = rows.reduce((s, r) => s + r.amount_ml, 0);

    res.json({ date, entries: rows, totalMl, totalL: +(totalMl / 1000).toFixed(2) });
  } catch (err) {
    next(err);
  }
});

// POST /nutrition/hydration
// Body: { amount_ml }
router.post("/hydration", (req, res, next) => {
  try {
    const { amount_ml } = req.body;

    if (!amount_ml || isNaN(amount_ml) || Number(amount_ml) <= 0)
      return res.status(400).json({ error: "Quantidade em ml deve ser um número positivo." });

    const db = getDb();
    const result = db.prepare(
      "INSERT INTO hydration (user_id, amount_ml) VALUES (?, ?)"
    ).run(req.userId, Math.round(Number(amount_ml)));

    const entry = db.prepare("SELECT * FROM hydration WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ message: "Hidratação registrada.", entry });
  } catch (err) {
    next(err);
  }
});

// DELETE /nutrition/hydration/:id
router.delete("/hydration/:id", (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare(
      "DELETE FROM hydration WHERE id = ? AND user_id = ?"
    ).run(req.params.id, req.userId);

    if (result.changes === 0)
      return res.status(404).json({ error: "Registro não encontrado." });

    res.json({ message: "Registro removido." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
