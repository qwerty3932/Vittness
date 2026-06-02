const express  = require("express");
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /exercises?goal=Musculação&category=Peito
router.get("/", async (req, res, next) => {
  try {
    const { goal, category, difficulty } = req.query;

    let query = supabase
      .from("exercises")
      .select("*")
      .order("category")
      .order("name");

    if (goal)       query = query.eq("goal", goal);
    if (category)   query = query.eq("category", category);
    if (difficulty) query = query.eq("difficulty", difficulty);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json({ exercises: data });
  } catch (err) { next(err); }
});

// GET /exercises/categories?goal=Musculação
router.get("/categories", async (req, res, next) => {
  try {
    const { goal } = req.query;

    let query = supabase
      .from("exercises")
      .select("category")
      .order("category");

    if (goal) query = query.eq("goal", goal);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    const categories = [...new Set(data.map(e => e.category))];
    res.json({ categories });
  } catch (err) { next(err); }
});

module.exports = router;