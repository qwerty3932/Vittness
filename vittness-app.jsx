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

function LoginScreen({ onNav }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  return (
    <div style={{ ...styles.screen, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px", minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.accent, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>⚡ VITTNESS</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>Sua melhor performance</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>começa aqui.</div>
        <div style={{ width: 40, height: 3, background: COLORS.accent, margin: "12px auto 0", borderRadius: 2 }} />
      </div>
      <label style={styles.inputLabel}>E-mail</label>
      <input style={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" type="email" />
      <label style={styles.inputLabel}>Senha</label>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <input style={{ ...styles.input, marginBottom: 0, paddingRight: 44 }} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" type={showPass ? "text" : "password"} />
        <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 18 }}>
          {showPass ? "🙈" : "👁"}
        </button>
      </div>
      <div style={{ textAlign: "right", marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: COLORS.textSecondary, cursor: "pointer" }}>Esqueci minha senha</span>
      </div>
      <button style={styles.btn} onClick={() => onNav("feed")}>ENTRAR</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: COLORS.border }} />
        <span style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 2 }}>OU CONECTE-SE COM</span>
        <div style={{ flex: 1, height: 1, background: COLORS.border }} />
      </div>
      <button style={{ ...styles.btnOutline, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <span style={{ fontWeight: 900, fontSize: 15 }}>G</span> GOOGLE
      </button>
      <div style={{ textAlign: "center", marginTop: 28, fontSize: 14 }}>
        Novo no Vittness?{" "}
        <span onClick={() => onNav("register")} style={{ color: COLORS.accent, fontWeight: 700, cursor: "pointer" }}>Criar conta</span>
      </div>
    </div>
  );
}

