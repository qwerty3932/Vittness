const express = require("express");
const Groq = require("groq-sdk"); // 1. Importa o SDK da Groq
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/auth");

// 2. Inicializa a Groq (ela busca a chave GROQ_API_KEY do seu .env automaticamente)
const groq = new Groq();

const router = express.Router();
router.use(requireAuth);

// ─── POST /ai/generate-plan ───────────────────────────────────────────────────
router.post("/generate-plan", async (req, res, next) => {
  try {
    const { goal, frequency, notes } = req.body;

    if (!goal || !frequency)
      return res.status(400).json({ error: "Objetivo e frequência são obrigatórios." });

    const daysPerWeek = parseInt(frequency, 10);
    if (isNaN(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) {
      return res.status(400).json({ error: "A frequência deve ser um número entre 1 e 7." });
    }

    // 1. Busca perfil do usuário
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, idade, peso, altura, objetivo")
      .eq("id", req.userId)
      .single();

    // 2. Busca exercícios do banco filtrados pelo objetivo
    const { data: exercises, error: exError } = await supabase
      .from("exercises")
      .select("name, category, equipment, difficulty, muscle_group, met, description") // <-- Adicione description aqui
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
        // Incluindo a descrição no texto que vai para o prompt da IA
        byCategory[ex.category].push(`${ex.name} (${ex.difficulty}, ${ex.equipment}) - Descrição: ${ex.description || 'Sem descrição'}`);
      });

    const exerciseList = Object.entries(byCategory)
      .map(([cat, exs]) => `${cat}: ${exs.join(", ")}`)
      .join("\n");

    // 4. Monta o prompt para a IA
    const userInfo = profile
      ? `Usuário: ${profile.name || "Atleta"}, ${profile.idade || "idade não informada"} anos, ${profile.peso || "peso não informado"}kg, ${profile.altura || "altura não informada"}cm.`
      : "Perfil não informado.";

    // 4a. Monta lista plana de exercícios disponíveis para retornar ao frontend
    const availableExercises = exercises.map(ex => ({
      name: ex.name,
      category: ex.category,
      equipment: ex.equipment,
      difficulty: ex.difficulty,
      muscle_group: ex.muscle_group,
      description: ex.description || "",
    }));

    const prompt = `Você é um personal trainer especialista. Crie um plano de treino semanal personalizado.

${userInfo}
Objetivo: ${goal}
Frequência: O usuário vai realizar exatamente ${daysPerWeek} treinos diferentes.
${notes ? `Observações e restrições do usuário: ${notes}` : ""}

Exercícios disponíveis no banco de dados:
${exerciseList}

Crie um plano com exatamente ${daysPerWeek} blocos de treino usando APENAS os exercícios listados acima.
Nomeie os blocos estritamente de forma numérica sequencial: "Treino 1", "Treino 2", "Treino 3", etc., até chegar ao limite de ${daysPerWeek}.
Distribua os grupos musculares de forma inteligente entre os treinos para cobrir a rotina de forma eficiente.
Para cada treino, inclua de 4 a 6 exercícios com séries e repetições adequadas ao objetivo.

Responda APENAS com um JSON válido, sem texto extra, sem markdown, sem explicações. Formato exato:
{
  "plan_name": "nome do plano",
  "goal": "${goal}",
  "frequency": "${daysPerWeek}X",
  "weekly_kcal_estimate": número estimado de calorias gastas na semana,
  "days": [
    {
      "day": "Treino 1",
      "focus": "grupo muscular foco do Treino 1",
      "duration_min": duration em minutos,
      "kcal_estimate": calorias estimadas,
      "exercises": [
        {
          "name": "nome do exercício",
          "sets": número de séries,
          "reps": "repetições",
          "description": "uma breve descrição de como executar o exercício baseada nos dados enviados"
        }
      ]
    }
  ],
  "ai_tip": "fornecer a descrição de como faer o exercício"
}`;

    // 5. Chama a API da Groq (Substituindo o Ollama)
    // Usamos o modelo 'llama3-8b-8192' que é equivalente ao que você usava localmente, só que voando!
    const estimatedTokens = 800 + daysPerWeek * 500;
    const maxTokens = Math.min(8000, estimatedTokens);
    
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_completion_tokens: maxTokens
    });

    // 6. Faz parse do JSON retornado pela Groq
    let plan;
    try {
      const raw = response.choices[0].message.content.trim();
      plan = JSON.parse(raw);
    } catch (parseErr) {
      console.error("Erro no parse da Groq:", parseErr);
      return res.status(500).json({ error: "Erro ao processar resposta da IA. Tente novamente." });
    }

    // 7. Salva o plano gerado no Supabase
    const { data: savedPlan, error: saveError } = await supabase
      .from("ai_plans")
      .insert({
        user_id: req.userId,
        goal,
        frequency: `${daysPerWeek}X`,
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
      available_exercises: availableExercises,
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
