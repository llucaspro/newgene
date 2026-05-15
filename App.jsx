import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// DESIGN SYSTEM - MINIMALISTA ACADÊMICO
// ============================================================
const COLORS = {
  bg: "#ffffff",
  surface: "#f8f9fa",
  surfaceAlt: "#f0f2f5",
  border: "#e0e0e0",
  borderHover: "#d0d0d0",
  primary: "#0066cc", // Azul científico
  primaryLight: "#e6f0ff",
  text: "#1a1a1a",
  textMuted: "#666666",
  textDim: "#999999",
  success: "#28a745",
  error: "#dc3545",
  warning: "#ffc107",
};

// ============================================================
// UTILITY: CSS-in-JS styles
// ============================================================
const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body, #root { 
      background: ${COLORS.bg}; 
      color: ${COLORS.text};
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
    ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${COLORS.borderHover}; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .animate-fade-in-up { animation: fadeInUp 0.4s ease forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
    .animate-slide-in { animation: slideIn 0.3s ease forwards; }

    .btn-primary {
      background: ${COLORS.primary};
      color: white;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }
    .btn-primary:hover { 
      background: #0052a3;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
    }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-secondary {
      background: ${COLORS.surface};
      color: ${COLORS.text};
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 6px;
      border: 1px solid ${COLORS.border};
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }
    .btn-secondary:hover { 
      background: ${COLORS.surfaceAlt};
      border-color: ${COLORS.borderHover};
    }

    .btn-ghost {
      background: transparent;
      color: ${COLORS.primary};
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }
    .btn-ghost:hover { 
      background: ${COLORS.primaryLight};
    }

    .input-field {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      color: ${COLORS.text};
      padding: 10px 14px;
      border-radius: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      transition: all 0.2s ease;
      width: 100%;
      outline: none;
    }
    .input-field:focus {
      border-color: ${COLORS.primary};
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }
    .input-field::placeholder { color: ${COLORS.textDim}; }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }

    .card {
      border-radius: 8px;
      border: 1px solid ${COLORS.border};
      background: ${COLORS.surface};
      padding: 20px;
      transition: all 0.2s ease;
    }
    .card:hover {
      border-color: ${COLORS.borderHover};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px dashed ${COLORS.border};
      background: ${COLORS.primaryLight};
      padding: 40px 20px;
      text-align: center;
      color: ${COLORS.textMuted};
    }

    .empty-state-icon {
      margin-bottom: 16px;
      font-size: 32px;
      opacity: 0.5;
    }

    .empty-state-title {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 600;
      color: ${COLORS.text};
    }

    .empty-state-description {
      font-size: 14px;
      color: ${COLORS.textMuted};
    }

    .divider {
      border: none;
      border-top: 1px solid ${COLORS.border};
      margin: 16px 0;
    }

    .section-label {
      font-size: 12px;
      color: ${COLORS.textDim};
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid ${COLORS.border};
      border-top-color: ${COLORS.primary};
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      background: #ffebee;
      border: 1px solid #ffcdd2;
      color: #c62828;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .success-message {
      background: #e8f5e9;
      border: 1px solid #c8e6c9;
      color: #2e7d32;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .sidebar-desktop { display: none !important; }
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
};

// ============================================================
// ICONS (SVG)
// ============================================================
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    dna: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M2 9c6.667 6 13.333 0 20 6"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
    flask: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M9 3h6m-6 0a1 1 0 0 0-1 1v5L4 17a2 2 0 0 0 1.8 2.9h12.4A2 2 0 0 0 20 17L16 9V4a1 1 0 0 0-1-1"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
    article: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>,
    message: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow_right: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
    arrow_left: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
    chevron_down: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="m6 9 6 6 6-6"/></svg>,
  };
  return icons[name] || null;
};

