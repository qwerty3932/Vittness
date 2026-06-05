const express  = require("express");
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// ─── LISTAR ROTINAS (GET /routine) ───────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ routines: data || [] });
  } catch (err) { next(err); }
});

// ─── SALVAR NOVA ROTINA (POST /routine) ───────────────────────────────────────
router.post("/", async (req, res, next) => {
  try {
    // Desestrutura exatamente as colunas da sua tabela vindo do body do Frontend
    const { plan_name, goal, frequency, weekly_kcal_estimate, days, ai_tip, plan_data } = req.body;

    // Validação básica do nome
    if (!plan_name?.trim()) {
      return res.status(400).json({ error: "O nome do plano (plan_name) é obrigatório." });
    }

    // Insere mapeando cada valor para a sua respectiva coluna no Supabase
    const { data: savedPlan, error } = await supabase
      .from("routines")
      .insert({
        user_id: req.userId, // Obtido automaticamente via token pelo middleware
        plan_name: plan_name.trim(),
        goal: goal || null,
        frequency: frequency || null,
        weekly_kcal_estimate: weekly_kcal_estimate ? Number(weekly_kcal_estimate) : null,
        days: days || [], // Salva o array de dias diretamente (caso a coluna seja jsonb/json)
        ai_tip: ai_tip || null,
        plan_data: plan_data || null // Para metadados adicionais, se houver
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: "Rotina salva com sucesso.", routine: savedPlan });
  } catch (err) { next(err); }
});

// ─── DELETAR ROTINA (DELETE /routine/:id) ────────────────────────────────────
router.delete("/:id", async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("routines")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) return res.status(404).json({ error: "Rotina não encontrada." });
    res.json({ message: "Rotina excluída com sucesso." });
  } catch (err) { next(err); }
});

module.exports = router;