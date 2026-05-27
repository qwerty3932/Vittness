const express = require("express");
const bcrypt = require("bcrypt");
const { getDb } = require("../database");
const { generateTokens, requireAuth, REFRESH_EXPIRES_DAYS } = require("../middleware/auth");

const router = express.Router();
const SALT_ROUNDS = 12;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function refreshExpiresAt() {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_EXPIRES_DAYS);
  return d.toISOString();
}

// ─── POST /auth/register ─────────────────────────────────────────────────────
// Body: { name, email, password }
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validações
    if (!name || !email || !password)
      return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
    if (!isValidEmail(email))
      return res.status(400).json({ error: "E-mail inválido." });
    if (password.length < 6)
      return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });

    const db = getDb();

    // Verifica duplicidade
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase().trim());
    if (existing)
      return res.status(409).json({ error: "Este e-mail já está cadastrado." });

    // Hash da senha
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insere usuário
    const result = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    ).run(name.trim(), email.toLowerCase().trim(), hash);

    const userId = result.lastInsertRowid;

    // Gera tokens
    const { accessToken, refreshToken } = generateTokens(userId);
    db.prepare(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)"
    ).run(userId, refreshToken, refreshExpiresAt());

    res.status(201).json({
      message: "Conta criada com sucesso.",
      accessToken,
      refreshToken,
      user: { id: userId, name: name.trim(), email: email.toLowerCase().trim() },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /auth/login ────────────────────────────────────────────────────────
// Body: { email, password }
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });

    const db = getDb();
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());

    if (!user)
      return res.status(401).json({ error: "E-mail ou senha incorretos." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "E-mail ou senha incorretos." });

    // Gera tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    db.prepare(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)"
    ).run(user.id, refreshToken, refreshExpiresAt());

    res.json({
      message: "Login realizado com sucesso.",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        idade: user.idade,
        peso: user.peso,
        altura: user.altura,
        objetivo: user.objetivo,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /auth/refresh ──────────────────────────────────────────────────────
// Body: { refreshToken }
router.post("/refresh", (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "Refresh token não fornecido." });

    const db = getDb();
    const row = db.prepare(
      "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > datetime('now')"
    ).get(refreshToken);

    if (!row)
      return res.status(401).json({ error: "Refresh token inválido ou expirado." });

    // Remove o token usado (rotação de refresh token)
    db.prepare("DELETE FROM refresh_tokens WHERE id = ?").run(row.id);

    // Gera novos tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(row.user_id);
    db.prepare(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)"
    ).run(row.user_id, newRefreshToken, refreshExpiresAt());

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
});

// ─── POST /auth/logout ───────────────────────────────────────────────────────
// Body: { refreshToken }
router.post("/logout", requireAuth, (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const db = getDb();

    if (refreshToken) {
      db.prepare("DELETE FROM refresh_tokens WHERE token = ? AND user_id = ?")
        .run(refreshToken, req.userId);
    }

    res.json({ message: "Logout realizado com sucesso." });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /auth/account ────────────────────────────────────────────────────
// Exclui conta do usuário logado
router.delete("/account", requireAuth, async (req, res, next) => {
  try {
    const { password } = req.body;
    const db = getDb();

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Senha incorreta." });

    db.prepare("DELETE FROM users WHERE id = ?").run(req.userId);

    res.json({ message: "Conta excluída com sucesso." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
