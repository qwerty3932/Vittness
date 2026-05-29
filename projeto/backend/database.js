// ─── ARQUIVO REMOVIDO ─────────────────────────────────────────────────────────
// O banco de dados local (SQLite) foi substituído pelo Supabase.
// Toda persistência agora passa pelo cliente em supabase.js.
//
// Para criar as tabelas no Supabase, execute o SQL abaixo no
// SQL Editor do seu projeto (supabase.com → SQL Editor):
//
// ─────────────────────────────────────────────────────────────────────────────
//
// -- Perfis de usuário (espelha auth.users)
// CREATE TABLE profiles (
//   id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
//   name        TEXT,
//   email       TEXT,
//   idade       INTEGER,
//   peso        REAL,
//   altura      INTEGER,
//   objetivo    TEXT,
//   created_at  TIMESTAMPTZ DEFAULT now(),
//   updated_at  TIMESTAMPTZ DEFAULT now()
// );
//
// -- Refeições
// CREATE TABLE meals (
//   id         BIGSERIAL PRIMARY KEY,
//   user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   name       TEXT NOT NULL,
//   kcal       INTEGER NOT NULL,
//   logged_at  TIMESTAMPTZ DEFAULT now()
// );
//
// -- Hidratação
// CREATE TABLE hydration (
//   id         BIGSERIAL PRIMARY KEY,
//   user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   amount_ml  INTEGER NOT NULL,
//   logged_at  TIMESTAMPTZ DEFAULT now()
// );
//
// -- Rotinas de treino
// CREATE TABLE routines (
//   id         BIGSERIAL PRIMARY KEY,
//   user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   name       TEXT NOT NULL,
//   goal       TEXT,
//   frequency  TEXT,
//   created_at TIMESTAMPTZ DEFAULT now()
// );
//
// -- Exercícios de uma rotina
// CREATE TABLE routine_exercises (
//   id           BIGSERIAL PRIMARY KEY,
//   routine_id   BIGINT NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
//   name         TEXT NOT NULL,
//   sets         INTEGER,
//   reps         INTEGER,
//   duration_min INTEGER,
//   order_index  INTEGER DEFAULT 0
// );
//
// -- Treinos realizados
// CREATE TABLE workouts (
//   id           BIGSERIAL PRIMARY KEY,
//   user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   routine_id   BIGINT REFERENCES routines(id) ON DELETE SET NULL,
//   name         TEXT NOT NULL,
//   kcal_burned  INTEGER,
//   duration_min INTEGER,
//   distance_km  REAL,
//   logged_at    TIMESTAMPTZ DEFAULT now()
// );
//
// -- RLS: habilite Row Level Security em cada tabela e crie políticas:
// ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
// ALTER TABLE meals            ENABLE ROW LEVEL SECURITY;
// ALTER TABLE hydration        ENABLE ROW LEVEL SECURITY;
// ALTER TABLE routines         ENABLE ROW LEVEL SECURITY;
// ALTER TABLE routine_exercises ENABLE ROW LEVEL SECURITY;
// ALTER TABLE workouts         ENABLE ROW LEVEL SECURITY;
//
// -- Política exemplo (repita para cada tabela):
// CREATE POLICY "users can manage own data" ON profiles
//   FOR ALL USING (auth.uid() = id);
//
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {}; // mantido para não quebrar imports antigos