const express  = require("express");
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/auth");
 
const router = express.Router();
router.use(requireAuth);
 
// ─── REFEIÇÕES ────────────────────────────────────────────────────────────────
 
// GET /nutrition/meals?date=YYYY-MM-DD
router.get("/meals", async (req, res, next) => {
  try {
    // Usa data local enviada pelo frontend (formato YYYY-MM-DD) ou hoje em UTC
    const date = req.query.date || new Date().toISOString().slice(0, 10);
 
    // Filtra registros do dia inteiro em UTC
    const { data: meals, error } = await supabase
      .from("meals")
      .select("id, name, kcal, protein, carbs, fats, logged_at")
      .eq("user_id", req.userId)
      .gte("logged_at", `${date}T00:00:00.000Z`)
      .lte("logged_at", `${date}T23:59:59.999Z`)
      .order("logged_at", { ascending: true });
 
    if (error) return res.status(500).json({ error: error.message });
 
    const rows = meals || [];
 
    // Totais calculados no servidor para garantir consistência
    const totalKcal    = rows.reduce((s, m) => s + (Number(m.kcal)    || 0), 0);
    const totalProtein = rows.reduce((s, m) => s + (Number(m.protein) || 0), 0);
    const totalCarbs   = rows.reduce((s, m) => s + (Number(m.carbs)   || 0), 0);
    const totalFats    = rows.reduce((s, m) => s + (Number(m.fats)    || 0), 0);
 
    res.json({ date, meals: rows, totalKcal, totalProtein, totalCarbs, totalFats });
  } catch (err) {
    next(err);
  }
});
 
// POST /nutrition/meals
// Body: { name, kcal, protein?, carbs?, fats?, logged_at? }
router.post("/meals", async (req, res, next) => {
  try {
    const { name, kcal, protein = 0, carbs = 0, fats = 0, logged_at } = req.body;
 
    if (!name || !name.trim())
      return res.status(400).json({ error: "Nome da refeição é obrigatório." });
    if (!kcal || isNaN(kcal) || Number(kcal) <= 0)
      return res.status(400).json({ error: "Calorias devem ser um número positivo." });
 
    const { data, error } = await supabase
      .from("meals")
      .insert({
        user_id:   req.userId,
        name:      name.trim(),
        kcal:      Math.round(Number(kcal)),
        protein:   Number(protein) || 0,
        carbs:     Number(carbs)   || 0,
        fats:      Number(fats)    || 0,
        logged_at: logged_at || new Date().toISOString(),
      })
      .select()
      .single();
 
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Refeição registrada.", meal: data });
  } catch (err) {
    next(err);
  }
});
 
// PUT /nutrition/meals/:id
// Body: { name?, kcal?, protein?, carbs?, fats?, logged_at? }
router.put("/meals/:id", async (req, res, next) => {
  try {
    const { name, kcal, protein, carbs, fats, logged_at } = req.body;
    const updates = {};
 
    if (name      !== undefined) updates.name      = name.trim();
    if (kcal      !== undefined) updates.kcal      = Math.round(Number(kcal));
    if (protein   !== undefined) updates.protein   = Number(protein) || 0;
    if (carbs     !== undefined) updates.carbs     = Number(carbs)   || 0;
    if (fats      !== undefined) updates.fats      = Number(fats)    || 0;
    if (logged_at !== undefined) updates.logged_at = logged_at;
 
    if (Object.keys(updates).length === 0)
      return res.status(400).json({ error: "Nenhum campo para atualizar." });
 
    const { data, error } = await supabase
      .from("meals")
      .update(updates)
      .eq("id", req.params.id)
      .eq("user_id", req.userId)
      .select()
      .single();
 
    if (error || !data)
      return res.status(404).json({ error: "Refeição não encontrada." });
 
    res.json({ message: "Refeição atualizada.", meal: data });
  } catch (err) {
    next(err);
  }
});
 
// DELETE /nutrition/meals/:id
router.delete("/meals/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("meals")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId)
      .select("id")
      .single();
 
    if (error || !data)
      return res.status(404).json({ error: "Refeição não encontrada." });
 
    res.json({ message: "Refeição removida." });
  } catch (err) {
    next(err);
  }
});
 
