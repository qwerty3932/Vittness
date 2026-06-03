import { useState, useEffect, useRef } from "react";

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
  navCenterBtn: {
    background: COLORS.accent,
    borderRadius: "50%",
    width: 52,
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: "#000",
    border: "none",
    cursor: "pointer",
    marginTop: -20,
    boxShadow: `0 4px 16px ${COLORS.accent}55`,
    fontFamily: "inherit",
  },
  progressBar: (pct, color = COLORS.accent) => ({
    height: 6,
    background: COLORS.surface3,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 8,
    position: "relative",
    "::after": {},
  }),
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
      } else {
        // Login automático
        const loginRes = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.pass }),
        });
        const loginData = await loginRes.json();
        localStorage.setItem("accessToken", loginData.accessToken);
        onLogin(loginData.user);
      }
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

function FeedScreen({ onNav }) {
  return (
    <div style={styles.screen}>
      <div style={{ ...styles.card, background: COLORS.surface }}>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 10 }}>Esta semana</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["0", "KM TOTAL"], ["0min", "TEMPO"], ["0", "ATIVIDADES"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.textMuted }}>{v}</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.card, borderColor: COLORS.accent + "55", background: COLORS.accent + "0d" }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>👋 BEM-VINDO AO VITTNESS</div>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>Comece sua jornada agora</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 14 }}>
          Configure seu perfil, crie sua primeira rotina de treino e deixe a IA personalizar seu plano.
        </div>
        <button style={{ ...styles.btn, padding: "10px", fontSize: 12 }} onClick={() => onNav("record")}>⚡ CRIAR MINHA ROTINA</button>
      </div>

      <div style={styles.sectionTitle}>Feed de Amigos</div>
      <div style={{ ...styles.card }}>
        <EmptyState
          icon="👥"
          title="Nenhum amigo ainda"
          subtitle="Adicione amigos para ver as atividades deles aqui e se motivar juntos."
          btnLabel="ADICIONAR AMIGOS"
        />
      </div>

      <div style={styles.sectionTitle}>Suas Atividades</div>
      <div style={styles.card}>
        <EmptyState
          icon="🏃"
          title="Nenhuma atividade registrada"
          subtitle="Grave sua primeira corrida, caminhada ou treino de força para aparecer aqui."
          btnLabel="GRAVAR ATIVIDADE"
          onBtn={() => onNav("record")}
        />
      </div>
    </div>
  );
}

