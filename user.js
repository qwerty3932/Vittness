const express = require("express");
const { getDb } = require("../database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Todos os endpoints exigem autenticação
router.use(requireAuth);

// ─── GET /user/profile ───────────────────────────────────────────────────────
router.get("/profile", (req, res, next) => {
  try {
    const db = getDb();
    const user = db.prepare(
      "SELECT id, name, email, idade, peso, altura, objetivo, created_at FROM users WHERE id = ?"
    ).get(req.userId);

    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /user/profile ─────────────────────────────────────────────────────
// Body: { name?, idade?, peso?, altura?, objetivo? }
router.patch("/profile", (req, res, next) => {
  try {
    const { name, idade, peso, altura, objetivo } = req.body;
    const db = getDb();

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push("name = ?"); values.push(name.trim()); }
    if (idade !== undefined) { fields.push("idade = ?"); values.push(Number(idade) || null); }
    if (peso !== undefined) { fields.push("peso = ?"); values.push(Number(peso) || null); }
    if (altura !== undefined) { fields.push("altura = ?"); values.push(Number(altura) || null); }
    if (objetivo !== undefined) { fields.push("objetivo = ?"); values.push(objetivo); }

    if (fields.length === 0)
      return res.status(400).json({ error: "Nenhum campo para atualizar." });

    fields.push("updated_at = datetime('now')");
    values.push(req.userId);

    db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(...values);

    const updated = db.prepare(
      "SELECT id, name, email, idade, peso, altura, objetivo FROM users WHERE id = ?"
    ).get(req.userId);

    res.json({ message: "Perfil atualizado.", user: updated });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /user/email ───────────────────────────────────────────────────────
// Body: { newEmail, password }
router.patch("/email", async (req, res, next) => {
  try {
    const bcrypt = require("bcrypt");
    const { newEmail, password } = req.body;

    if (!newEmail || !password)
      return res.status(400).json({ error: "Novo e-mail e senha são obrigatórios." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail))
      return res.status(400).json({ error: "E-mail inválido." });

    const db = getDb();
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Senha incorreta." });

    const existing = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?")
      .get(newEmail.toLowerCase().trim(), req.userId);
    if (existing) return res.status(409).json({ error: "E-mail já em uso." });

    db.prepare("UPDATE users SET email = ?, updated_at = datetime('now') WHERE id = ?")
      .run(newEmail.toLowerCase().trim(), req.userId);

    res.json({ message: "E-mail atualizado com sucesso." });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /user/password ────────────────────────────────────────────────────
// Body: { currentPassword, newPassword }
router.patch("/password", async (req, res, next) => {
  try {
    const bcrypt = require("bcrypt");
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "Senha atual e nova senha são obrigatórias." });
    if (newPassword.length < 6)
      return res.status(400).json({ error: "A nova senha deve ter pelo menos 6 caracteres." });

    const db = getDb();
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ error: "Senha atual incorreta." });

    const hash = await bcrypt.hash(newPassword, 12);
    db.prepare("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?")
      .run(hash, req.userId);

    // Invalida todos os refresh tokens do usuário
    db.prepare("DELETE FROM refresh_tokens WHERE user_id = ?").run(req.userId);

    res.json({ message: "Senha atualizada. Faça login novamente." });
  } catch (err) {
    next(err);
  }
});

// ─── GET /user/stats ─────────────────────────────────────────────────────────
router.get("/stats", (req, res, next) => {
  try {
    const db = getDb();

    const totalWorkouts = db.prepare(
      "SELECT COUNT(*) AS count FROM workouts WHERE user_id = ?"
    ).get(req.userId);

    const totalKm = db.prepare(
      "SELECT COALESCE(SUM(distance_km), 0) AS km FROM workouts WHERE user_id = ?"
    ).get(req.userId);

    const totalMinutes = db.prepare(
      "SELECT COALESCE(SUM(duration_min), 0) AS min FROM workouts WHERE user_id = ?"
    ).get(req.userId);

    const weeklyKcal = db.prepare(`
      SELECT COALESCE(SUM(kcal), 0) AS total
      FROM meals
      WHERE user_id = ? AND logged_at >= datetime('now', '-7 days')
    `).get(req.userId);

    res.json({
      totalWorkouts: totalWorkouts.count,
      totalKm: totalKm.km,
      totalMinutes: totalMinutes.min,
      weeklyKcalConsumed: weeklyKcal.total,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
