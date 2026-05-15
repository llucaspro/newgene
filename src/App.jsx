import { useEffect, useState } from "react";
import { supabase } from "./supabase";

/*
========================================
GENELINK — VERSÃO ESTÁVEL
- Corrigido teclado fechando
- Corrigido re-render excessivo
- Estrutura organizada
- Cards clicáveis
- Busca funcional
- Preparado para Supabase
========================================
*/

const COLORS = {
  bg: "#ffffff",
  surface: "#f8f9fa",
  primary: "#0066cc",
  text: "#1a1a1a",
  textMuted: "#666666",
  border: "#e5e7eb",
};

const NCBI_BASE =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

/*
========================================
COMPONENTES FORA DO APP
========================================
*/

function IconDNA() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M2 9c6.667 6 13.333 0 20 6" />
    </svg>
  );
}

function ButtonPrimary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.primary,
        color: "white",
        border: "none",
        padding: "12px 18px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      {children}
    </button>
  );
}

function ButtonSecondary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.surface,
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        padding: "12px 18px",
        borderRadius: 8,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 20,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 12,
        borderRadius: 8,
        border: `1px solid ${COLORS.border}`,
        fontSize: 15,
      }}
    />
  );
}

/*
========================================
APP PRINCIPAL
========================================
*/

export default function App() {
  const [page, setPage] = useState("landing");

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [user, setUser] = useState(null);

  const [authMode, setAuthMode] = useState("login");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  const [search, setSearch] = useState("");

  const [genes, setGenes] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  /*
  ========================================
  CSS GLOBAL
  ========================================
  */

  useEffect(() => {
    const css = `
      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      body{
        font-family:Arial, Helvetica, sans-serif;
        background:${COLORS.bg};
        color:${COLORS.text};
      }

      button{
        transition:0.2s;
      }

      button:hover{
        opacity:0.92;
      }

      input{
        outline:none;
      }
    `;

    const style = document.createElement("style");

    style.innerHTML = css;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  /*
  ========================================
  AUTH STATE
  ========================================
  */

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ name: session.user.email.split("@")[0] });
        setIsLoggedIn(true);
        setPage("dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ name: session.user.email.split("@")[0] });
        setIsLoggedIn(true);
        setPage("dashboard");
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setPage("landing");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /*
  ========================================
  LOGIN
  ========================================
  */

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setError("");
    setSuccessMsg("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }

    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSuccessMsg("Conta criada! Verifique seu email para confirmar o cadastro.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /*
  ========================================
  BUSCA GENES
  ========================================
  */

  const searchGenes = async () => {
    if (!search.trim()) return;

    setLoading(true);

    setError("");

    setGenes([]);

    try {
      const response = await fetch(
        `${NCBI_BASE}/esearch.fcgi?db=gene&term=${encodeURIComponent(
          `${search} AND human[organism]`
        )}&retmode=json`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao buscar genes."
        );
      }

      const data = await response.json();

      const ids =
        data?.esearchresult?.idlist || [];

      if (!ids.length) {
        setError("Nenhum gene encontrado.");
        return;
      }

      const summaryResponse = await fetch(
        `${NCBI_BASE}/esummary.fcgi?db=gene&id=${ids
          .slice(0, 5)
          .join(",")}&retmode=json`
      );

      if (!summaryResponse.ok) {
        throw new Error(
          "Erro ao buscar detalhes."
        );
      }

      const summaryData =
        await summaryResponse.json();

      const results = ids
        .slice(0, 5)
        .map((id) => {
          const gene =
            summaryData?.result?.[id];

          if (!gene) return null;

          return {
            uid: gene.uid || id,
            name:
              gene.name ||
              "Gene desconhecido",
            description:
              gene.description ||
              "Sem descrição disponível.",
            organism:
              gene.organism || {},
          };
        })
        .filter(Boolean);

      setGenes(results);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Erro inesperado."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  RENDER
  ========================================
  */

  return (
    <div>
      {/* NAVBAR */}

      <nav
        style={{
          height: 70,
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "white",
        }}
      >
        <div
          onClick={() =>
            setPage("landing")
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              background:
                COLORS.primary,
              color: "white",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <IconDNA />
          </div>

          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              GeneLink
            </div>

            <div
              style={{
                color:
                  COLORS.textMuted,
                fontSize: 12,
              }}
            >
              Genomic Research
            </div>
          </div>
        </div>

        {!isLoggedIn ? (
          <ButtonPrimary
            onClick={() =>
              setPage("login")
            }
          >
            Entrar
          </ButtonPrimary>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ color: COLORS.textMuted }}>
              Olá, {user?.name}
            </div>
            <ButtonSecondary onClick={handleLogout}>
              Sair
            </ButtonSecondary>
          </div>
        )}
      </nav>

      {/* MAIN */}

      <main
        style={{
          padding: 32,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* LANDING */}

        {page === "landing" && (
          <div
            style={{
              textAlign: "center",
              marginTop: 80,
            }}
          >
            <h1
              style={{
                fontSize: 46,
                marginBottom: 20,
              }}
            >
              Plataforma de
              Pesquisa Genética
            </h1>

            <p
              style={{
                color:
                  COLORS.textMuted,
                fontSize: 18,
                maxWidth: 700,
                margin:
                  "0 auto 35px auto",
                lineHeight: 1.6,
              }}
            >
              Pesquise genes reais
              utilizando dados
              científicos oficiais do
              NCBI.
            </p>

            <ButtonPrimary
              onClick={() =>
                setPage("login")
              }
            >
              Começar
            </ButtonPrimary>
          </div>
        )}

        {/* LOGIN / SIGNUP */}

        {page === "login" && (
          <div
            style={{
              maxWidth: 420,
              margin: "50px auto",
            }}
          >
            <Card>
              {/* TAB TOGGLE */}
              <div
                style={{
                  display: "flex",
                  borderBottom: `1px solid ${COLORS.border}`,
                  marginBottom: 24,
                }}
              >
                <button
                  onClick={() => switchAuthMode("login")}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    background: "none",
                    border: "none",
                    borderBottom: authMode === "login"
                      ? `2px solid ${COLORS.primary}`
                      : "2px solid transparent",
                    color: authMode === "login" ? COLORS.primary : COLORS.textMuted,
                    fontWeight: authMode === "login" ? "bold" : "normal",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  Entrar
                </button>
                <button
                  onClick={() => switchAuthMode("signup")}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    background: "none",
                    border: "none",
                    borderBottom: authMode === "signup"
                      ? `2px solid ${COLORS.primary}`
                      : "2px solid transparent",
                    color: authMode === "signup" ? COLORS.primary : COLORS.textMuted,
                    fontWeight: authMode === "signup" ? "bold" : "normal",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  Criar Conta
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") authMode === "login" ? handleLogin() : handleSignUp();
                  }}
                />

                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") authMode === "login" ? handleLogin() : handleSignUp();
                  }}
                />

                {authMode === "signup" && (
                  <Input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSignUp();
                    }}
                  />
                )}

                {error && (
                  <div
                    style={{
                      color: "red",
                      fontSize: 14,
                      padding: "10px 12px",
                      background: "#fff5f5",
                      borderRadius: 6,
                      border: "1px solid #fecaca",
                    }}
                  >
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div
                    style={{
                      color: "#166534",
                      fontSize: 14,
                      padding: "10px 12px",
                      background: "#f0fdf4",
                      borderRadius: 6,
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    {successMsg}
                  </div>
                )}

                <ButtonPrimary
                  onClick={authMode === "login" ? handleLogin : handleSignUp}
                >
                  {loading
                    ? "Aguarde..."
                    : authMode === "login"
                    ? "Entrar"
                    : "Criar Conta"}
                </ButtonPrimary>

                <ButtonSecondary
                  onClick={() => {
                    switchAuthMode("login");
                    setPage("landing");
                  }}
                >
                  Voltar
                </ButtonSecondary>
              </div>
            </Card>
          </div>
        )}

        {/* DASHBOARD */}

        {page === "dashboard" && (
          <div>
            <div
              style={{
                marginBottom: 28,
              }}
            >
              <h2
                style={{
                  marginBottom: 10,
                }}
              >
                Pesquisa Genética
              </h2>

              <p
                style={{
                  color:
                    COLORS.textMuted,
                }}
              >
                Dados em tempo real
                do NCBI.
              </p>
            </div>

            {/* SEARCH */}

            <Card>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 240,
                  }}
                >
                  <Input
                    placeholder="Pesquisar gene..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        searchGenes();
                      }
                    }}
                  />
                </div>

                <ButtonPrimary
                  onClick={
                    searchGenes
                  }
                >
                  Pesquisar
                </ButtonPrimary>
              </div>
            </Card>

            {/* LOADING */}

            {loading && (
              <div
                style={{
                  marginTop: 20,
                  color:
                    COLORS.textMuted,
                }}
              >
                Buscando dados no
                NCBI...
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div
                style={{
                  marginTop: 20,
                  color: "red",
                }}
              >
                {error}
              </div>
            )}

            {/* RESULTS */}

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 18,
                marginTop: 24,
              }}
            >
              {genes.map((gene) => (
                <Card
                  key={gene.uid}
                  onClick={() =>
                    window.open(
                      `https://www.ncbi.nlm.nih.gov/gene/${gene.uid}`,
                      "_blank"
                    )
                  }
                >
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      flexWrap:
                        "wrap",
                      gap: 10,
                    }}
                  >
                    <h3>
                      {gene.name}
                    </h3>

                    <div
                      style={{
                        fontSize: 13,
                        color:
                          COLORS.textMuted,
                      }}
                    >
                      ID: {gene.uid}
                    </div>
                  </div>

                  <p
                    style={{
                      marginTop: 12,
                      color:
                        COLORS.textMuted,
                      lineHeight: 1.6,
                    }}
                  >
                    {gene.description}
                  </p>

                  <div
                    style={{
                      marginTop: 16,
                      fontSize: 14,
                    }}
                  >
                    <strong>
                      Organismo:
                    </strong>{" "}
                    {gene.organism
                      ?.scientificname ||
                      "Desconhecido"}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}