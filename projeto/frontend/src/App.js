import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0d0d0d",
  surface: "#1a1a1a",
  surface2: "#222222",
  surface3: "#2a2a2a",
  accent: "#8bc34a",
  accentDark: "#6a9e2f",
  accentLight: "#a5d65e",
  text: "#ffffff",
  textSecondary: "#aaaaaa",
  textMuted: "#666666",
  danger: "#e74c3c",
  warning: "#f39c12",
  info: "#3498db",
  border: "#2e2e2e",
};

const styles = {
  app: {
    background: COLORS.bg,
    minHeight: "100vh",
    fontFamily: "'Barlow Condensed', 'Barlow', sans-serif",
    color: COLORS.text,
    maxWidth: 420,
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  },
  screen: {
    minHeight: "100vh",
    paddingBottom: 80,
    animation: "fadeIn 0.2s ease",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: COLORS.accent,
    fontSize: 22,
    cursor: "pointer",
    padding: 4,
  },
  card: {
    background: COLORS.surface,
    borderRadius: 12,
    padding: "16px",
    margin: "12px 16px",
    border: `1px solid ${COLORS.border}`,
  },
  accentCard: {
    background: `linear-gradient(135deg, ${COLORS.accentDark} 0%, ${COLORS.accent} 100%)`,
    borderRadius: 12,
    padding: "16px",
    margin: "12px 16px",
    color: "#000",
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: 800,
    color: COLORS.accent,
    letterSpacing: -1,
  },
  btn: {
    background: COLORS.accent,
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "14px 20px",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    width: "100%",
    transition: "opacity 0.15s",
  },
  btnOutline: {
    background: "transparent",
    color: COLORS.accent,
    border: `1.5px solid ${COLORS.accent}`,
    borderRadius: 8,
    padding: "13px 20px",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.15s",
  },
  input: {
    background: COLORS.surface2,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "13px 16px",
    fontSize: 15,
    color: COLORS.text,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    marginBottom: 12,
    fontFamily: "inherit",
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.accent,
    marginBottom: 6,
    display: "block",
  },
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 420,
    background: COLORS.surface,
    borderTop: `1px solid ${COLORS.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "8px 0 12px",
    zIndex: 100,
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    cursor: "pointer",
    padding: "4px 12px",
    borderRadius: 8,
    transition: "all 0.15s",
    background: "none",
    border: "none",
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "inherit",
  },
  navItemActive: {
    color: COLORS.accent,
  },
  badge: (color = COLORS.accent) => ({
    background: color + "22",
    color: color,
    borderRadius: 4,
    padding: "3px 8px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
  }),
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.textSecondary,
    padding: "16px 20px 8px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  col: {
    display: "flex",
    flexDirection: "column",
  },
  tag: {
    background: COLORS.accent + "22",
    color: COLORS.accent,
    borderRadius: 4,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    display: "inline-block",
  },
};

function ProgressBar({ value, max, color = COLORS.accent }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ height: 6, background: COLORS.surface3, borderRadius: 3, overflow: "hidden", marginTop: 8 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
    </div>
  );
}

function CircleProgress({ value, max, size = 80, stroke = 7, color = COLORS.accent, label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.surface3} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill={color} fontSize={15} fontWeight={700} fontFamily="inherit">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      {label && <span style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 }}>{label}</span>}
    </div>
  );
}


// ─── SCREENS ────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, onNav }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(false);
    
    if (!email || !pass) {
      setErr("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErr(data.error || "Erro ao fazer login.");
      } else {
        localStorage.setItem("accessToken", data.accessToken);
        onLogin(data.user);
      }
    } catch (e) {
      setErr("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ ...styles.screen, display: "flex", flexDirection: "column", justifyContent: "center", padding: 20, minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ ...styles.logo, fontSize: 32 }}>⚡ Vittness</div>
        <div style={{ color: COLORS.textSecondary, marginTop: 8 }}>Acesse sua conta para treinar</div>
      </div>

      <form onSubmit={handleLoginSubmit} style={styles.card}>
        <label style={styles.inputLabel}>E-mail</label>
        <input style={styles.input} type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />

        <label style={styles.inputLabel}>Senha</label>
        <input style={styles.input} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />

        {err && <div style={{ color: COLORS.danger, fontSize: 13, marginBottom: 12 }}>⚠ {err}</div>}

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <span style={{ color: COLORS.textMuted, fontSize: 14 }}>Não tem uma conta? </span>
        <span style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 700, fontSize: 14 }} onClick={() => onNav("register")}>Cadastre-se</span>
      </div>
    </div>
  );
}

function RegisterScreen({ onLogin, onNav }) {
  const [form, setForm] = useState({ name: "", email: "", pass: "", confirm: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setErr("");
    
    if (!form.name || !form.email || !form.pass) {
      setErr("Preencha todos os campos obrigatórios.");
      return;
    }
    if (form.pass !== form.confirm) {
      setErr("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.pass }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErr(data.error || "Erro ao criar conta.");
        return;
      }

      const loginRes = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.pass }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setErr("Conta criada com sucesso, mas houve um erro no login automático. Tente entrar manualmente.");
        return;
      }

      localStorage.setItem("accessToken", loginData.accessToken);

      try {
        await fetch(`${process.env.REACT_APP_API_URL}/profiles`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginData.accessToken}`
          },
          body: JSON.stringify({ 
            name: form.name,
            email: form.email
          }),
        });
      } catch (profileError) {
        console.error("Erro ao criar registro de perfil:", profileError);
      }

      onLogin(loginData.user);

    } catch (e) {
      setErr("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ ...styles.screen, display: "flex", flexDirection: "column", justifyContent: "center", padding: 20, minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ ...styles.logo, fontSize: 32 }}>⚡ Vittness</div>
        <div style={{ color: COLORS.textSecondary, marginTop: 8 }}>Crie sua conta elite</div>
      </div>

      <form onSubmit={handleRegisterSubmit} style={styles.card}>
        <label style={styles.inputLabel}>Nome Completo</label>
        <input style={styles.input} type="text" placeholder="Seu nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />

        <label style={styles.inputLabel}>E-mail</label>
        <input style={styles.input} type="email" placeholder="seu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />

        <label style={styles.inputLabel}>Senha</label>
        <input style={styles.input} type="password" placeholder="Mínimo 6 caracteres" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} />

        <label style={styles.inputLabel}>Confirmar Senha</label>
        <input style={styles.input} type="password" placeholder="Repita a senha" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} />

        {err && <div style={{ color: COLORS.danger, fontSize: 13, marginBottom: 12 }}>⚠ {err}</div>}

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Criando..." : "Criar Conta"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <span style={{ color: COLORS.textMuted, fontSize: 14 }}>Já tem conta? </span>
        <span style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 700, fontSize: 14 }} onClick={() => onNav("login")}>Fazer Login</span>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle, btnLabel, onBtn }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 24px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 20 }}>{subtitle}</div>
      {btnLabel && <button style={{ ...styles.btn, maxWidth: 240, margin: "0 auto" }} onClick={onBtn}>{btnLabel}</button>}
    </div>
  );
}

// ─── HOME SCREEN (substitui o Feed) ─────────────────────────────────────────

