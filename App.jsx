import { useState, useEffect } from "react";

// Configurações
const COLORS = {
  bg: "#ffffff",
  surface: "#f8f9fa",
  primary: "#0066cc",
  primaryLight: "#e6f0ff",
  text: "#1a1a1a",
  textMuted: "#666666",
  border: "#e0e0e0",
};

const NCBI_BASE =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

const Icon = ({ name }) => {
  const icons = {
    dna: (
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
    ),
  };

  return icons[name] || null;
};

export default function App() {
  const [page, setPage] = useState("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Busca genética
  const [search, setSearch] = useState("");
  const [genes, setGenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CSS
  useEffect(() => {
    const css = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: sans-serif;
      }

      body {
        background: ${COLORS.bg};
        color: ${COLORS.text};
      }

      .btn-primary {
        background: ${COLORS.primary};
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      }

      .btn-secondary {
        background: ${COLORS.surface};
        border: 1px solid ${COLORS.border};
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
      }

      .card {
        background: white;
        border: 1px solid ${COLORS.border};
        padding: 20px;
        border-radius: 8px;
      }

      input {
        padding: 10px;
        border-radius: 6px;
        border: 1px solid ${COLORS.border};
      }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  const handleLogin = () => {
    setUser({ name: "Pesquisador" });
    setIsLoggedIn(true);
    setPage("dashboard");
  };

  // Busca real no NCBI
  const searchGenes = async () => {
    if (!search) return;

    setLoading(true);
    setError("");
    setGenes([]);

    try {
      // Primeiro busca IDs
      const searchResponse = await fetch(
        `${NCBI_BASE}/esearch.fcgi?db=gene&term=${search}&retmode=json`
      );

      const searchData = await searchResponse.json();

      const ids = searchData.esearchresult.idlist.slice(0, 5);

      if (ids.length === 0) {
        setError("Nenhum gene encontrado.");
        setLoading(false);
        return;
      }

      // Depois pega detalhes
      const summaryResponse = await fetch(
        `${NCBI_BASE}/esummary.fcgi?db=gene&id=${ids.join(",")}&retmode=json`
      );

      const summaryData = await summaryResponse.json();

      const results = ids.map((id) => summaryData.result[id]);

      setGenes(results);
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com a API do NCBI.");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        style={{
          height: 64,
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => setPage("landing")}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: COLORS.primary,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Icon name="dna" />
          </div>

          <span style={{ fontWeight: "bold", fontSize: 18 }}>
            GeneLink
          </span>
        </div>

        <div>
          {!isLoggedIn ? (
            <button
              className="btn-primary"
              onClick={() => setPage("login")}
            >
              Entrar
            </button>
          ) : (
            <span>Olá, {user.name}</span>
          )}
        </div>
      </nav>

      {/* Páginas */}
      <main style={{ padding: "40px 24px" }}>
        {page === "landing" && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            <h1 style={{ fontSize: 40, marginBottom: 20 }}>
              Plataforma de Pesquisa Genética
            </h1>

            <p
              style={{
                color: COLORS.textMuted,
                fontSize: 18,
                marginBottom: 30,
              }}
            >
              Explore dados genéticos reais utilizando a API do NCBI.
            </p>

            <button
              className="btn-primary"
              onClick={() => setPage("login")}
            >
              Começar Agora
            </button>
          </div>
        )}

        {page === "login" && (
          <div
            style={{
              maxWidth: 400,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2>Entrar no GeneLink</h2>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <input type="email" placeholder="Email" />

              <input type="password" placeholder="Senha" />

              <button
                className="btn-primary"
                onClick={handleLogin}
              >
                Entrar
              </button>

              <button
                className="btn-secondary"
                onClick={() => setPage("landing")}
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {page === "dashboard" && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ marginBottom: 20 }}>
              Pesquisa Genética
            </h2>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <input
                type="text"
                placeholder="Pesquisar gene..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />

              <button
                className="btn-primary"
                onClick={searchGenes}
              >
                Pesquisar
              </button>
            </div>

            {loading && <p>Buscando dados no NCBI...</p>}

            {error && (
              <p style={{ color: "red" }}>{error}</p>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {genes.map((gene) => (
                <div
                  key={gene.uid}
                  className="card"
                >
                  <h3>{gene.name}</h3>

                  <p
                    style={{
                      color: COLORS.textMuted,
                      marginTop: 8,
                    }}
                  >
                    {gene.description}
                  </p>

                  <p style={{ marginTop: 10 }}>
                    Organismo: {gene.organism?.scientificname}
                  </p>

                  <p>ID: {gene.uid}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}