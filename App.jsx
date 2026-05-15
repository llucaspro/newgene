import { useState, useEffect } from "react";

// Configurações de Cores
const COLORS = {
  bg: "#ffffff",
  surface: "#f8f9fa",
  primary: "#0066cc",
  primaryLight: "#e6f0ff",
  text: "#1a1a1a",
  textMuted: "#666666",
  border: "#e0e0e0",
};

// Componente de Ícones Simples
const Icon = ({ name }) => {
  const icons = {
    dna: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M2 9c6.667 6 13.333 0 20 6"/></svg>,
  };
  return icons[name] || null;
};

export default function App() {
  const [page, setPage] = useState("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Injeta estilos básicos
  useEffect(() => {
    const css = `
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
      body { background: ${COLORS.bg}; color: ${COLORS.text}; }
      .btn-primary { background: ${COLORS.primary}; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
      .btn-secondary { background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
      .card { background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; padding: 20px; border-radius: 8px; }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setPage("dashboard");
  };

  return (
    <div>
      {/* Navbar Simplificada */}
      <nav style={{ height: 64, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("landing")}>
          <div style={{ width: 32, height: 32, background: COLORS.primary, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <Icon name="dna" />
          </div>
          <span style={{ fontWeight: "bold", fontSize: 18 }}>GeneLink</span>
        </div>
        <div>
          {!isLoggedIn ? (
            <button className="btn-primary" onClick={() => setPage("login")}>Entrar</button>
          ) : (
            <span>Olá, {user.name}</span>
          )}
        </div>
      </nav>

      {/* Conteúdo das Páginas */}
      <main style={{ padding: "40px 24px" }}>
        {page === "landing" && (
          <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ fontSize: 40, marginBottom: 20 }}>Plataforma de Pesquisa Genética</h1>
            <p style={{ color: COLORS.textMuted, fontSize: 18, marginBottom: 30 }}>Explore dados genéticos e colabore com a ciência.</p>
            <button className="btn-primary" onClick={() => setPage("login")}>Começar Agora</button>
          </div>
        )}

        {page === "login" && (
          <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
            <h2>Entrar no GeneLink</h2>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="email" placeholder="Email" style={{ padding: 10, borderRadius: 6, border: `1px solid ${COLORS.border}` }} />
              <input type="password" placeholder="Senha" style={{ padding: 10, borderRadius: 6, border: `1px solid ${COLORS.border}` }} />
              <button className="btn-primary" onClick={() => handleLogin({ name: "Pesquisador" })}>Entrar</button>
              <button className="btn-secondary" onClick={() => setPage("landing")}>Voltar</button>
            </div>
          </div>
        )}

        {page === "dashboard" && (
          <div>
            <h2>Bem-vindo ao seu Dashboard</h2>
            <p>Seus dados de pesquisa aparecerão aqui.</p>
            <div style={{ marginTop: 20 }} className="card">
              <p>Nenhum dado recente encontrado.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