// ============================================================
// NAVIGATION BAR
// ============================================================
const NavBar = ({ page, setPage, isLoggedIn, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: scrolled ? `rgba(255, 255, 255, 0.95)` : "white",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
      transition: "all 0.2s ease",
      padding: "0 24px",
      boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("landing")}>
          <div style={{ width: 32, height: 32, background: COLORS.primary, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="dna" size={18} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>GeneLink</span>
        </div>

        {/* Nav Items */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, flex: 1, marginLeft: 48 }} className="hide-mobile">
          <div style={{ cursor: "pointer", color: page === "landing" ? COLORS.primary : COLORS.textMuted, fontWeight: page === "landing" ? 600 : 400 }} onClick={() => setPage("landing")}>
            Início
          </div>
          {isLoggedIn && (
            <>
              <div style={{ cursor: "pointer", color: page === "search" ? COLORS.primary : COLORS.textMuted, fontWeight: page === "search" ? 600 : 400 }} onClick={() => setPage("search")}>
                Pesquisar
              </div>
              <div style={{ cursor: "pointer", color: page === "dashboard" ? COLORS.primary : COLORS.textMuted, fontWeight: page === "dashboard" ? 600 : 400 }} onClick={() => setPage("dashboard")}>
                Dashboard
              </div>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isLoggedIn ? (
            <>
              <div style={{ fontSize: 14, color: COLORS.textMuted }}>Olá, {user?.name || "Usuário"}</div>
              <button className="btn-secondary" onClick={onLogout} style={{ padding: "8px 16px" }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => setPage("login")} style={{ padding: "8px 16px" }}>
                Entrar
              </button>
              <button className="btn-primary" onClick={() => setPage("register")} style={{ padding: "8px 16px" }}>
                Cadastro
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// ============================================================
// LANDING PAGE
// ============================================================
const LandingPage = ({ setPage }) => {
  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: COLORS.primaryLight }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16, color: COLORS.text }}>
            Plataforma de Pesquisa Genética
          </h1>
          <p style={{ fontSize: 18, color: COLORS.textMuted, marginBottom: 32 }}>
            Explore dados genéticos reais da NCBI, colabore com pesquisadores e avance a ciência biomédica.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => setPage("login")} style={{ padding: "12px 32px", fontSize: 16 }}>
              Começar Agora
            </button>
            <button className="btn-secondary" onClick={() => setPage("register")} style={{ padding: "12px 32px", fontSize: 16 }}>
              Saiba Mais
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 48, textAlign: "center" }}>Recursos</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          <div className="card">
            <div style={{ fontSize: 24, marginBottom: 12 }}>📊</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Dados Reais</h3>
            <p style={{ color: COLORS.textMuted }}>Integração com NCBI para acesso a dados genéticos verificados e atualizados.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: 24, marginBottom: 12 }}>🔒</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Autenticação Segura</h3>
            <p style={{ color: COLORS.textMuted }}>Autenticação OAuth com gerenciamento de sessão persistente.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: 24, marginBottom: 12 }}>🎯</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Interface Limpa</h3>
            <p style={{ color: COLORS.textMuted }}>Design minimalista inspirado em plataformas científicas profissionais.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", borderTop: `1px solid ${COLORS.border}`, textAlign: "center", color: COLORS.textMuted }}>
        <p>© 2026 GeneLink. Plataforma de pesquisa genética acadêmica.</p>
      </footer>
    </div>
  );
};

// ============================================================
// LOGIN PAGE
// ============================================================
const LoginPage = ({ setPage, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validação básica
    if (!email || !password) {
      setError("Email e senha são obrigatórios");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      setLoading(false);
      return;
    }

    // Simulação de login (em produção, seria uma chamada real)
    setTimeout(() => {
      onLogin({ email, name: email.split("@")[0] });
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Entrar</h1>
        <p style={{ color: COLORS.textMuted, textAlign: "center", marginBottom: 32 }}>Acesse sua conta GeneLink</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Senha</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "12px", marginTop: 8 }}>
            {loading ? <span className="loading-spinner" style={{ marginRight: 8 }} /> : null}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ color: COLORS.textMuted, marginBottom: 8 }}>
            Não tem conta? <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("register")}>Cadastre-se</span>
          </p>
          <p style={{ color: COLORS.textMuted }}>
            Esqueceu a senha? <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("forgot-password")}>Recuperar</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REGISTER PAGE