function HomeScreen({ onNav, currentUser }) {
  const profileComplete = currentUser?.peso && currentUser?.altura && currentUser?.idade;

  return (
    <div style={styles.screen}>
      {/* Boas-vindas */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, letterSpacing: 2, marginBottom: 4 }}>⚡ BEM-VINDO DE VOLTA</div>
        <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
          Olá, {currentUser?.name?.split(" ")[0] || "Atleta"}.
        </div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 6 }}>Pronto para treinar hoje?</div>
      </div>

      {/* Alerta de perfil incompleto */}
      {!profileComplete && (
        <div style={{ ...styles.card, borderColor: COLORS.warning + "55", background: COLORS.warning + "0d" }}>
          <div style={{ fontSize: 11, color: COLORS.warning, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>⚠ PERFIL INCOMPLETO</div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
            Adicione peso, altura e idade para que a IA crie planos personalizados para você.
          </div>
          <button style={{ ...styles.btn, padding: "10px", fontSize: 12, background: COLORS.warning, color: "#000" }} onClick={() => onNav("profile")}>
            COMPLETAR PERFIL
          </button>
        </div>
      )}

      {/* Acesso rápido */}
      <div style={styles.sectionTitle}>Acesso Rápido</div>
      <div style={{ display: "flex", gap: 10, padding: "0 16px" }}>
        {[
          { icon: "🗓", label: "Minha Rotina", screen: "record" },
          { icon: "🥗", label: "Nutrição", screen: "nutrition" },
          { icon: "📊", label: "Progresso", screen: "progress" },
        ].map(item => (
          <button
            key={item.screen}
            onClick={() => onNav(item.screen)}
            style={{
              flex: 1,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "16px 8px",
              cursor: "pointer",
              color: COLORS.text,
              fontFamily: "inherit",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              transition: "border-color 0.15s",
            }}
          >
            <span style={{ fontSize: 26 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: COLORS.textSecondary }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* CTA gerar plano */}
      <div style={{ ...styles.card, borderColor: COLORS.accent + "55", background: COLORS.accent + "0d", marginTop: 16 }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>✦ IA PERSONALIZADA</div>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>Gere seu plano de treino</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 14 }}>
          Deixe a inteligência artificial montar uma rotina completa com base nos seus objetivos.
        </div>
        <button style={{ ...styles.btn, padding: "10px", fontSize: 12 }} onClick={() => onNav("record")}>
          ⚡ CRIAR MINHA ROTINA
        </button>
      </div>
    </div>
  );
}

function NutritionScreen() {
  const API   = process.env.REACT_APP_API_URL;
  const token = () => localStorage.getItem("accessToken");
 
  // ─── Estado ──────────────────────────────────────────────────────────────
  const [meals, setMeals]         = useState([]);
  const [hydration, setHydration] = useState({ entries: [], totalL: 0 });
  const [loading, setLoading]     = useState(true);
  const [pageError, setPageError] = useState("");
 
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealForm, setMealForm]       = useState({ name: "", kcal: "", protein: "", carbs: "", fats: "", logged_at: "" });
  const [mealErr, setMealErr]         = useState("");
  const [savingMeal, setSavingMeal]   = useState(false);
  const [deletingId, setDeletingId]   = useState(null);
 
  const waterGoal = 3.0;
  const goalKcal  = 2000;
 
  // Data local do dispositivo no formato YYYY-MM-DD (para filtro correto por fuso)
  const today = new Date().toLocaleDateString("en-CA"); // "2026-06-14"
 
  // ─── Totais calculados a partir das refeições carregadas do banco ─────────
  const totalKcal    = meals.reduce((s, m) => s + (Number(m.kcal)    || 0), 0);
  const totalProtein = meals.reduce((s, m) => s + (Number(m.protein) || 0), 0);
  const totalCarbs   = meals.reduce((s, m) => s + (Number(m.carbs)   || 0), 0);
  const totalFats    = meals.reduce((s, m) => s + (Number(m.fats)    || 0), 0);
  const water        = hydration.totalL;
 
  const macros = [
    { name: "Proteína", cur: totalProtein, goal: 150, color: COLORS.accent },
    { name: "Carbos",   cur: totalCarbs,   goal: 250, color: COLORS.info   },
    { name: "Gorduras", cur: totalFats,    goal: 65,  color: COLORS.warning },
  ];
 
  // ─── Carregamento inicial dos dados do Supabase via API ──────────────────
  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
 
  async function loadData() {
    setLoading(true);
    setPageError("");
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const [mealsRes, hydRes] = await Promise.all([
        fetch(`${API}/nutrition/meals?date=${today}`, { headers }),
        fetch(`${API}/nutrition/hydration?date=${today}`, { headers }),
      ]);
 
      if (mealsRes.ok) {
        const data = await mealsRes.json();
        setMeals(data.meals || []);
      } else {
        let msg = "Erro ao carregar refeições.";
        try { const e = await mealsRes.json(); msg = e.error || msg; } catch (_) {}
        setPageError(msg);
      }
 
      if (hydRes.ok) {
        const data = await hydRes.json();
        setHydration({ entries: data.entries || [], totalL: Number(data.totalL) || 0 });
      } else {
        // Mostra o erro real para facilitar diagnóstico
        let msg = `Erro ${hydRes.status} ao carregar hidratação.`;
        try { const e = await hydRes.json(); msg = e.error || msg; } catch (_) {}
        setPageError(prev => prev ? `${prev} | ${msg}` : msg);
      }
    } catch (e) {
      setPageError("Não foi possível conectar ao servidor. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }
 
  // ─── Adicionar refeição → POST /nutrition/meals ───────────────────────────
  async function handleAddMeal() {
    const { name, kcal, protein, carbs, fats, logged_at } = mealForm;
 
    if (!name.trim()) { setMealErr("Informe o nome da refeição."); return; }
    if (!kcal || isNaN(kcal) || parseInt(kcal) <= 0) { setMealErr("Informe um valor de calorias válido."); return; }
 
    setSavingMeal(true);
    setMealErr("");
    try {
      const res = await fetch(`${API}/nutrition/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          name:      name.trim(),
          kcal:      parseInt(kcal),
          protein:   parseFloat(protein) || 0,
          carbs:     parseFloat(carbs)   || 0,
          fats:      parseFloat(fats)    || 0,
          logged_at: logged_at || new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setMealErr(data.error || "Erro ao salvar refeição."); return; }
 
      // Adiciona a refeição retornada pelo servidor (com id real do banco)
      setMeals(prev => [...prev, data.meal]);
      setMealForm({ name: "", kcal: "", protein: "", carbs: "", fats: "", logged_at: "" });
      setShowAddMeal(false);
    } catch (e) {
      setMealErr("Erro de conexão. Tente novamente.");
    } finally {
      setSavingMeal(false);
    }
  }
 
  // ─── Remover refeição → DELETE /nutrition/meals/:id ───────────────────────
  async function handleDeleteMeal(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/nutrition/meals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        setMeals(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      // falha silenciosa — a UI não muda e o usuário pode tentar novamente
    } finally {
      setDeletingId(null);
    }
  }
 
  // ─── Registrar água → POST /nutrition/hydration ───────────────────────────
  async function handleAddWater(amount_ml) {
    try {
      const res = await fetch(`${API}/nutrition/hydration`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ amount_ml }),
      });
      const data = await res.json();
      if (res.ok) {
        setHydration(prev => ({
          entries: [...prev.entries, data.entry],
          totalL:  +(prev.totalL + amount_ml / 1000).toFixed(2),
        }));
      } else {
        // Erro visível: mostra no banner de erro da tela
        setPageError(data.error || "Erro ao registrar hidratação. Verifique a conexão.");
      }
    } catch (e) {
      setPageError("Não foi possível registrar a hidratação. Verifique sua conexão.");
    }
  }
 
  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...styles.screen, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>Carregando dados de nutrição…</div>
      </div>
    );
  }
 
  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>RESUMO DO DIA</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {totalKcal > 0
            ? <><span style={{ fontSize: 36, fontWeight: 900, color: COLORS.accent }}>{totalKcal.toLocaleString()}</span><span style={{ fontSize: 14, color: COLORS.textMuted }}>kcal hoje</span></>
            : <><span style={{ fontSize: 36, fontWeight: 900, color: COLORS.textMuted }}>—</span><span style={{ fontSize: 14, color: COLORS.textMuted }}>sem dados ainda</span></>
          }
        </div>
      </div>
 
      {/* Erro de carregamento */}
      {pageError && (
        <div style={{ margin: "12px 20px 0", padding: "10px 14px", background: COLORS.danger + "22", border: `1px solid ${COLORS.danger}44`, borderRadius: 8, fontSize: 13, color: COLORS.danger }}>
          ⚠ {pageError}{" "}
          <span onClick={loadData} style={{ cursor: "pointer", textDecoration: "underline", marginLeft: 6 }}>Tentar novamente</span>
        </div>
      )}
 
      {/* Balanço Calórico */}
      <div style={styles.card}>
        <div style={styles.label}>Balanço Calórico</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: totalKcal > 0 ? COLORS.accent : COLORS.textMuted }}>
          {totalKcal.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 400, color: COLORS.textMuted }}>/ {goalKcal.toLocaleString()} kcal</span>
        </div>
        {totalKcal > 0
          ? <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{Math.max(0, goalKcal - totalKcal).toLocaleString()} kcal restantes</div>
          : <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Defina sua meta calórica no perfil para ativar o balanço.</div>
        }
        <ProgressBar value={totalKcal} max={goalKcal} />
      </div>
 
      {/* Macronutrientes — calculados automaticamente das refeições salvas */}
      <div style={styles.card}>
        <div style={styles.label}>Macronutrientes</div>
        {macros.map(m => (
          <div key={m.name} style={{ marginTop: 10 }}>
            <div style={styles.row}>
              <span style={{ fontSize: 13 }}>{m.name}</span>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>{m.cur.toFixed(1)}g / {m.goal}g</span>
            </div>
            <ProgressBar value={m.cur} max={m.goal} color={m.color} />
          </div>
        ))}
        {totalProtein === 0 && totalCarbs === 0 && totalFats === 0 && (
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 12 }}>
            Informe proteínas, carbos e gorduras ao registrar refeições para acompanhar aqui.
          </div>
        )}
      </div>
 
      {/* Hidratação — persiste no banco via API */}
      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div>
            <div style={styles.label}>Hidratação Diária</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: water > 0 ? COLORS.info : COLORS.textMuted }}>
              {water.toFixed(1)}L / {waterGoal}L
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>
              {water === 0
                ? "Registre seu primeiro copo!"
                : water >= waterGoal
                  ? "Meta atingida! 🎉"
                  : `Faltam ${(waterGoal - water).toFixed(1)}L`}
            </div>
          </div>
          <CircleProgress value={water} max={waterGoal} size={70} color={water > 0 ? COLORS.info : COLORS.textMuted} />
        </div>
        <ProgressBar value={water} max={waterGoal} color={COLORS.info} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {[["Copo 200ml", 200], ["Garrafa 500ml", 500], ["Garrafa 1L", 1000]].map(([lbl, ml]) => (
            <button key={lbl} onClick={() => handleAddWater(ml)}
              style={{ background: COLORS.surface3, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: COLORS.text, cursor: "pointer", fontFamily: "inherit", flex: 1 }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>
 
      {/* Registro de Refeições — persiste no banco via API */}
      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div style={styles.label}>Registro de Refeições</div>
          {meals.length > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent }}>{totalKcal.toLocaleString()} kcal</span>
          )}
        </div>
 
        {meals.length === 0 ? (
          <EmptyState
            icon="🍽"
            title="Nenhuma refeição registrada"
            subtitle="Adicione o que você comeu hoje para calcular calorias e macros."
          />
        ) : (
          meals.map((item) => (
            <div key={item.id} style={{ ...styles.row, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                {(Number(item.protein) > 0 || Number(item.carbs) > 0 || Number(item.fats) > 0) && (
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                    P: {Number(item.protein || 0).toFixed(1)}g · C: {Number(item.carbs || 0).toFixed(1)}g · G: {Number(item.fats || 0).toFixed(1)}g
                  </div>
                )}
                {item.logged_at && (
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>
                    {new Date(item.logged_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, paddingLeft: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>{item.kcal} kcal</span>
                <span
                  onClick={() => deletingId !== item.id && handleDeleteMeal(item.id)}
                  style={{ fontSize: 16, color: COLORS.textMuted, cursor: deletingId === item.id ? "default" : "pointer", lineHeight: 1, opacity: deletingId === item.id ? 0.3 : 1 }}>
                  {deletingId === item.id ? "…" : "✕"}
                </span>
              </div>
            </div>
          ))
        )}
 
        {showAddMeal ? (
          <div style={{ marginTop: 14, background: COLORS.surface2, borderRadius: 10, padding: "14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: COLORS.accent, textTransform: "uppercase", marginBottom: 12 }}>Nova Refeição</div>
 
            <label style={styles.inputLabel}>Nome da refeição *</label>
            <input
              style={{ ...styles.input, borderColor: mealErr && !mealForm.name.trim() ? COLORS.danger : COLORS.border }}
              placeholder="Ex: Frango grelhado com arroz"
              value={mealForm.name}
              onChange={e => { setMealForm(f => ({ ...f, name: e.target.value })); setMealErr(""); }}
            />
 
            <label style={styles.inputLabel}>Calorias (kcal) *</label>
            <input
              style={{ ...styles.input, borderColor: mealErr && (!mealForm.kcal || isNaN(mealForm.kcal)) ? COLORS.danger : COLORS.border }}
              placeholder="Ex: 450"
              value={mealForm.kcal}
              onChange={e => { setMealForm(f => ({ ...f, kcal: e.target.value.replace(/\D/g, "") })); setMealErr(""); }}
              type="text"
              inputMode="numeric"
            />
 
            {/* Macronutrientes */}
            <div style={{ display: "flex", gap: 8, marginBottom: 0 }}>
              <div style={{ flex: 1 }}>
                <label style={styles.inputLabel}>Proteína (g)</label>
                <input
                  style={styles.input}
                  placeholder="0"
                  value={mealForm.protein}
                  onChange={e => setMealForm(f => ({ ...f, protein: e.target.value.replace(/[^0-9.]/g, "") }))}
                  type="text"
                  inputMode="decimal"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.inputLabel}>Carbos (g)</label>
                <input
                  style={styles.input}
                  placeholder="0"
                  value={mealForm.carbs}
                  onChange={e => setMealForm(f => ({ ...f, carbs: e.target.value.replace(/[^0-9.]/g, "") }))}
                  type="text"
                  inputMode="decimal"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.inputLabel}>Gorduras (g)</label>
                <input
                  style={styles.input}
                  placeholder="0"
                  value={mealForm.fats}
                  onChange={e => setMealForm(f => ({ ...f, fats: e.target.value.replace(/[^0-9.]/g, "") }))}
                  type="text"
                  inputMode="decimal"
                />
              </div>
            </div>
 
            {/* Horário */}
            <label style={styles.inputLabel}>Horário (opcional)</label>
            <input
              style={styles.input}
              type="time"
              value={mealForm.logged_at
                ? new Date(mealForm.logged_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false })
                : ""}
              onChange={e => {
                if (e.target.value) {
                  const [h, min] = e.target.value.split(":");
                  const d = new Date();
                  d.setHours(parseInt(h, 10), parseInt(min, 10), 0, 0);
                  setMealForm(f => ({ ...f, logged_at: d.toISOString() }));
                } else {
                  setMealForm(f => ({ ...f, logged_at: "" }));
                }
              }}
            />
 
            {mealErr && (
              <div style={{ fontSize: 12, color: COLORS.danger, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                ⚠ {mealErr}
              </div>
            )}
 
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{ ...styles.btn, flex: 1, padding: "11px", fontSize: 12, opacity: savingMeal ? 0.6 : 1 }}
                onClick={handleAddMeal}
                disabled={savingMeal}>
                {savingMeal ? "SALVANDO…" : "ADICIONAR"}
              </button>
              <button
                style={{ ...styles.btnOutline, flex: 1, padding: "11px", fontSize: 12 }}
                onClick={() => { setShowAddMeal(false); setMealForm({ name: "", kcal: "", protein: "", carbs: "", fats: "", logged_at: "" }); setMealErr(""); }}>
                CANCELAR
              </button>
            </div>
          </div>
        ) : (
          <button style={{ ...styles.btnOutline, marginTop: 12, padding: "10px", fontSize: 12 }} onClick={() => setShowAddMeal(true)}>+ Adicionar Refeição</button>
        )}
      </div>
    </div>
  );
}
 

function RecordScreen() {
  const [tab, setTab] = useState("gerar");
  const [goal, setGoal] = useState("Perda de Gordura");
  const [freq, setFreq] = useState("3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [loadingRoutines, setLoadingRoutines] = useState(false);
  const [expandedRoutine, setExpandedRoutine] = useState(null);
  const [expandedRoutineDay, setExpandedRoutineDay] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [completeModal, setCompleteModal] = useState(null);
  const [logKcal, setLogKcal] = useState("");
  const [loggingWorkout, setLoggingWorkout] = useState(false);
  const [logSuccess, setLogSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState(null);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [replacingEx, setReplacingEx] = useState(null);
  const [replaceTab, setReplaceTab] = useState("banco");
  const [customExForm, setCustomExForm] = useState({ name: "", sets: "3", reps: "12", description: "" });

  const goals = ["Perda de Gordura", "Musculação"];
  const freqs = ["3", "4", "5", "6"];

  const token = () => localStorage.getItem("accessToken");
  const API = process.env.REACT_APP_API_URL;

  async function handleGenerate() {
    setError("");
    setPlan(null);
    setSaveSuccess(false);
    setLoading(true);
    try {
      const res = await fetch(`${API}/ai/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ goal, frequency: parseInt(freq, 10) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erro ao gerar plano."); return; }
      setPlan(data.plan);
      setEditedPlan(JSON.parse(JSON.stringify(data.plan)));
      setAvailableExercises(data.available_exercises || []);
      setEditMode(false);
      setExpandedDay(0);
    } catch (e) {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  function updateExerciseField(dayIdx, exIdx, field, value) {
    setEditedPlan(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.days[dayIdx].exercises[exIdx][field] = value;
      return next;
    });
  }

  function replaceExercise(dayIdx, exIdx, newExName) {
    const found = availableExercises.find(e => e.name === newExName);
    if (!found) return;
    setEditedPlan(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const old = next.days[dayIdx].exercises[exIdx];
      next.days[dayIdx].exercises[exIdx] = {
        ...old,
        name: found.name,
        description: found.description,
      };
      return next;
    });
    setReplacingEx(null);
    setReplaceTab("banco");
  }

  function replaceWithCustom(dayIdx, exIdx) {
    const { name, sets, reps, description } = customExForm;
    if (!name.trim()) return;
    setEditedPlan(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.days[dayIdx].exercises[exIdx] = {
        name: name.trim(),
        sets: sets || "3",
        reps: reps || "12",
        description: description.trim(),
      };
      return next;
    });
    setReplacingEx(null);
    setReplaceTab("banco");
    setCustomExForm({ name: "", sets: "3", reps: "12", description: "" });
  }

  function removeExercise(dayIdx, exIdx) {
    setEditedPlan(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.days[dayIdx].exercises.splice(exIdx, 1);
      return next;
    });
  }

  function addExercise(dayIdx) {
    setEditedPlan(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.days[dayIdx].exercises.push({ name: "Novo Exercício", sets: 3, reps: "12", description: "" });
      return next;
    });
  }

  function updatePlanName(value) {
    setEditedPlan(prev => ({ ...prev, plan_name: value }));
  }

  function updateDayFocus(dayIdx, value) {
    setEditedPlan(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.days[dayIdx].focus = value;
      return next;
    });
  }

  const activePlan = editMode ? editedPlan : plan;

  async function handleSaveRoutine() {
    if (!activePlan) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/routine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({
          plan_name: activePlan.plan_name || "Minha Rotina IA",
          goal: activePlan.goal,
          frequency: activePlan.frequency,
          weekly_kcal_estimate: Number(activePlan.weekly_kcal_estimate) || 0,
          days: activePlan.days || [],
          ai_tip: activePlan.ai_tip || "",
          plan_data: activePlan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao salvar rotina.");
        return;
      }
      if (editMode) setPlan(JSON.parse(JSON.stringify(editedPlan)));
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setError("Não foi possível salvar a rotina.");
    } finally {
      setSaving(false);
    }
  }

  async function loadSavedRoutines() {
    setLoadingRoutines(true);
    try {
      const res = await fetch(`${API}/routine`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (res.ok) setSavedRoutines(data.routines || []);
    } catch (e) {}
    finally {
      setLoadingRoutines(false);
    }
  }

  async function handleDeleteRoutine(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/routine/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        setSavedRoutines(prev => prev.filter(r => r.id !== id));
        if (expandedRoutine === id) setExpandedRoutine(null);
      }
    } catch (e) {}
    finally { setDeletingId(null); }
  }

  async function handleLogWorkout() {
    if (!completeModal) return;
    setLoggingWorkout(true);
    try {
      const res = await fetch(`${API}/workout-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          routine_id:   completeModal.routineId,
          day_name:     completeModal.dayName,
          kcal_burned:  logKcal ? Number(logKcal) : completeModal.kcalEstimate,
          duration_min: completeModal.durationMin,
        }),
      });
      if (res.ok) {
        const dayKey = `${completeModal.routineId}-${completeModal.dayName}`;
        setLogSuccess(dayKey);
        setTimeout(() => setLogSuccess(null), 3000);
      }
    } catch (_) {}
    finally {
      setLoggingWorkout(false);
      setCompleteModal(null);
      setLogKcal("");
    }
  }

  function handleTabChange(t) {
    setTab(t);
    if (t === "salvas") loadSavedRoutines();
  }

  return (
    <div style={styles.screen}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, letterSpacing: 2, marginBottom: 4 }}>✦ ELITE ROUTINE ENGINE</div>
        <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>Desenhe sua<br />Performance.</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 8 }}>Gere planos com IA e salve suas rotinas.</div>
      </div>

      <div style={{ display: "flex", gap: 0, margin: "16px 16px 0", background: COLORS.surface2, borderRadius: 10, padding: 4 }}>
        {[["gerar", "⚡ Gerar Plano"], ["salvas", "🗓 Minhas Rotinas"]].map(([id, lbl]) => (
          <button key={id} onClick={() => handleTabChange(id)} style={{
            flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontFamily: "inherit",
            background: tab === id ? COLORS.accent : "transparent",
            color: tab === id ? "#000" : COLORS.textMuted,
            fontWeight: 800, fontSize: 12, cursor: "pointer", letterSpacing: 1, transition: "all 0.15s",
          }}>{lbl}</button>
        ))}
      </div>

      {tab === "gerar" && (
        <>
          <div style={styles.card}>
            <div style={styles.label}>Objetivo Primário</div>
            {goals.map(g => (
              <div key={g} onClick={() => setGoal(g)} style={{
                ...styles.row, padding: "13px 14px", borderRadius: 8, marginTop: 8, cursor: "pointer",
                background: goal === g ? COLORS.accent + "22" : COLORS.surface2,
                border: `1.5px solid ${goal === g ? COLORS.accent : COLORS.border}`,
              }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: goal === g ? COLORS.accent : COLORS.text }}>{g}</span>
                {goal === g && <span style={{ color: COLORS.accent, fontSize: 18 }}>✓</span>}
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={styles.label}>Frequência Semanal (dias)</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {freqs.map(f => (
                <button key={f} onClick={() => setFreq(f)} style={{
                  flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${freq === f ? COLORS.accent : COLORS.border}`,
                  background: freq === f ? COLORS.accent : COLORS.surface2, color: freq === f ? "#000" : COLORS.textSecondary,
                  fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: 1, fontFamily: "inherit",
                }}>{f}x</button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ ...styles.card, borderColor: COLORS.danger + "55", background: COLORS.danger + "11" }}>
              <div style={{ fontSize: 13, color: COLORS.danger }}>⚠ {error}</div>
            </div>
          )}

          <div style={{ padding: "0 16px" }}>
            <button
              style={{ ...styles.btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #00000044", borderTop: "2px solid #000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  GERANDO SEU PLANO...
                </>
              ) : "⚡ GERAR PLANO IA"}
            </button>
          </div>

          {activePlan && (
            <>
              <div style={{ ...styles.card, borderColor: COLORS.accent + "55", background: COLORS.accent + "08" }}>
                <div style={{ ...styles.row, marginBottom: 10 }}>
                  <div style={{ flex: 1, marginRight: 8 }}>
                    {editMode ? (
                      <input
                        style={{ ...styles.input, fontSize: 16, fontWeight: 900, color: COLORS.accent, marginBottom: 4, padding: "6px 10px" }}
                        value={editedPlan.plan_name}
                        onChange={e => updatePlanName(e.target.value)}
                      />
                    ) : (
                      <div style={{ fontSize: 17, fontWeight: 900, color: COLORS.accent }}>{activePlan.plan_name}</div>
                    )}
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{activePlan.goal} · {activePlan.frequency}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ ...styles.badge(COLORS.accent), fontSize: 10 }}>IA</span>
                    <button
                      onClick={() => { setEditMode(e => !e); setReplacingEx(null); setEditingCell(null); }}
                      style={{ background: editMode ? COLORS.warning + "22" : COLORS.surface3, border: `1.5px solid ${editMode ? COLORS.warning : COLORS.border}`, color: editMode ? COLORS.warning : COLORS.textSecondary, borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}
                    >
                      {editMode ? "✕ CANCELAR" : "✏ EDITAR"}
                    </button>
                  </div>
                </div>

                {editMode && (
                  <div style={{ background: COLORS.warning + "11", border: `1px solid ${COLORS.warning}33`, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: COLORS.warning, fontWeight: 700, letterSpacing: 1 }}>✏ MODO EDIÇÃO ATIVO</div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 3, lineHeight: 1.5 }}>Edite séries, reps, substitua ou remova exercícios. Salve para confirmar.</div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    [activePlan.days?.length || 0, "TREINOS"],
                    [activePlan.weekly_kcal_estimate?.toLocaleString() || "—", "KCAL/SEM"],
                    [activePlan.days?.reduce((s, d) => s + (d.duration_min || 0), 0) || "—", "MIN/SEM"],
                  ].map(([v, l]) => (
                    <div key={l} style={{ background: COLORS.surface2, borderRadius: 8, padding: "8px 14px", flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.accent }}>{v}</div>
                      <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 }}>{l}</div>
                    </div>
                  ))}
                </div>
                {activePlan.ai_tip && (
                  <div style={{ background: COLORS.surface3, borderRadius: 8, padding: 12, marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>✦ DICA DA IA</div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>{activePlan.ai_tip}</div>
                  </div>
                )}
              </div>

              {activePlan.days?.map((day, idx) => (
                <div key={idx} style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
                  <div
                    onClick={() => !editMode && setExpandedDay(expandedDay === idx ? null : idx)}
                    style={{ ...styles.row, padding: "14px 16px", cursor: editMode ? "default" : "pointer" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{day.day}</div>
                      {editMode ? (
                        <input
                          style={{ ...styles.input, fontSize: 12, color: COLORS.textMuted, marginTop: 4, marginBottom: 0, padding: "4px 8px", width: "100%" }}
                          value={day.focus}
                          onChange={e => updateDayFocus(idx, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          placeholder="Foco do treino"
                        />
                      ) : (
                        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{day.focus}</div>
                      )}
                    </div>
                    {!editMode && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700 }}>⏱ {day.duration_min}min</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>🔥 {day.kcal_estimate} kcal</div>
                        </div>
                        <span style={{ color: COLORS.accent, fontSize: 16, transition: "transform 0.2s", display: "inline-block", transform: expandedDay === idx ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                      </div>
                    )}
                    {editMode && (
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8, whiteSpace: "nowrap" }}>{day.exercises?.length || 0} exerc.</div>
                    )}
                  </div>

                  {(editMode || expandedDay === idx) && (
                    <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: editMode ? "8px 12px" : "12px 16px" }}>
                      {day.exercises.map((ex, j) => (
                        <div key={j} style={{ padding: "10px 0", borderBottom: j < day.exercises.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                          {!editMode && (
                            <>
                              <div style={{ ...styles.row }}>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <span style={{ ...styles.badge(COLORS.accent), fontSize: 10 }}>{ex.sets}x{ex.reps}</span>
                                  {ex.rest_seconds && <span style={{ ...styles.badge(COLORS.info), fontSize: 10 }}>⏸{ex.rest_seconds}s</span>}
                                </div>
                              </div>
                              {ex.description && <p style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 1.4 }}>{ex.description}</p>}
                              {ex.tip && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>💡 {ex.tip}</div>}
                            </>
                          )}

                          {editMode && (
                            <div style={{ background: COLORS.surface2, borderRadius: 8, padding: "10px 12px" }}>
                              {replacingEx && replacingEx.dayIdx === idx && replacingEx.exIdx === j ? (
                                <div>
                                  <div style={{ ...styles.row, marginBottom: 10 }}>
                                    <div style={{ fontSize: 11, color: COLORS.warning, fontWeight: 700, letterSpacing: 1 }}>SUBSTITUIR POR:</div>
                                    <div style={{ display: "flex", gap: 4 }}>
                                      {["banco", "custom"].map(t => (
                                        <button
                                          key={t}
                                          onClick={() => setReplaceTab(t)}
                                          style={{ background: replaceTab === t ? COLORS.accent : COLORS.surface3, border: `1px solid ${replaceTab === t ? COLORS.accent : COLORS.border}`, color: replaceTab === t ? "#fff" : COLORS.textMuted, borderRadius: 5, padding: "3px 9px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}
                                        >
                                          {t === "banco" ? "DO BANCO" : "✦ CRIAR NOVO"}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {replaceTab === "banco" && (
                                    <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                                      {availableExercises.filter(e => e.name !== ex.name).map(e => (
                                        <button
                                          key={e.name}
                                          onClick={() => replaceExercise(idx, j, e.name)}
                                          style={{ background: COLORS.surface3, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "7px 10px", fontSize: 12, color: COLORS.text, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                                        >
                                          <span style={{ fontWeight: 700 }}>{e.name}</span>
                                          <span style={{ color: COLORS.textMuted, fontSize: 11 }}> · {e.category} · {e.difficulty}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {replaceTab === "custom" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                      <div>
                                        <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 3 }}>NOME DO EXERCÍCIO *</div>
                                        <input
                                          style={{ ...styles.input, marginBottom: 0, fontSize: 13, fontWeight: 700 }}
                                          value={customExForm.name}
                                          placeholder="Ex: Remada com elástico"
                                          onChange={e => setCustomExForm(f => ({ ...f, name: e.target.value }))}
                                        />
                                      </div>
                                      <div style={{ display: "flex", gap: 8 }}>
                                        <div style={{ flex: 1 }}>
                                          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 3 }}>SÉRIES</div>
                                          <input
                                            style={{ ...styles.input, marginBottom: 0, textAlign: "center", fontSize: 14, fontWeight: 700 }}
                                            value={customExForm.sets}
                                            inputMode="numeric"
                                            onChange={e => setCustomExForm(f => ({ ...f, sets: e.target.value.replace(/\D/g, "") }))}
                                          />
                                        </div>
                                        <div style={{ flex: 2 }}>
                                          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 3 }}>REPETIÇÕES</div>
                                          <input
                                            style={{ ...styles.input, marginBottom: 0, textAlign: "center", fontSize: 14, fontWeight: 700 }}
                                            value={customExForm.reps}
                                            placeholder="Ex: 12 ou 8-12"
                                            onChange={e => setCustomExForm(f => ({ ...f, reps: e.target.value }))}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 3 }}>DESCRIÇÃO</div>
                                        <textarea
                                          style={{ ...styles.input, marginBottom: 0, resize: "none", minHeight: 60, fontSize: 12, lineHeight: 1.5 }}
                                          value={customExForm.description}
                                          placeholder="Como executar o exercício..."
                                          onChange={e => setCustomExForm(f => ({ ...f, description: e.target.value }))}
                                        />
                                      </div>
                                      <button
                                        onClick={() => replaceWithCustom(idx, j)}
                                        disabled={!customExForm.name.trim()}
                                        style={{ ...styles.btn, padding: "10px", fontSize: 12, opacity: customExForm.name.trim() ? 1 : 0.4 }}
                                      >
                                        ✓ USAR ESTE EXERCÍCIO
                                      </button>
                                    </div>
                                  )}

                                  <button
                                    onClick={() => { setReplacingEx(null); setReplaceTab("banco"); }}
                                    style={{ marginTop: 10, background: "none", border: "none", color: COLORS.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                                  >✕ Cancelar</button>
                                </div>
                              ) : (
                                <>
                                  <div style={{ ...styles.row, marginBottom: 8 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, flex: 1, color: COLORS.accent }}>{ex.name}</div>
                                    <div style={{ display: "flex", gap: 6 }}>
                                      <button
                                        onClick={() => setReplacingEx({ dayIdx: idx, exIdx: j })}
                                        style={{ background: COLORS.info + "22", border: `1px solid ${COLORS.info}44`, color: COLORS.info, borderRadius: 5, padding: "3px 8px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}
                                      >⇄ TROCAR</button>
                                      <button
                                        onClick={() => removeExercise(idx, j)}
                                        style={{ background: COLORS.danger + "22", border: `1px solid ${COLORS.danger}44`, color: COLORS.danger, borderRadius: 5, padding: "3px 8px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                                      >✕</button>
                                    </div>
                                  </div>

                                  <div style={{ display: "flex", gap: 8 }}>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 3 }}>SÉRIES</div>
                                      <input
                                        style={{ ...styles.input, padding: "7px 10px", fontSize: 14, fontWeight: 700, textAlign: "center", marginBottom: 0 }}
                                        value={ex.sets}
                                        type="text"
                                        inputMode="numeric"
                                        onChange={e => updateExerciseField(idx, j, "sets", e.target.value.replace(/\D/g, ""))}
                                      />
                                    </div>
                                    <div style={{ flex: 2 }}>
                                      <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 3 }}>REPETIÇÕES</div>
                                      <input
                                        style={{ ...styles.input, padding: "7px 10px", fontSize: 14, fontWeight: 700, textAlign: "center", marginBottom: 0 }}
                                        value={ex.reps}
                                        onChange={e => updateExerciseField(idx, j, "reps", e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  <div style={{ marginTop: 8 }}>
                                    <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 3 }}>DESCRIÇÃO</div>
                                    <textarea
                                      style={{ ...styles.input, marginBottom: 0, resize: "none", minHeight: 70, fontSize: 12, lineHeight: 1.5 }}
                                      value={ex.description || ""}
                                      placeholder="Descreva como executar o exercício..."
                                      onChange={e => updateExerciseField(idx, j, "description", e.target.value)}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      {editMode && (
                        <button
                          onClick={() => addExercise(idx)}
                          style={{ ...styles.btnOutline, marginTop: 10, padding: "8px", fontSize: 11, letterSpacing: 1 }}
                        >+ ADICIONAR EXERCÍCIO</button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {saveSuccess ? (
                  <div style={{ ...styles.btn, background: "#4caf50", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "default" }}>
                    ✓ ROTINA SALVA COM SUCESSO!
                  </div>
                ) : (
                  <button
                    style={{ ...styles.btn, background: COLORS.accentDark, opacity: saving ? 0.7 : 1 }}
                    onClick={handleSaveRoutine}
                    disabled={saving}
                  >
                    {saving ? "SALVANDO..." : editMode ? "💾 SALVAR EDIÇÕES E ROTINA" : "💾 SALVAR ESTA ROTINA"}
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}

      {tab === "salvas" && (
        <>
          {loadingRoutines ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textMuted }}>
              <div style={{ fontSize: 13, letterSpacing: 1 }}>Carregando rotinas...</div>
            </div>
          ) : savedRoutines.length === 0 ? (
            <div style={styles.card}>
              <EmptyState
                icon="🗓"
                title="Nenhuma rotina salva"
                subtitle="Gere um plano com IA e salve sua rotina para visualizá-la aqui."
                btnLabel="⚡ GERAR PLANO"
                onBtn={() => handleTabChange("gerar")}
              />
            </div>
          ) : (
            savedRoutines.map(routine => {
              const planData = routine.plan_data;
              const isExpanded = expandedRoutine === routine.id;
              const createdAt = new Date(routine.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

              return (
                <div key={routine.id} style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
                  <div style={{ ...styles.row, padding: "14px 16px", cursor: "pointer" }} onClick={() => { setExpandedRoutine(isExpanded ? null : routine.id); setExpandedRoutineDay(null); }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{routine.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                        {routine.goal} · {routine.frequency} · {createdAt}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteRoutine(routine.id); }}
                        disabled={deletingId === routine.id}
                        style={{ background: "none", border: "none", color: deletingId === routine.id ? COLORS.textMuted : COLORS.danger, cursor: "pointer", fontSize: 15, padding: "2px 6px", borderRadius: 6 }}
                      >
                        {deletingId === routine.id ? "..." : "🗑"}
                      </button>
                      <span style={{ color: COLORS.accent, fontSize: 16, transition: "transform 0.2s", display: "inline-block", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      {planData && (
                        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${COLORS.border}` }}>
                          {[
                            [planData.days?.length || 0, "TREINOS"],
                            [planData.weekly_kcal_estimate?.toLocaleString() || "—", "KCAL/SEM"],
                            [planData.days?.reduce((s, d) => s + (d.duration_min || 0), 0) || "—", "MIN/SEM"],
                          ].map(([v, l], i) => (
                            <div key={l} style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRight: i < 2 ? `1px solid ${COLORS.border}` : "none" }}>
                              <div style={{ fontSize: 15, fontWeight: 900, color: COLORS.accent }}>{v}</div>
                              <div style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 1 }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {planData?.days ? (
                        planData.days.map((day, idx) => (
                          <div key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                            <div
                              onClick={() => setExpandedRoutineDay(expandedRoutineDay === `${routine.id}-${idx}` ? null : `${routine.id}-${idx}`)}
                              style={{ ...styles.row, padding: "12px 16px", cursor: "pointer" }}
                            >
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{day.day}</div>
                                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{day.focus}</div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 11, color: COLORS.accent }}>⏱{day.duration_min}min</span>
                                <span style={{ color: COLORS.accent, fontSize: 14, transition: "transform 0.2s", display: "inline-block", transform: expandedRoutineDay === `${routine.id}-${idx}` ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                              </div>
                            </div>

                            {expandedRoutineDay === `${routine.id}-${idx}` && (
                              <div style={{ padding: "0 16px 12px" }}>
                                {day.exercises.map((ex, j) => (
                                  <div key={j} style={{ padding: "8px 0", borderBottom: j < day.exercises.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                                    <div style={{ ...styles.row }}>
                                      <div style={{ fontSize: 13, fontWeight: 700 }}>{ex.name}</div>
                                      <span style={{ ...styles.badge(COLORS.accent), fontSize: 10 }}>{ex.sets}x{ex.reps}</span>
                                    </div>
                                    {ex.description && (
                                      <p style={{ fontSize: "12px", color: COLORS.textSecondary, marginTop: "4px", marginBottom: 0, lineHeight: "1.4" }}>
                                        {ex.description}
                                      </p>
                                    )}
                                    {ex.tip && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3 }}>💡 {ex.tip}</div>}
                                  </div>
                                ))}

                                {logSuccess === `${routine.id}-${day.day}` ? (
                                  <div style={{ marginTop: 12, background: "#4caf5022", border: "1px solid #4caf5055", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#4caf50", textAlign: "center" }}>
                                    ✓ Treino registrado!
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setCompleteModal({ routineId: routine.id, dayName: day.day, kcalEstimate: day.kcal_estimate, durationMin: day.duration_min }); setLogKcal(String(day.kcal_estimate || "")); }}
                                    style={{ marginTop: 12, width: "100%", background: COLORS.accent + "18", border: `1.5px solid ${COLORS.accent}55`, color: COLORS.accent, borderRadius: 8, padding: "10px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}
                                  >
                                    ✓ CONCLUIR TREINO
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        routine.routine_exercises?.length > 0 && (
                          <div style={{ padding: "12px 16px" }}>
                            {routine.routine_exercises.map((ex, j) => (
                              <div key={j} style={{ ...styles.row, padding: "8px 0", borderBottom: j < routine.routine_exercises.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>{ex.name}</div>
                                <span style={{ ...styles.badge(COLORS.accent), fontSize: 10 }}>{ex.sets}x{ex.reps}</span>
                              </div>
                            ))}
                          </div>
                        )
                      )}

                      {planData?.ai_tip && (
                        <div style={{ margin: "0 16px 14px", background: COLORS.surface3, borderRadius: 8, padding: 12 }}>
                          <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>✦ DICA DA IA</div>
                          <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>{planData.ai_tip}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {completeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={() => { setCompleteModal(null); setLogKcal(""); }}>
          <div style={{ background: COLORS.surface, borderRadius: "16px 16px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}
            onClick={e => e.stopPropagation()}>

            <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>CONCLUIR TREINO</div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{completeModal.dayName}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>
              Estimativa: {completeModal.kcalEstimate} kcal · {completeModal.durationMin} min
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 6 }}>CALORIAS GASTAS (kcal)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  style={{ ...styles.input, flex: 1, marginBottom: 0, fontSize: 22, fontWeight: 900, textAlign: "center" }}
                  value={logKcal}
                  type="text"
                  inputMode="numeric"
                  placeholder={String(completeModal.kcalEstimate || "0")}
                  onChange={e => setLogKcal(e.target.value.replace(/\D/g, ""))}
                />
                <button
                  onClick={() => setLogKcal(String(completeModal.kcalEstimate || ""))}
                  style={{ background: COLORS.surface3, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, borderRadius: 8, padding: "10px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
                >
                  Usar estimativa
                </button>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>Deixe vazio para usar a estimativa da IA.</div>
            </div>

            <button
              onClick={handleLogWorkout}
              disabled={loggingWorkout}
              style={{ ...styles.btn, opacity: loggingWorkout ? 0.7 : 1 }}
            >
              {loggingWorkout ? "REGISTRANDO..." : "CONFIRMAR TREINO CONCLUIDO"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressScreen() {
  const DAY_LABELS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  const API   = process.env.REACT_APP_API_URL;
  const token = () => localStorage.getItem("accessToken");

  const [stats, setStats]       = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentLogs, setRecentLogs]     = useState([]);

  async function fetchStats() {
    setLoadingStats(true);
    try {
      const [sRes, lRes] = await Promise.all([
        fetch(`${API}/workout-logs/stats`, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(`${API}/workout-logs`,       { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      const sData = await sRes.json();
      const lData = await lRes.json();
      if (sRes.ok) setStats(sData);
      if (lRes.ok) setRecentLogs((lData.logs || []).slice(0, 5));
    } catch (_) {}
    setLoadingStats(false);
  }

  useEffect(() => { fetchStats(); }, []);

  const weeklyKcal  = stats?.weekly_kcal || Array(7).fill(0);
  const maxKcal     = Math.max(...weeklyKcal, 1);
  const todayDowIdx = (new Date().getDay() + 6) % 7;

  return (
    <div style={styles.screen}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2 }}>📊 PAINEL DE PERFORMANCE</div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>Seu Progresso.</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 6 }}>Acompanhe sua evolução conforme você treina.</div>
      </div>

      <div style={{ display: "flex", gap: 12, padding: "12px 16px 0" }}>
        {[
          [loadingStats ? "—" : stats?.total_workouts ?? 0,  "TREINOS TOTAIS", "realizados"],
          [loadingStats ? "—" : stats?.total_minutes   ?? 0, "MINUTOS ATIVOS", "no total"],
          [loadingStats ? "—" : (stats?.total_kcal ?? 0).toLocaleString(), "KCAL GASTAS", "no total"],
        ].map(([v, l, s]) => (
          <div key={l} style={{ ...styles.card, flex: 1, margin: 0, textAlign: "center" }}>
            <div style={styles.label}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.accent }}>{v}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Score de Consistência <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>(últimos 30 dias)</span></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          {loadingStats ? (
            <span style={{ fontSize: 32, fontWeight: 900, color: COLORS.textMuted }}>—</span>
          ) : (
            <>
              <span style={{ fontSize: 32, fontWeight: 900, color: stats?.consistency_score > 0 ? COLORS.accent : COLORS.textMuted }}>
                {stats?.consistency_score ?? 0}%
              </span>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>
                {stats?.consistency_score >= 80 ? "🔥 Excelente!" : stats?.consistency_score >= 40 ? "💪 Bom ritmo" : "comece hoje!"}
              </span>
            </>
          )}
        </div>
        <ProgressBar value={stats?.consistency_score ?? 0} max={100} />
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 16 }}>
          <div style={styles.label}>Atividade Semanal</div>
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>kcal por dia</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
          {DAY_LABELS.map((d, i) => {
            const h = weeklyKcal[i] > 0 ? Math.max(8, Math.round((weeklyKcal[i] / maxKcal) * 72)) : 8;
            const isToday = i === todayDowIdx;
            const hasData = weeklyKcal[i] > 0;
            return (
              <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {hasData && <div style={{ fontSize: 8, color: COLORS.accent, fontWeight: 700 }}>{weeklyKcal[i]}</div>}
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div style={{ width: "100%", background: hasData ? COLORS.accent : COLORS.surface3, borderRadius: "3px 3px 0 0", height: h, opacity: isToday ? 1 : 0.6, transition: "height 0.4s" }} />
                </div>
                <span style={{ fontSize: 9, color: isToday ? COLORS.accent : COLORS.textMuted, fontWeight: isToday ? 800 : 400, letterSpacing: 0.5 }}>{d}</span>
              </div>
            );
          })}
        </div>
        {!loadingStats && weeklyKcal.every(v => v === 0) && (
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 10, textAlign: "center" }}>
            Conclua treinos para ver seu gráfico aqui.
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div style={styles.label}>Últimos Treinos</div>
          {recentLogs.length > 0 && <span style={{ ...styles.badge(COLORS.accent), fontSize: 10 }}>{recentLogs.length}</span>}
        </div>
        {loadingStats ? (
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>Carregando...</div>
        ) : recentLogs.length === 0 ? (
          <EmptyState icon="🏋️" title="Nenhum treino registrado" subtitle="Conclua um treino nas suas rotinas salvas para ele aparecer aqui." />
        ) : (
          recentLogs.map((log, i) => (
            <div key={log.id} style={{ ...styles.row, padding: "10px 0", borderBottom: i < recentLogs.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{log.day_name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                  {new Date(log.completed_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {log.kcal_burned  && <span style={{ ...styles.badge(COLORS.danger),  fontSize: 10 }}>🔥 {log.kcal_burned} kcal</span>}
                {log.duration_min && <span style={{ ...styles.badge(COLORS.accent), fontSize: 10 }}>⏱ {log.duration_min}min</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EditProfileScreen({ user, onSave, onBack }) {
  const [form, setForm] = useState({
    name: user.name || "",
    idade: user.idade || "",
    peso: user.peso || "",
    altura: user.altura || "",
    objetivo: user.objetivo || "",
  });
  const [saved, setSaved] = useState(false);

  const objetivos = ["Perda de Gordura", "Musculação"];

  async function handleSave() {
    if (!form.name.trim()) return;

    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profiles`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          idade: form.idade,
          peso: form.peso,
          altura: form.altura,
          objetivo: form.objetivo,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erro ao salvar perfil.");
        return;
      }

      onSave(form);
      setSaved(true);
      setTimeout(() => { setSaved(false); onBack(); }, 900);

    } catch (e) {
      alert("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <div style={{ ...styles.screen, paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.accent, fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1 }}>←</button>
        <div style={{ fontSize: 20, fontWeight: 900 }}>Editar Perfil</div>
      </div>

      <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: COLORS.surface2, border: `2px dashed ${COLORS.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: COLORS.accent, position: "relative", cursor: "pointer" }}>
          {form.name ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "📷"}
          <div style={{ position: "absolute", bottom: -4, right: -4, background: COLORS.accent, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#000" }}>📷</div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 8 }}>Toque para alterar a foto</div>
      </div>

      <div style={styles.card}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLORS.accent, textTransform: "uppercase", marginBottom: 14 }}>Informações Pessoais</div>

        <label style={styles.inputLabel}>Nome Completo</label>
        <input style={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Seu nome completo" />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={styles.inputLabel}>Idade</label>
            <input style={styles.input} value={form.idade} onChange={e => setForm({ ...form, idade: e.target.value.replace(/\D/g, "") })} placeholder="anos" type="text" inputMode="numeric" maxLength={3} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.inputLabel}>Peso (kg)</label>
            <input style={styles.input} value={form.peso} onChange={e => setForm({ ...form, peso: e.target.value.replace(/[^\d.]/g, "") })} placeholder="kg" type="text" inputMode="decimal" />
          </div>
        </div>

        <label style={styles.inputLabel}>Altura (cm)</label>
        <input style={styles.input} value={form.altura} onChange={e => setForm({ ...form, altura: e.target.value.replace(/\D/g, "") })} placeholder="cm" type="text" inputMode="numeric" maxLength={3} />
      </div>

      <div style={styles.card}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLORS.accent, textTransform: "uppercase", marginBottom: 14 }}>Objetivo Principal</div>
        {objetivos.map(obj => (
          <div key={obj} onClick={() => setForm({ ...form, objetivo: obj })}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 8, marginBottom: 6, cursor: "pointer", background: form.objetivo === obj ? COLORS.accent + "22" : COLORS.surface2, border: `1.5px solid ${form.objetivo === obj ? COLORS.accent : COLORS.border}` }}>
            <span style={{ fontSize: 14, fontWeight: form.objetivo === obj ? 700 : 400, color: form.objetivo === obj ? COLORS.accent : COLORS.text }}>{obj}</span>
            {form.objetivo === obj && <span style={{ color: COLORS.accent }}>✓</span>}
          </div>
        ))}
      </div>

      {(form.peso || form.altura || form.idade) && (
        <div style={{ ...styles.card, borderColor: COLORS.accent + "44", background: COLORS.accent + "0d" }}>
          <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>RESUMO DO PERFIL</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {form.idade && <div style={{ background: COLORS.surface2, borderRadius: 8, padding: "8px 14px", textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: COLORS.accent }}>{form.idade}</div><div style={{ fontSize: 10, color: COLORS.textMuted }}>ANOS</div></div>}
            {form.peso && <div style={{ background: COLORS.surface2, borderRadius: 8, padding: "8px 14px", textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: COLORS.accent }}>{form.peso}</div><div style={{ fontSize: 10, color: COLORS.textMuted }}>KG</div></div>}
            {form.altura && <div style={{ background: COLORS.surface2, borderRadius: 8, padding: "8px 14px", textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: COLORS.accent }}>{form.altura}</div><div style={{ fontSize: 10, color: COLORS.textMuted }}>CM</div></div>}
            {form.peso && form.altura && (() => { const imc = (parseFloat(form.peso) / Math.pow(parseFloat(form.altura) / 100, 2)).toFixed(1); return !isNaN(imc) && <div style={{ background: COLORS.surface2, borderRadius: 8, padding: "8px 14px", textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: COLORS.accent }}>{imc}</div><div style={{ fontSize: 10, color: COLORS.textMuted }}>IMC</div></div>; })()}
          </div>
        </div>
      )}

      <div style={{ padding: "0 16px 16px" }}>
        <button style={{ ...styles.btn, background: saved ? "#4caf50" : COLORS.accent }} onClick={handleSave}>
          {saved ? "✓ SALVO!" : "SALVAR ALTERAÇÕES"}
        </button>
      </div>
    </div>
  );
}

function ProfileScreen({ onLogout, userName, currentUser, onUpdateUser }) {
  const onNav = (s) => { if (s === "login") onLogout(); };
  const [editing, setEditing] = useState(false);
  const initials = (currentUser?.name || userName || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const profileComplete = currentUser?.idade && currentUser?.peso && currentUser?.altura;

  const API = process.env.REACT_APP_API_URL;
  const token = () => localStorage.getItem("accessToken");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchStats() {
      setLoadingStats(true);
      try {
        const res = await fetch(`${API}/workout-logs/stats`, { headers: { Authorization: `Bearer ${token()}` } });
        const data = await res.json();
        if (active && res.ok) setStats(data);
      } catch (_) {}
      if (active) setLoadingStats(false);
    }
    fetchStats();
    return () => { active = false; };
  }, []);

  if (editing) {
    return <EditProfileScreen user={currentUser || { name: userName }} onSave={(data) => { onUpdateUser(data); setEditing(false); }} onBack={() => setEditing(false)} />;
  }

  return (
    <div style={styles.screen}>
      <div style={{ textAlign: "center", padding: "24px 20px 16px" }}>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: COLORS.surface2, border: `2px dashed ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: COLORS.accent, margin: "0 auto 12px", position: "relative", cursor: "pointer" }}>
          {initials}
          <div style={{ position: "absolute", bottom: -4, right: -4, background: COLORS.accent, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✏</div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{currentUser?.name || userName || "Novo Atleta"}</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>
          {profileComplete ? `${currentUser.peso}kg · ${currentUser.altura}cm · ${currentUser.idade} anos` : "Complete seu perfil para personalizar sua experiência"}
        </div>
      </div>

      {!profileComplete && (
        <div style={{ ...styles.card, borderColor: COLORS.warning + "55", background: COLORS.warning + "0d" }}>
          <div style={{ fontSize: 11, color: COLORS.warning, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>⚠ PERFIL INCOMPLETO</div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
            Adicione seu peso, altura, idade e objetivos para que a IA possa criar planos personalizados para você.
          </div>
          <button onClick={() => setEditing(true)} style={{ ...styles.btn, padding: "10px", fontSize: 12, background: COLORS.warning, color: "#000" }}>COMPLETAR PERFIL</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, padding: "0 16px" }}>
        <div style={{ ...styles.card, flex: 1, margin: 0, textAlign: "center" }}>
          <div style={styles.label}>TREINOS TOTAIS</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.accent }}>
            {loadingStats ? "—" : stats?.total_workouts ?? 0}
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted }}>realizados</div>
        </div>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 2 }}>
        {[["✏ Editar Perfil", "", () => setEditing(true)], ["🚪 Sair", COLORS.danger, () => onNav("login")]].map(([lbl, color, action]) => (
          <div key={lbl} onClick={action || undefined}
            style={{ ...styles.card, margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "14px 16px" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: color || COLORS.text }}>{lbl}</span>
            {!lbl.includes("Sair") && <span style={{ color: COLORS.textMuted }}>›</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);

  const mainScreens = ["home", "nutrition", "record", "progress", "profile"];
  const isMain = mainScreens.includes(screen);

  function handleLogin(user) {
    setCurrentUser(user);
    setScreen("home");
  }

  function handleLogout() {
    setCurrentUser(null);
    setScreen("login");
  }

  function handleUpdateUser(data) {
    setCurrentUser(prev => ({ ...prev, ...data }));
  }

  const navItems = [
    { id: "record", label: "Rotina", icon: "🗓" },
    { id: "nutrition", label: "Nutrição", icon: "🥗" },
    { id: "home", label: "Início", icon: "🏠" },
    { id: "progress", label: "Progresso", icon: "📊" },
    { id: "profile", label: "Perfil", icon: "👤" },
  ];

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 0; }
        input::placeholder { color: #555; }
        input { font-family: 'Barlow Condensed', sans-serif; }
      `}</style>

      {isMain && (
        <div style={styles.header}>
          <div style={styles.logo}>⚡ Vittness</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {currentUser && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.accent + "33", border: `1.5px solid ${COLORS.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: COLORS.accent }}>
                {currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            )}
          </div>
        </div>
      )}

      {screen === "login"    && <LoginScreen onLogin={handleLogin} onNav={setScreen} />}
      {screen === "register" && <RegisterScreen onLogin={handleLogin} onNav={setScreen} />}
      {screen === "home"     && <HomeScreen onNav={setScreen} currentUser={currentUser} />}
      {screen === "nutrition" && <NutritionScreen />}
      {screen === "record"   && <RecordScreen />}
      {screen === "progress" && <ProgressScreen />}
      {screen === "profile"  && <ProfileScreen onLogout={handleLogout} userName={currentUser?.name || ""} currentUser={currentUser} onUpdateUser={handleUpdateUser} />}

      {isMain && (
        <nav style={styles.bottomNav}>
          {navItems.map(nav => (
            <button key={nav.id} onClick={() => setScreen(nav.id)}
              style={{ ...styles.navItem, ...(screen === nav.id ? styles.navItemActive : {}) }}>
              <span style={{ fontSize: 18 }}>{nav.icon}</span>
              {nav.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
