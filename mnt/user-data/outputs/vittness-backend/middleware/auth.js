const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "vittness_secret_dev_troque_em_producao";
const JWT_EXPIRES = "2h";
const REFRESH_EXPIRES_DAYS = 30;

function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  const refreshToken = require("crypto").randomBytes(40).toString("hex");
  return { accessToken, refreshToken };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Middleware: exige autenticação
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticação não fornecido." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado. Faça login novamente.", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Token inválido." });
  }
}

module.exports = { generateTokens, verifyToken, requireAuth, REFRESH_EXPIRES_DAYS };