function RegisterScreen({ onNav }) {
  const [form, setForm] = useState({ name: "", email: "", pass: "", confirm: "" });
  return (
    <div style={{ ...styles.screen, padding: "24px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.accent, letterSpacing: 4, marginBottom: 20 }}>⚡ VITTNESS</div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>Crie sua conta</div>
        <div style={{ color: COLORS.textSecondary, fontSize: 15, marginTop: 6 }}>Comece sua jornada de performance hoje.</div>
      </div>
      {[["NOME COMPLETO","name","Atleta de Elite","text"],["E-MAIL","email","seu@email.com","email"],["SENHA","pass","••••••••","password"],["CONFIRMAR SENHA","confirm","••••••••","password"]].map(([lbl, key, ph, type]) => (
        <div key={key}>
          <label style={styles.inputLabel}>{lbl}</label>
          <input style={styles.input} placeholder={ph} type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
        </div>
      ))}
      <button style={{ ...styles.btn, marginTop: 8 }} onClick={() => onNav("feed")}>CRIAR CONTA</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: COLORS.border }} />
        <span style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 2 }}>OU</span>
        <div style={{ flex: 1, height: 1, background: COLORS.border }} />
      </div>
      <button style={{ ...styles.btnOutline, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <span style={{ fontWeight: 900, fontSize: 15 }}>G</span> CONTINUAR COM GOOGLE
      </button>
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
        Já tem uma conta?{" "}
        <span onClick={() => onNav("login")} style={{ color: COLORS.accent, fontWeight: 700, cursor: "pointer" }}>Fazer login</span>
      </div>
      <div style={{ textAlign: "center", marginTop: 32, display: "flex", justifyContent: "center", gap: 24 }}>
        {["PRIVACIDADE", "TERMOS", "SUPORTE"].map(t => (
          <span key={t} style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, cursor: "pointer" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function FeedScreen() {
  const activities = [
    { user: "João Silva", type: "CORRIDA MATINAL", dist: "8.52 km", time: "42:15", pace: "4:58/km", likes: 12, comments: 3 },
    { user: "Maria Santos", type: "CICLISMO DE ESTRADA", dist: "32.4 km", time: "1:12:30", speed: "26.8 km/h", likes: 28, comments: 7 },
  ];
  return (
    <div style={styles.screen}>
      <div style={{ ...styles.card, background: COLORS.surface }}>
        <div style={{ display: "flex", gap: 24 }}>
          {[["42.5", "KM TOTAL"], ["3h 45m", "TEMPO"], ["5", "ATIVIDADES"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.accent }}>{v}</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...styles.row, padding: "4px 16px 0" }}>
        <div style={styles.sectionTitle}>Feed de Amigos</div>
        <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, cursor: "pointer" }}>FILTRAR</span>
      </div>
      {activities.map((a, i) => (
        <div key={i} style={styles.card}>
          <div style={{ ...styles.row, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.surface3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: COLORS.accent }}>
                {a.user.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.user}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 }}>{a.type}</div>
              </div>
            </div>
            <span style={{ color: COLORS.textMuted, fontSize: 20, cursor: "pointer" }}>···</span>
          </div>
          <div style={{ background: COLORS.surface3, borderRadius: 8, height: 120, display: "flex", alignItems: "flex-end", padding: 10, marginBottom: 12, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, #1a2a1a 0%, #0d1a0d 100%)`, opacity: 0.9 }} />
            <span style={{ ...styles.tag, position: "relative", zIndex: 1, fontSize: 10 }}>
              {i === 0 ? "MAPA DA ROTA" : "RECORDE PESSOAL"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[
              [a.dist, "DISTÂNCIA"],
              [a.time, "TEMPO"],
              [a.pace || a.speed, a.pace ? "RITMO" : "VEL. MÉDIA"]
            ].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.accent }}>{v}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.row, borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ fontSize: 13, color: COLORS.textSecondary, cursor: "pointer" }}>👍 {a.likes}</span>
              <span style={{ fontSize: 13, color: COLORS.textSecondary, cursor: "pointer" }}>💬 {a.comments}</span>
            </div>
            <span style={{ fontSize: 18, color: COLORS.textMuted, cursor: "pointer" }}>↗</span>
          </div>
        </div>
      ))}
      <div style={{ ...styles.card, borderColor: COLORS.accent + "44", background: COLORS.accent + "0d" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ background: COLORS.accent, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✦</div>
          <div>
            <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>DESTAQUE DA IA</div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5 }}>Você está 15% acima da sua média semanal! Que tal um desafio de <strong style={{ color: COLORS.text }}>10km este Domingo</strong>?</div>
            <button style={{ ...styles.btn, marginTop: 10, padding: "8px 14px", fontSize: 11, width: "auto" }}>ACEITAR DESAFIO</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutritionScreen() {
  const [water, setWater] = useState(2.1);
  const waterGoal = 3.0;
  const meals = [
    { time: "☀️ Café da Manhã", items: [{ name: "Ovos Mexidos (3 unidades)", kcal: 210 }, { name: "Torrada Integral com Abacate", kcal: 218 }] },
    { time: "🍽 Almoço", items: [{ name: "Frango Gralhado com Quinoa", kcal: 486 }] },
  ];
  const totalKcal = 1388;
  const goalKcal = 2800;
  const macros = [{ name: "Proteína", cur: 112, goal: 180, color: COLORS.accent }, { name: "Carbos", cur: 225, goal: 350, color: COLORS.info }, { name: "Gorduras", cur: 42, goal: 75, color: COLORS.warning }];

  return (
    <div style={styles.screen}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>RELATÓRIO SEMANAL</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: COLORS.accent }}>2.450</span>
          <span style={{ fontSize: 14, color: COLORS.textMuted }}>kcal/dia</span>
        </div>
        <span style={{ fontSize: 12, color: "#4caf50" }}>↑ +12% vs meta</span>
      </div>

      <div style={styles.card}>
        <div style={styles.row}>
          <div>
            <div style={styles.label}>Balanço Calórico</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.accent }}>1.420 <span style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 400 }}>kcal restantes</span></div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textMuted, marginTop: 8 }}>
          <span>Consumido: {totalKcal} kcal</span><span>Meta: {goalKcal} kcal</span>
        </div>
        <ProgressBar value={totalKcal} max={goalKcal} />
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Macronutrientes</div>
        {macros.map(m => (
          <div key={m.name} style={{ marginTop: 10 }}>
            <div style={{ ...styles.row }}>
              <span style={{ fontSize: 13 }}>{m.name}</span>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>{m.cur}g / {m.goal}g</span>
            </div>
            <ProgressBar value={m.cur} max={m.goal} color={m.color} />
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div>
            <div style={styles.label}>Hidratação Diária</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.info }}>{water.toFixed(1)}L / {waterGoal}L</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>Faltam {(waterGoal - water).toFixed(1)}L</div>
          </div>
          <CircleProgress value={water} max={waterGoal} size={70} color={COLORS.info} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["Copo 200ml", 0.2], ["Garrafa 500ml", 0.5], ["Personalizado", 0.3]].map(([lbl, amt]) => (
            <button key={lbl} onClick={() => setWater(w => Math.min(waterGoal, +(w + amt).toFixed(1)))} style={{ background: COLORS.surface3, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: COLORS.text, cursor: "pointer", fontFamily: "inherit", flex: 1 }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div style={styles.label}>Registro de Refeições</div>
        </div>
        {meals.map((meal, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, marginBottom: 6 }}>{meal.time}</div>
            {meal.items.map((item, j) => (
              <div key={j} style={{ ...styles.row, padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{item.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{item.kcal} kcal</span>
              </div>
            ))}
          </div>
        ))}
        <button style={{ ...styles.btnOutline, marginTop: 8, padding: "10px", fontSize: 12 }}>+ Adicionar Refeição</button>
      </div>

      <div style={{ ...styles.card, borderColor: COLORS.accent + "44", background: COLORS.accent + "0d" }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>✦ IA E INSIGHTS</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
          Seu nível de hidratação caiu 15% após o treino de força. Recomendamos ingerir 400ml extras de água rica em eletrólitos nos próximos 30 minutos.
        </div>
        <button style={{ ...styles.btn, marginTop: 10, padding: "9px", fontSize: 11 }}>REGISTRAR AGORA</button>
      </div>
    </div>
  );
}

function RecordScreen() {
  const [goal, setGoal] = useState("Ganho de Massa");
  const [freq, setFreq] = useState("5X");
  const [generated, setGenerated] = useState(false);
  const [notifExe, setNotifExe] = useState(true);
  const [notifWater, setNotifWater] = useState(true);
  const [notifFocus, setNotifFocus] = useState(false);
  const goals = ["Ganho de Massa", "Perda de Gordura", "Resistência Atleta"];
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
  const kcals = [520, 680, 0, 640, 720, 480, 0];
  const maxKcal = Math.max(...kcals);
  return (
    <div style={styles.screen}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2 }}>📊 PAINEL DE PERFORMANCE</div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>Seu Progresso Atleta.</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 6 }}>Acompanhe sua evolução e métricas otimizadas por IA.</div>
      </div>

      <div style={{ display: "flex", gap: 12, padding: "12px 16px 0" }}>
        {[["24", "TREINOS TOTAIS", "+4 este mês"], ["1.480", "MINUTOS ATIVOS", "min"]].map(([v, l, s]) => (
          <div key={l} style={{ ...styles.card, flex: 1, margin: 0 }}>
            <div style={styles.label}>{l}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.accent }}>{v}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Score de Consistência</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: COLORS.accent }}>94%</span>
          <span style={{ ...styles.tag, fontSize: 11 }}>ELITE</span>
        </div>
        <ProgressBar value={94} max={100} />
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 16 }}>
          <div style={styles.label}>Atividade Semanal</div>
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>Calorias (kcal)</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
          {days.map((d, i) => (
            <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", background: kcals[i] > 0 ? COLORS.accent : COLORS.surface3, borderRadius: "3px 3px 0 0", height: kcals[i] > 0 ? `${(kcals[i] / maxKcal) * 64}px` : "8px", transition: "height 0.5s ease" }} />
              <span style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 0.5 }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div style={styles.label}>Rotina Ativa</div>
          <span style={{ ...styles.tag, fontSize: 10, background: "#4caf5022", color: "#4caf50" }}>EM CURSO</span>
        </div>
        <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>PRÓXIMO TREINO</div>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Peitoral e Tríceps</div>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>⏱ 75 min</span>
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>🔥 640 kcal</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {["SUPINO RETO", "TRÍCEPS CORDA"].map(ex => (
            <div key={ex} style={{ flex: 1, background: COLORS.surface3, borderRadius: 8, padding: "28px 0 8px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 }}>{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.card, borderColor: COLORS.accent + "44", background: COLORS.accent + "0d" }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>✦ FEEDBACK DO COACH IA</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
          Sua consistência nesta semana foi 15% superior à anterior. O volume de treino em "Peitoral" está atingindo o platô ideal. Recomendamos aumentar a carga no Supino Reto em 2.5kg na próxima sessão.
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ onNav }) {
  const stats = [["127", "ATIVIDADES"], ["842", "KM"], ["156", "SEGUIDORES"]];
  const trophies = [["🏆", "FIRST 5K"], ["🔥", "7 DAY STREAK"], ["🏃", "MARATHON"]];
  return (
    <div style={styles.screen}>
      <div style={{ textAlign: "center", padding: "24px 20px 16px" }}>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: COLORS.accent + "33", border: `2px solid ${COLORS.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: COLORS.accent, margin: "0 auto 12px", position: "relative" }}>
          EU
          <div style={{ position: "absolute", bottom: -4, right: -4, background: COLORS.accent, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✏</div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Atleta Name</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>Atleta desde 2024</div>
      </div>

      <div style={{ display: "flex", gap: 12, padding: "0 16px" }}>
        {stats.map(([v, l]) => (
          <div key={l} style={{ ...styles.card, flex: 1, margin: 0, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.accent }}>{v}</div>
            <div style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 1 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <div style={styles.label}>Meus Troféus</div>
          <span style={{ fontSize: 11, color: COLORS.accent, cursor: "pointer", fontWeight: 700, letterSpacing: 1 }}>VER TODOS</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {trophies.map(([ico, lbl]) => (
            <div key={lbl} style={{ flex: 1, background: COLORS.surface2, borderRadius: 8, padding: "12px 0", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{ico}</div>
              <div style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 0.5 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Recordes Pessoais</div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <div style={{ flex: 1, background: COLORS.surface2, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, color: COLORS.accent, letterSpacing: 1, marginBottom: 4 }}>RUNNING</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>Best 5k</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.accent }}>21:45</div>
          </div>
          <div style={{ flex: 1, background: COLORS.surface2, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, color: COLORS.accent, letterSpacing: 1, marginBottom: 4 }}>STRENGTH</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>Max Bench</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.accent }}>110kg</div>
          </div>
        </div>
        <div style={{ background: COLORS.surface2, borderRadius: 8, padding: 12, marginTop: 10 }}>
          <div style={{ ...styles.row }}>
            <div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>Weekly Volume</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.accent }}>42.5 km</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
              {[30, 50, 40, 70, 55, 80, 65].map((h, i) => (
                <div key={i} style={{ width: 8, height: h * 0.5, background: i === 5 ? COLORS.accent : COLORS.surface3, borderRadius: "2px 2px 0 0" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 2 }}>
        {[["✏ Edit Profile", ""], ["🔒 Privacy Settings", ""], ["❓ Help & Support", ""], ["🚪 Logout", COLORS.danger]].map(([lbl, color]) => (
          <div key={lbl} onClick={lbl.includes("Logout") ? () => onNav("login") : undefined} style={{ ...styles.card, margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "14px 16px" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: color || COLORS.text }}>{lbl}</span>
            {!lbl.includes("Logout") && <span style={{ color: COLORS.textMuted }}>›</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("login");

  const mainScreens = ["feed", "nutrition", "record", "progress", "profile"];
  const isMain = mainScreens.includes(screen);

  const navItems = [
    { id: "feed", label: "Início", icon: "🏠" },
    { id: "nutrition", label: "Nutrição", icon: "🥗" },
    { id: "record", label: "Gravar", icon: "+" },
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
          <button style={styles.iconBtn}>🔔</button>
        </div>
      )}

      {screen === "login" && <LoginScreen onNav={setScreen} />}
      {screen === "register" && <RegisterScreen onNav={setScreen} />}
      {screen === "feed" && <FeedScreen />}
      {screen === "nutrition" && <NutritionScreen />}
      {screen === "record" && <RecordScreen />}
      {screen === "progress" && <ProgressScreen />}
      {screen === "profile" && <ProfileScreen onNav={setScreen} />}

      {isMain && (
        <nav style={styles.bottomNav}>
          {navItems.map(nav => (
            nav.id === "record" ? (
              <button key={nav.id} onClick={() => setScreen(nav.id)} style={styles.navCenterBtn}>
                {nav.icon}
              </button>
            ) : (
              <button key={nav.id} onClick={() => setScreen(nav.id)} style={{ ...styles.navItem, ...(screen === nav.id ? styles.navItemActive : {}) }}>
                <span style={{ fontSize: 18 }}>{nav.icon}</span>
                {nav.label}
              </button>
            )
          ))}
        </nav>
      )}
    </div>
  );
}
