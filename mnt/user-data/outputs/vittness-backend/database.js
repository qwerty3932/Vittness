const sqlite3 = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "vittness.db");
let db;

function getDb() {
  if (!db) db = new sqlite3(DB_PATH);
  return db;
}

function initDatabase(callback) {
  const db = getDb();

  // Ativa chaves estrangeiras
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");

  db.exec(`
    -- ── Usuários ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,           -- bcrypt hash
      idade       INTEGER,
      peso        REAL,
      altura      INTEGER,
      objetivo    TEXT,
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now'))
    );

    -- ── Refeições ─────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS meals (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name        TEXT    NOT NULL,
      kcal        INTEGER NOT NULL,
      logged_at   TEXT    DEFAULT (datetime('now'))
    );

    -- ── Hidratação ────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS hydration (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount_ml   INTEGER NOT NULL,
      logged_at   TEXT    DEFAULT (datetime('now'))
    );

    -- ── Rotinas de treino ─────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS routines (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name        TEXT    NOT NULL,
      goal        TEXT,
      frequency   TEXT,
      created_at  TEXT    DEFAULT (datetime('now'))
    );

    -- ── Exercícios da rotina ──────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS routine_exercises (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      routine_id  INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
      name        TEXT    NOT NULL,
      sets        INTEGER,
      reps        INTEGER,
      duration_min INTEGER,
      order_index INTEGER DEFAULT 0
    );

    -- ── Treinos realizados ────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS workouts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      routine_id  INTEGER REFERENCES routines(id) ON DELETE SET NULL,
      name        TEXT    NOT NULL,
      kcal_burned INTEGER,
      duration_min INTEGER,
      distance_km REAL,
      logged_at   TEXT    DEFAULT (datetime('now'))
    );

    -- ── Refresh tokens ────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token       TEXT    NOT NULL UNIQUE,
      expires_at  TEXT    NOT NULL,
      created_at  TEXT    DEFAULT (datetime('now'))
    );

    -- Índices para buscas frequentes
    CREATE INDEX IF NOT EXISTS idx_meals_user_date    ON meals(user_id, logged_at);
    CREATE INDEX IF NOT EXISTS idx_hydration_user_date ON hydration(user_id, logged_at);
    CREATE INDEX IF NOT EXISTS idx_workouts_user_date  ON workouts(user_id, logged_at);
    CREATE INDEX IF NOT EXISTS idx_refresh_token       ON refresh_tokens(token);
  `);

  console.log("✅ Banco de dados inicializado:", DB_PATH);
  if (callback) callback();
}

module.exports = { getDb, initDatabase };
