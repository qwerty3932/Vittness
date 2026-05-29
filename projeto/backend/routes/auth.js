require("dotenv").config();
const express  = require("express");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { requireAuth } = require("../middleware/auth");
const router = express.Router();

// ─── POST /auth/register ──────────────────────────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ error: "E-mail inválido." });
    if (password.length < 6)
      return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });

    const { data, error } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true,
      user_metadata: { name: name.trim() },
    });

    if (error) {
      if (error.message?.toLowerCase().includes("already"))
        return res.status(409).json({ error: "Este e-mail já está cadastrado." });
      return res.status(400).json({ error: error.message });
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id:    data.user.id,
      name:  name.trim(),
      email: email.toLowerCase().trim(),
    });

    if (profileError)
      console.error("Erro ao salvar perfil:", profileError.message);

    res.status(201).json({
      message: "Conta criada com sucesso.",
      user: {
        id:    data.user.id,
        name:  name.trim(),
        email: data.user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /auth/login ─────────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error)
      return res.status(401).json({ error: "E-mail ou senha incorretos." });

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, idade, peso, altura, objetivo")
      .eq("id", data.user.id)
      .single();

    res.json({
      message:      "Login realizado com sucesso.",
      accessToken:  data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt:    data.session.expires_at,
      user: {
        id:       data.user.id,
        email:    data.user.email,
        name:     profile?.name     || data.user.user_metadata?.name || "",
        idade:    profile?.idade    || null,
        peso:     profile?.peso     || null,
        altura:   profile?.altura   || null,
        objetivo: profile?.objetivo || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /auth/refresh ───────────────────────────────────────────────────────
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "Refresh token não fornecido." });

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error)
      return res.status(401).json({ error: "Refresh token inválido ou expirado." });

    res.json({
      accessToken:  data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt:    data.session.expires_at,
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /auth/logout ────────────────────────────────────────────────────────
router.post("/logout", requireAuth, async (req, res, next) => {
  try {
    await supabase.auth.admin.signOut(req.userId);
    res.json({ message: "Logout realizado com sucesso." });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /auth/account ─────────────────────────────────────────────────────
router.delete("/account", requireAuth, async (req, res, next) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(req.userId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Conta excluída com sucesso." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;