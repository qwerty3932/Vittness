const express   = require("express");
const ollama = require("ollama");
const supabase   = require("../supabase");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// ─── POST /ai/generate-plan ───────────────────────────────────────────────────
// Body: { goal, frequency, days[] }
// Gera um plano de treino semanal completo com base nos exercícios do banco
router.post("/generate-plan", async (req, res, next) => {
  try {
    const { goal, frequency } = req.body;

    if (!goal || !frequency)
      return res.status(400).json({ error: "Objetivo e frequência são obrigatórios." });

    // 1. Busca perfil do usuário
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, idade, peso, altura, objetivo")
      .eq("id", req.userId)
      .single();

    // 2. Busca exercícios do banco filtrados pelo objetivo
    const { data: exercises, error: exError } = await supabase
      .from("exercises")
      .select("name, category, equipment, difficulty, muscle_group, met")
      .eq("goal", goal)
      .order("category")
      .order("name");

    if (exError)
      return res.status(500).json({ error: "Erro ao buscar exercícios." });

    if (!exercises || exercises.length === 0)
      return res.status(404).json({ error: "Nenhum exercício encontrado para este objetivo." });

    // 3. Organiza exercícios por categoria para o prompt
    const byCategory = {};
    exercises.forEach(ex => {
      if (!byCategory[ex.category]) byCategory[ex.category] = [];
      byCategory[ex.category].push(`${ex.name} (${ex.difficulty}, ${ex.equipment})`);
    });

    const exerciseList = Object.entries(byCategory)
      .map(([cat, exs]) => `${cat}: ${exs.join(", ")}`)
      .join("\n");

    // 4. Monta o prompt para o Claude
    const userInfo = profile
      ? `Usuário: ${profile.name || "Atleta"}, ${profile.idade || "idade não informada"} anos, ${profile.peso || "peso não informado"}kg, ${profile.altura || "altura não informada"}cm.`
      : "Perfil não informado.";

    const freqMap = { "3X": 3, "5X": 5, "6X": 6, "DAILY": 7 };
    const daysPerWeek = freqMap[frequency] || 3;

    const prompt = `Você é um personal trainer especialista. Crie um plano de treino semanal personalizado.

${userInfo}
Objetivo: ${goal}
Frequência: ${daysPerWeek} dias por semana

Exercícios disponíveis no banco de dados:
${exerciseList}

Crie um plano de ${daysPerWeek} dias de treino usando APENAS os exercícios listados acima.
Distribua os grupos musculares de forma inteligente entre os dias.
Para cada dia, inclua de 4 a 6 exercícios com séries e repetições adequadas ao objetivo.

Responda APENAS com um JSON válido, sem texto extra, sem markdown, sem explicações. Formato exato:
{
  "plan_name": "nome do plano",
  "goal": "${goal}",
  "frequency": "${frequency}",
  "weekly_kcal_estimate": número estimado de calorias gastas na semana,
  "days": [
    {
      "day": "Dia da semana",
      "focus": "grupo muscular foco",
      "duration_min": duração em minutos,
      "kcal_estimate": calorias estimadas,
      "exercises": [
        {
          "name": "nome do exercício",
          "sets": número de séries,
          "reps": "repetições (ex: 10-12)",
          "rest_seconds": descanso em segundos,
          "tip": "dica de execução curta"
        }
      ]
    }
  ],
  "ai_tip": "dica geral personalizada para o usuário baseada no perfil dele"
}`;

    // 5. Chama o Ollama
    const response = await ollama.chat({
    model:    "llama3",
    messages: [{ role: "user", content: prompt }],
    });

    const raw = response.message.content;

    // 6. Faz parse do JSON retornado
    let plan;
    try {
      const raw = message.content[0].text.trim();
      const cleaned = raw.replace(/```json|```/g, "").trim();
      plan = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(500).json({ error: "Erro ao processar resposta da IA. Tente novamente." });
    }

    // 7. Salva o plano gerado no Supabase
    const { data: savedPlan, error: saveError } = await supabase
      .from("ai_plans")
      .insert({
        user_id:   req.userId,
        goal,
        frequency,
        plan_data: plan,
      })
      .select()
      .single();

    if (saveError)
      console.error("Erro ao salvar plano:", saveError.message);

    res.json({
      message: "Plano gerado com sucesso.",
      plan,
      plan_id: savedPlan?.id || null,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /ai/plans ────────────────────────────────────────────────────────────
// Lista os planos gerados pelo usuário
router.get("/plans", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("ai_plans")
      .select("id, goal, frequency, created_at, plan_data")
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ plans: data || [] });
  } catch (err) { next(err); }
});

// ─── GET /ai/plans/:id ────────────────────────────────────────────────────────
// Retorna um plano específico
router.get("/plans/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("ai_plans")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.userId)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Plano não encontrado." });

    res.json({ plan: data });
  } catch (err) { next(err); }
});

// ─── DELETE /ai/plans/:id ─────────────────────────────────────────────────────
router.delete("/plans/:id", async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("ai_plans")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) return res.status(404).json({ error: "Plano não encontrado." });
    res.json({ message: "Plano removido." });
  } catch (err) { next(err); }
});

module.exports = router;