// ============================================================
const RegisterPage = ({ setPage, onLogin }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validação
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Todos os campos são obrigatórios");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email inválido");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não conferem");
      setLoading(false);
      return;
    }

    // Simulação de registro
    setTimeout(() => {
      onLogin({ email: formData.email, name: formData.name });
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Cadastro</h1>
        <p style={{ color: COLORS.textMuted, textAlign: "center", marginBottom: 32 }}>Crie sua conta GeneLink</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Nome Completo</label>
            <input
              type="text"
              name="name"
              className="input-field"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Email</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Senha</label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Confirmar Senha</label>
            <input
              type="password"
              name="confirmPassword"
              className="input-field"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "12px", marginTop: 8 }}>
            {loading ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ color: COLORS.textMuted }}>
            Já tem conta? <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("login")}>Faça login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// FORGOT PASSWORD PAGE
// ============================================================
const ForgotPasswordPage = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Recuperar Senha</h1>
        <p style={{ color: COLORS.textMuted, textAlign: "center", marginBottom: 32 }}>Enviaremos um link de recuperação para seu email</p>

        {submitted ? (
          <div className="success-message" style={{ marginBottom: 24 }}>
            ✓ Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "12px", marginTop: 8 }}>
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ color: COLORS.textMuted }}>
            <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("login")}>← Voltar para login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SEARCH PAGE
// ============================================================
const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimer = useRef(null);

  const searchGenes = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${encodeURIComponent(searchQuery)}&rettype=json&retmax=10`
      );
      const data = await response.json();

      if (data.esearchresult?.idlist?.length > 0) {
        setResults(data.esearchresult.idlist.slice(0, 5));
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Erro ao buscar genes. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      searchGenes(value);
    }, 500);
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Pesquisar Genes</h1>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            className="input-field"
            placeholder="Buscar genes (ex: TP53, BRCA1, EGFR)..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" style={{ padding: "10px 20px" }}>
            <Icon name="search" size={18} color="white" />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="loading-spinner" style={{ margin: "0 auto" }} />
          <p style={{ marginTop: 16, color: COLORS.textMuted }}>Buscando genes...</p>
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Nenhum dado disponível</div>
          <div className="empty-state-description">Nenhum gene encontrado para "{query}"</div>
        </div>
      )}

      {!loading && results.length === 0 && !query && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">Comece a pesquisar</div>
          <div className="empty-state-description">Digite o nome de um gene para começar</div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {results.map((geneId) => (
            <div key={geneId} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Gene ID: {geneId}</h3>
                  <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Dados da NCBI</p>
                </div>
                <button className="btn-secondary" style={{ padding: "8px 16px" }}>Ver Detalhes</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================
const DashboardPage = ({ user }) => {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, marginBottom: 32 }}>
        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 8 }}>👤</div>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 8 }}>Usuário</p>
          <p style={{ fontSize: 18, fontWeight: 600 }}>{user?.name || "Usuário"}</p>
        </div>
        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 8 }}>📧</div>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 8 }}>Email</p>
          <p style={{ fontSize: 18, fontWeight: 600 }}>{user?.email || "-"}</p>
        </div>
        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 8 }}>Status</p>
          <p style={{ fontSize: 18, fontWeight: 600, color: COLORS.success }}>Ativo</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Atividade Recente</h2>
        <div className="empty-state" style={{ background: COLORS.primaryLight }}>
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">Nenhum dado disponível</div>
          <div className="empty-state-description">Você ainda não realizou nenhuma pesquisa</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function GeneLink() {
  const [page, setPage] = useState("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    injectStyles();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setPage("landing");
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }}>
      <NavBar page={page} setPage={setPage} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "login" && <LoginPage setPage={setPage} onLogin={handleLogin} />}
      {page === "register" && <RegisterPage setPage={setPage} onLogin={handleLogin} />}
      {page === "forgot-password" && <ForgotPasswordPage setPage={setPage} />}
      {page === "search" && isLoggedIn && <SearchPage />}
      {page === "dashboard" && isLoggedIn && <DashboardPage user={user} />}
    </div>
  );
}
