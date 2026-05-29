const { createClient } = require("@supabase/supabase-js");
const ws = require("ws");

const SUPABASE_URL     = process.env.SUPABASE_URL     || "";
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE) {
  console.error("❌ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar no .env");
  process.exit(1);
}

// Client com service role — só usado no backend, NUNCA exposto ao frontend
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
});

module.exports = supabase;