function NutritionScreen() {
  const [water, setWater] = useState(0);
  const waterGoal = 3.0;
  const [meals, setMeals] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealForm, setMealForm] = useState({ name: "", kcal: "" });
  const [mealErr, setMealErr] = useState("");

  const totalKcal = meals.reduce((sum, m) => sum + (parseInt(m.kcal) || 0), 0);
  const goalKcal = 2000;
  const macros = [
    { name: "Proteína", cur: 0, goal: 150, color: COLORS.accent },
    { name: "Carbos", cur: 0, goal: 250, color: COLORS.info },
    { name: "Gorduras", cur: 0, goal: 65, color: COLORS.warning },
  ];

  function handleAddMeal() {
    if (!mealForm.name.trim()) { setMealErr("Informe o nome da refeição."); return; }
    if (!mealForm.kcal || isNaN(mealForm.kcal) || parseInt(mealForm.kcal) <= 0) { setMealErr("Informe um valor de calorias válido."); return; }
    setMeals(m => [...m, { name: mealForm.name.trim(), kcal: parseInt(mealForm.kcal) }]);
    setMealForm({ name: "", kcal: "" });
    setMealErr("");
    setShowAddMeal(false);
  }

  return (
    <div style={styles.screen}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>RELATÓRIO SEMANAL</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {totalKcal > 0
            ? <><span style={{ fontSize: 36, fontWeight: 900, color: COLORS.accent }}>{totalKcal.toLocaleString()}</span><span style={{ fontSize: 14, color: COLORS.textMuted }}>kcal hoje</span></>
            : <><span style={{ fontSize: 36, fontWeight: 900, color: COLORS.textMuted }}>—</span><span style={{ fontSize: 14, color: COLORS.textMuted }}>sem dados ainda</span></>
          }
        </div>
      </div>

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

      <div style={styles.card}>
        <div style={styles.label}>Macronutrientes</div>
        {macros.map(m => (
          <div key={m.name} style={{ marginTop: 10 }}>
            <div style={styles.row}>
              <span style={{ fontSize: 13 }}>{m.name}</span>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>0g / {m.goal}g</span>
            </div>
            <ProgressBar value={0} max={m.goal} color={m.color} />
          </div>
        ))}
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 12 }}>
          Registre suas refeições para acompanhar os macros.
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div>
            <div style={styles.label}>Hidratação Diária</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: water > 0 ? COLORS.info : COLORS.textMuted }}>
              {water.toFixed(1)}L / {waterGoal}L
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>
              {water === 0 ? "Registre seu primeiro copo!" : `Faltam ${(waterGoal - water).toFixed(1)}L`}
            </div>
          </div>
          <CircleProgress value={water} max={waterGoal} size={70} color={water > 0 ? COLORS.info : COLORS.textMuted} />
        </div>
        <ProgressBar value={water} max={waterGoal} color={COLORS.info} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {[["Copo 200ml", 0.2], ["Garrafa 500ml", 0.5], ["Personalizado", 0.3]].map(([lbl, amt]) => (
            <button key={lbl} onClick={() => setWater(w => Math.min(waterGoal, +(w + amt).toFixed(1)))}
              style={{ background: COLORS.surface3, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: COLORS.text, cursor: "pointer", fontFamily: "inherit", flex: 1 }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

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
          meals.map((item, j) => (
            <div key={j} style={{ ...styles.row, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>{item.kcal} kcal</span>
                <span onClick={() => setMeals(m => m.filter((_, i) => i !== j))} style={{ fontSize: 16, color: COLORS.textMuted, cursor: "pointer", lineHeight: 1 }}>✕</span>
              </div>
            </div>
          ))
        )}

        {showAddMeal ? (
          <div style={{ marginTop: 14, background: COLORS.surface2, borderRadius: 10, padding: "14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: COLORS.accent, textTransform: "uppercase", marginBottom: 12 }}>Nova Refeição</div>

            <label style={styles.inputLabel}>Nome da refeição</label>
            <input
              style={{ ...styles.input, borderColor: mealErr && !mealForm.name.trim() ? COLORS.danger : COLORS.border }}
              placeholder="Ex: Frango gralhado com arroz"
              value={mealForm.name}
              onChange={e => { setMealForm(f => ({ ...f, name: e.target.value })); setMealErr(""); }}
            />

            <label style={styles.inputLabel}>Calorias (kcal)</label>
            <input
              style={{ ...styles.input, borderColor: mealErr && (!mealForm.kcal || isNaN(mealForm.kcal)) ? COLORS.danger : COLORS.border }}
              placeholder="Ex: 450"
              value={mealForm.kcal}
              onChange={e => { setMealForm(f => ({ ...f, kcal: e.target.value.replace(/\D/g, "") })); setMealErr(""); }}
              type="text"
              inputMode="numeric"
            />

            {mealErr && (
              <div style={{ fontSize: 12, color: COLORS.danger, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                ⚠ {mealErr}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...styles.btn, flex: 1, padding: "11px", fontSize: 12 }} onClick={handleAddMeal}>ADICIONAR</button>
              <button style={{ ...styles.btnOutline, flex: 1, padding: "11px", fontSize: 12 }} onClick={() => { setShowAddMeal(false); setMealForm({ name: "", kcal: "" }); setMealErr(""); }}>CANCELAR</button>
            </div>
          </div>
        ) : (
          <button style={{ ...styles.btnOutline, marginTop: 12, padding: "10px", fontSize: 12 }} onClick={() => setShowAddMeal(true)}>+ Adicionar Refeição</button>
        )}
      </div>

      <div style={{ ...styles.card, borderColor: COLORS.accent + "44", background: COLORS.accent + "0d" }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>✦ IA E INSIGHTS</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
          Complete seu perfil com peso, altura e objetivos para receber sugestões alimentares personalizadas da IA.
        </div>
      </div>
    </div>
  );
}

function RecordScreen() {
  const [goal, setGoal] = useState("Perda de Gordura");
  const [freq, setFreq] = useState("5X");
  const [generated, setGenerated] = useState(false);
  const [notifExe, setNotifExe] = useState(true);
  const [notifWater, setNotifWater] = useState(true);
  const [notifFocus, setNotifFocus] = useState(false);
  const goals = ["Perda de Gordura", "Musculação"];
  const freqs = ["3X", "5X", "6X", "DAILY"];

  return (
    <div style={styles.screen}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, letterSpacing: 2, marginBottom: 4 }}>✦ ELITE ROUTINE ENGINE</div>
        <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>Desenhe sua<br />Performance.</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 8 }}>Defina seus objetivos e deixe nossa IA processar o plano ideal.</div>
      </div>

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
        <div style={styles.label}>Frequência Semanal</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {freqs.map(f => (
            <button key={f} onClick={() => setFreq(f)} style={{
              flex: 1, padding: "10px 0", borderRadius: 8, border: `1.5px solid ${freq === f ? COLORS.accent : COLORS.border}`,
              background: freq === f ? COLORS.accent : COLORS.surface2, color: freq === f ? "#000" : COLORS.textSecondary,
              fontWeight: 800, fontSize: 12, cursor: "pointer", letterSpacing: 1, fontFamily: "inherit",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <button style={{ ...styles.btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => setGenerated(true)}>
          ⚡ GERAR PLANO IA
        </button>
      </div>

      {generated && (
        <div style={styles.card}>
          <div style={{ ...styles.row, marginBottom: 12 }}>
            <div style={styles.label}>Sugestão Semanal</div>
            <span style={{ ...styles.badge(COLORS.accent), fontSize: 10 }}>OTIMIZADO</span>
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>SEGUNDA-FEIRA</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Peitoral e Tríceps (Hipertrofia)</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>⏱ 75 min</span>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>🔥 640 kcal</span>
          </div>
          <div style={{ background: COLORS.surface3, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>✦ ANÁLISE DA IA VITTNESS</div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>Seu plano foi ajustado para maximizar a síntese proteica. Recomendamos um excedente calórico de 300kcal nos dias de treino e ingestão de 2.0g/kg de proteína.</div>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.label}>Configurações de Lembretes</div>
        {[
          ["⚡ Exercícios", notifExe, setNotifExe, "06:30"],
          ["💧 Hidratação", notifWater, setNotifWater, "A cada 2 horas"],
          ["🎯 Modo Foco", notifFocus, setNotifFocus, null],
        ].map(([lbl, val, setter, detail]) => (
          <div key={lbl} style={{ ...styles.row, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{lbl}</div>
              {detail && <div style={{ fontSize: 12, color: COLORS.textMuted }}>{detail}</div>}
            </div>
            <div onClick={() => setter(!val)} style={{ width: 44, height: 24, borderRadius: 12, background: val ? COLORS.accent : COLORS.surface3, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 3, left: val ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressScreen() {
  const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  const kcals = [0, 0, 0, 0, 0, 0, 0];
  return (
    <div style={styles.screen}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2 }}>📊 PAINEL DE PERFORMANCE</div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>Seu Progresso.</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 6 }}>Acompanhe sua evolução conforme você treina.</div>
      </div>

      <div style={{ display: "flex", gap: 12, padding: "12px 16px 0" }}>
        {[["0", "TREINOS TOTAIS", "comece hoje!"], ["0", "MINUTOS ATIVOS", "min"]].map(([v, l, s]) => (
          <div key={l} style={{ ...styles.card, flex: 1, margin: 0 }}>
            <div style={styles.label}>{l}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.textMuted }}>{v}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Score de Consistência</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: COLORS.textMuted }}>—</span>
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>sem treinos ainda</span>
        </div>
        <ProgressBar value={0} max={100} />
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 16 }}>
          <div style={styles.label}>Atividade Semanal</div>
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>Calorias (kcal)</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
          {days.map((d) => (
            <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", background: COLORS.surface3, borderRadius: "3px 3px 0 0", height: 8 }} />
              <span style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 0.5 }}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 10, textAlign: "center" }}>
          Grave treinos para ver seu gráfico aqui.
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div style={styles.label}>Rotina Ativa</div>
          <span style={{ ...styles.tag, fontSize: 10, background: COLORS.textMuted + "22", color: COLORS.textMuted }}>SEM ROTINA</span>
        </div>
        <EmptyState
          icon="🗓"
          title="Nenhuma rotina criada"
          subtitle="Crie sua rotina de treinos para que ela apareça aqui com o próximo exercício do dia."
        />
      </div>

      <div style={{ ...styles.card, borderColor: COLORS.accent + "44", background: COLORS.accent + "0d" }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>✦ COACH IA</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
          Realize seu primeiro treino para receber feedback personalizado da IA sobre sua performance e consistência.
        </div>
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

  const objetivos = [
    "Perda de Gordura",
    "Musculação",
  ];

  function handleSave() {
    if (!form.name.trim()) return;
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); onBack(); }, 900);
  }

  return (
    <div style={{ ...styles.screen, paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px 8px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.accent, fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1 }}>←</button>
        <div style={{ fontSize: 20, fontWeight: 900 }}>Editar Perfil</div>
      </div>

      {/* Avatar */}
      <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: COLORS.surface2, border: `2px dashed ${COLORS.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: COLORS.accent, position: "relative", cursor: "pointer" }}>
          {form.name ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "📷"}
          <div style={{ position: "absolute", bottom: -4, right: -4, background: COLORS.accent, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#000" }}>📷</div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 8 }}>Toque para alterar a foto</div>
      </div>

      {/* Informações pessoais */}
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

      {/* Objetivos */}
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

      {/* Resumo preenchido */}
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
        {[["0", "ATIVIDADES"], ["0", "KM"], ["0", "SEGUIDORES"]].map(([v, l]) => (
          <div key={l} style={{ ...styles.card, flex: 1, margin: 0, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.textMuted }}>{v}</div>
            <div style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 1 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div style={styles.label}>Meus Troféus</div>
        </div>
        <EmptyState
          icon="🏆"
          title="Nenhum troféu ainda"
          subtitle="Complete desafios e metas para conquistar troféus."
        />
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Recordes Pessoais</div>
        <EmptyState
          icon="📈"
          title="Sem recordes ainda"
          subtitle="Seus recordes pessoais aparecerão aqui após seus primeiros treinos."
        />
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 2 }}>
        {[["✏ Editar Perfil", "", () => setEditing(true)], ["⚙️ Configurações de conta", "", null], ["❓ Ajuda e Suporte", "", null], ["🚪 Sair", COLORS.danger, () => onNav("login")]].map(([lbl, color, action]) => (
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

  const mainScreens = ["feed", "nutrition", "record", "progress", "profile"];
  const isMain = mainScreens.includes(screen);

  function handleLogin(user) {
    setCurrentUser(user);
    setScreen("feed");
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
    { id: "feed", label: "Início", icon: "🏠" },
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
            <button style={styles.iconBtn}>🔔</button>
          </div>
        </div>
      )}

      {screen === "login" && <LoginScreen onLogin={handleLogin} onNav={setScreen} />}
      {screen === "register" && <RegisterScreen onLogin={handleLogin} onNav={setScreen} />}
      {screen === "feed" && <FeedScreen onNav={setScreen} />}
      {screen === "nutrition" && <NutritionScreen />}
      {screen === "record" && <RecordScreen />}
      {screen === "progress" && <ProgressScreen />}
      {screen === "profile" && <ProfileScreen onLogout={handleLogout} userName={currentUser?.name || ""} currentUser={currentUser} onUpdateUser={handleUpdateUser} />}

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