// GET /nutrition/meals/history?days=7
router.get("/meals/history", async (req, res, next) => {
  try {
    const days  = Math.min(parseInt(req.query.days) || 7, 90);
    const since = new Date(Date.now() - days * 86400000).toISOString();
 
    const { data, error } = await supabase
      .from("meals")
      .select("kcal, protein, carbs, fats, logged_at")
      .eq("user_id", req.userId)
      .gte("logged_at", since)
      .order("logged_at", { ascending: true });
 
    if (error) return res.status(500).json({ error: error.message });
 
    // Agrupamento por dia no servidor
    const byDay = {};
    (data || []).forEach(m => {
      const day = m.logged_at.slice(0, 10);
      if (!byDay[day]) {
        byDay[day] = { day, total_kcal: 0, total_protein: 0, total_carbs: 0, total_fats: 0, entries: 0 };
      }
      byDay[day].total_kcal    += Number(m.kcal)    || 0;
      byDay[day].total_protein += Number(m.protein) || 0;
      byDay[day].total_carbs   += Number(m.carbs)   || 0;
      byDay[day].total_fats    += Number(m.fats)    || 0;
      byDay[day].entries++;
    });
 
    const history = Object.values(byDay).sort((a, b) => a.day.localeCompare(b.day));
    res.json({ days, history });
  } catch (err) {
    next(err);
  }
});
 
// ─── HIDRATAÇÃO ───────────────────────────────────────────────────────────────
 
// GET /nutrition/hydration?date=YYYY-MM-DD
// A tabela hydration usa `created_at` (DEFAULT NOW) — não tem coluna `logged_at`.
// O frontend envia a data local (YYYY-MM-DD) para filtrar corretamente por fuso horário.
router.get("/hydration", async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
 
    // Janela UTC que cobre o dia local completo do usuário
    // Expandimos 12h para cada lado para cobrir qualquer fuso (-12 a +14)
    const from = new Date(`${date}T00:00:00.000Z`);
    from.setUTCHours(from.getUTCHours() - 14); // back 14h for UTC+14 zones
    const to   = new Date(`${date}T23:59:59.999Z`);
    to.setUTCHours(to.getUTCHours() + 12);     // forward 12h for UTC-12 zones
 
    const { data: rows, error } = await supabase
      .from("hydration")
      .select("id, amount_ml, logged_at")  // usa created_at, que sempre existe
      .eq("user_id", req.userId)
      .gte("logged_at", from.toISOString())
      .lte("logged_at", to.toISOString())
      .order("logged_at", { ascending: true });
 
    if (error) return res.status(500).json({ error: error.message });
 
    // Mapeia created_at → logged_at para manter compatibilidade com o frontend
    const entries = rows || [];
 
    const totalMl = entries.reduce((s, r) => s + (Number(r.amount_ml) || 0), 0);
 
    res.json({
      date,
      entries,
      totalMl,
      totalL: +(totalMl / 1000).toFixed(2),
    });
  } catch (err) {
    next(err);
  }
});
 
// POST /nutrition/hydration
// Body: { amount_ml }
router.post("/hydration", async (req, res, next) => {
  try {
    const { amount_ml } = req.body;
 
    if (!amount_ml || isNaN(amount_ml) || Number(amount_ml) <= 0)
      return res.status(400).json({ error: "Quantidade em ml deve ser um número positivo." });
 
    const { data, error } = await supabase
  .from("hydration")
  .insert({
    user_id:   req.userId,
    amount_ml: Math.round(Number(amount_ml)),
    logged_at: new Date().toISOString(),
  })
  .select("id, amount_ml, logged_at")
  .single();

if (error) return res.status(500).json({ error: error.message });

res.status(201).json({
  message: "Hidratação registrada.",
  entry: data,
});

  } catch (err) {
    next(err);
  }
});
 
// DELETE /nutrition/hydration/:id
router.delete("/hydration/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("hydration")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId)
      .select("id")
      .single();
 
    if (error || !data)
      return res.status(404).json({ error: "Registro não encontrado." });
 
    res.json({ message: "Registro removido." });
  } catch (err) {
    next(err);
  }
});
 
module.exports = router;
