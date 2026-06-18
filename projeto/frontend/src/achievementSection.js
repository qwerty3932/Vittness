import React, { useState, useEffect } from "react";

// ─── Paleta e estilos base ──────────────────────────────────────────────────
const C = {
  bg:            "#0d0d0d",
  surface:       "#1a1a1a",
  surface2:      "#222222",
  surface3:      "#2a2a2a",
  accent:        "#8bc34a",
  accentDark:    "#6a9e2f",
  accentLight:   "#a5d65e",
  text:          "#ffffff",
  textSecondary: "#aaaaaa",
  textMuted:     "#666666",
  danger:        "#e74c3c",
  warning:       "#f39c12",
  info:          "#3498db",
  border:        "#2e2e2e",
};

// Mapeamento de categorias para ícone/cor/label
const CATEGORY_META = {
  workout:   { label: "Treinos",   color: C.accent,  icon: "🏋️" },
  nutrition: { label: "Nutrição",  color: C.info,    icon: "🥗" },
  streak:    { label: "Sequência", color: C.warning,  icon: "🔥" },
  milestone: { label: "Marco",     color: "#b06aff",  icon: "🏆" },
  social:    { label: "Social",    color: "#ff6b9d",  icon: "🤝" },
  default:   { label: "Geral",     color: C.textMuted, icon: "⭐" },
};

function getCategoryMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.default;
}

