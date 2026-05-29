const supabase = require("../supabase");

// Middleware: valida o JWT emitido pelo Supabase
// O frontend envia: Authorization: Bearer <supabase_access_token>
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticação não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: "Token inválido ou expirado. Faça login novamente." });
  }

  // Disponibiliza o usuário autenticado para as rotas
  req.user   = data.user;
  req.userId = data.user.id; // UUID do Supabase
  next();
}

module.exports = { requireAuth };