// Barra de progresso horizontal
function ProgressBar({ value, max, color = C.accent, thin = false }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <div style={{ height: thin ? 3 : 5, background: C.surface3, borderRadius: 99, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

// Card de conquista individual
function AchievementCard({ ach, isNew }) {
  const meta      = getCategoryMeta(ach.category);
  const isUnlocked = !!ach.unlocked_at;
  const hasProgress = !isUnlocked && ach.progress != null && ach.goal != null && ach.goal > 0;
  const pct = hasProgress ? Math.min(100, Math.round((ach.progress / ach.goal) * 100)) : 0;

  return (
    <div
      style={{
        background: isUnlocked ? `${meta.color}0d` : C.surface,
        border: `1px solid ${isUnlocked ? meta.color + "44" : C.border}`,
        borderRadius: 12,
        padding: "14px 12px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        position: "relative",
        opacity: isUnlocked ? 1 : 0.5,
        transition: "opacity 0.2s",
        overflow: "hidden",
      }}
    >
      {/* Badge "NOVO" */}
      {isNew && isUnlocked && (
        <div style={{
          position: "absolute", top: 6, left: 6,
          background: C.accent, borderRadius: 4,
          fontSize: 8, fontWeight: 900, letterSpacing: 1,
          color: "#000", padding: "2px 5px", textTransform: "uppercase",
        }}>
          NOVO
        </div>
      )}

      {/* Checkmark desbloqueado */}
      {isUnlocked && (
        <div style={{
          position: "absolute", top: -1, right: -1,
          width: 20, height: 20, borderRadius: "0 12px 0 8px",
          background: meta.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 900, color: "#000",
        }}>
          ✓
        </div>
      )}

      {/* Ícone da conquista */}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: isUnlocked ? `${meta.color}22` : C.surface2,
        border: `1.5px solid ${isUnlocked ? meta.color + "55" : C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24,
        filter: isUnlocked ? "none" : "grayscale(1)",
      }}>
        {ach.icon || meta.icon}
      </div>

      {/* Nome */}
      <div style={{
        fontSize: 11, fontWeight: 800, letterSpacing: 0.4,
        textTransform: "uppercase",
        color: isUnlocked ? meta.color : C.text,
        textAlign: "center", lineHeight: 1.3,
      }}>
        {ach.name}
      </div>

      {/* Descrição */}
      {ach.description && (
        <div style={{
          fontSize: 10, color: C.textMuted,
          textAlign: "center", lineHeight: 1.4,
        }}>
          {ach.description}
        </div>
      )}

      {/* Barra de progresso (somente bloqueada com meta) */}
      {hasProgress && (
        <div style={{ width: "100%", marginTop: 2 }}>
          <ProgressBar value={ach.progress} max={ach.goal} color={meta.color} thin />
          <div style={{ fontSize: 9, color: C.textMuted, textAlign: "center", marginTop: 3 }}>
            {ach.progress} / {ach.goal}
          </div>
        </div>
      )}

      {/* Data de desbloqueio */}
      {isUnlocked && ach.unlocked_at && (
        <div style={{ fontSize: 9, color: C.textMuted }}>
          {new Date(ach.unlocked_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "short", year: "2-digit",
          })}
        </div>
      )}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────
export default function AchievementsSection() {
  const API   = process.env.REACT_APP_API_URL;
  const token = () => localStorage.getItem("accessToken");

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [newIds, setNewIds]             = useState(new Set());

  useEffect(() => { fetchAchievements(); }, []);

  async function fetchAchievements() {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API}/achievements`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao carregar conquistas.");
        return;
      }

      const list = data.achievements || [];
      setAchievements(list);

      // Marca como "novo" conquistas desbloqueadas nas últimas 24h
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      const fresh  = new Set(
        list
          .filter(a => a.unlocked_at && new Date(a.unlocked_at).getTime() > cutoff)
          .map(a => a.id)
      );
      setNewIds(fresh);
    } catch {
      setError("Não foi possível carregar as conquistas.");
    } finally {
      setLoading(false);
    }
  }

  // ── Dados derivados ──────────────────────────────────────────────────────
  const unlocked    = achievements.filter(a => a.unlocked_at);
  const locked      = achievements.filter(a => !a.unlocked_at);
  const total       = achievements.length;
  const totalPct    = total > 0 ? Math.round((unlocked.length / total) * 100) : 0;

  // Categorias presentes
  const categories  = [...new Set(achievements.map(a => a.category).filter(Boolean))];

  // Filtro ativo
  const filtered = (activeFilter === "all"
    ? [...unlocked, ...locked]
    : activeFilter === "unlocked"
    ? unlocked
    : activeFilter === "locked"
    ? locked
    : achievements.filter(a => a.category === activeFilter)
  );

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.textMuted, textTransform: "uppercase" }}>
            Conquistas
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: 110, background: C.surface, borderRadius: 12, animation: "pulse 1.5s ease-in-out infinite", opacity: 0.6 }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100% { opacity:.4 } 50% { opacity:.7 } }`}</style>
      </div>
    );
  }

  // ── Erro ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ margin: "8px 16px", padding: "12px 14px", background: `${C.danger}15`, border: `1px solid ${C.danger}44`, borderRadius: 10 }}>
        <div style={{ fontSize: 12, color: C.danger, fontWeight: 700 }}>⚠ {error}</div>
        <div
          onClick={fetchAchievements}
          style={{ fontSize: 11, color: C.textMuted, marginTop: 6, cursor: "pointer", textDecoration: "underline" }}
        >
          Tentar novamente
        </div>
      </div>
    );
  }

  // ── Sem conquistas configuradas ──────────────────────────────────────────
  if (total === 0) {
    return (
      <div style={{ margin: "8px 16px", padding: "20px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Nenhuma conquista ainda</div>
        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>Continue treinando para desbloquear conquistas.</div>
      </div>
    );
  }

  // ── Render principal ─────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{
          display: "flex", alignItems: "baseline",
          justifyContent: "space-between", marginBottom: 10,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.textSecondary }}>
            Conquistas
          </div>
          <span style={{
            background: `${C.accent}22`, color: C.accent,
            borderRadius: 4, padding: "3px 8px",
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
          }}>
            {unlocked.length} / {total}
          </span>
        </div>

        {/* Barra geral de progresso */}
        <div style={{ marginBottom: 4 }}>
          <ProgressBar value={unlocked.length} max={total} color={C.accent} />
        </div>
        <div style={{ fontSize: 11, color: C.textMuted }}>
          {totalPct}% desbloqueadas · {locked.length} restantes
        </div>
      </div>

      {/* ── Filtros ────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 6, padding: "12px 16px 0",
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        {[
          { id: "all",      label: "Todas" },
          { id: "unlocked", label: "✓ Obtidas" },
          { id: "locked",   label: "🔒 Bloqueadas" },
          ...categories.map(cat => ({
            id: cat,
            label: `${getCategoryMeta(cat).icon} ${getCategoryMeta(cat).label}`,
          })),
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              flexShrink: 0,
              background: activeFilter === f.id ? C.accent : C.surface2,
              color:      activeFilter === f.id ? "#000"    : C.textMuted,
              border:     `1px solid ${activeFilter === f.id ? C.accent : C.border}`,
              borderRadius: 20,
              padding: "6px 12px",
              fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              letterSpacing: 0.5, whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
      </div>

      {/* ── Grid de conquistas ─────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
        padding: "12px 16px 8px",
      }}>
        {filtered.map(ach => (
          <AchievementCard
            key={ach.id}
            ach={ach}
            isNew={newIds.has(ach.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px 16px", color: C.textMuted, fontSize: 13 }}>
          Nenhuma conquista nesta categoria.
        </div>
      )}

      {/* ── Sumário por categoria ──────────────────────────────────────── */}
      {categories.length > 0 && (
        <div style={{ padding: "4px 16px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.textMuted, marginBottom: 8 }}>
            Por categoria
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {categories.map(cat => {
              const meta   = getCategoryMeta(cat);
              const catAll = achievements.filter(a => a.category === cat);
              const catOk  = catAll.filter(a => a.unlocked_at);
              return (
                <div
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: 10, padding: "10px 12px",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${meta.color}18`,
                    border: `1px solid ${meta.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0,
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>{catOk.length}/{catAll.length}</span>
                    </div>
                    <ProgressBar value={catOk.length} max={catAll.length} color={meta.color} thin />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
