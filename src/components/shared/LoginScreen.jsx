import { useState } from "react";
import { G } from "../../lib/constants";

export default function LoginScreen({ ctx }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const farmName = ctx.settings?.farmName || "Drăgăneasa Ranch";

  const handleSend = async () => {
    if (!email.includes("@")) {
      setError("Introdu un email valid");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await ctx.sendMagicLink(email);
    setLoading(false);
    if (err) {
      setError("Eroare. Încearcă din nou.");
      return;
    }
    setSent(true);
  };

  return (
    <>
      <style>{`
        @keyframes sd {
          from { opacity: 0; transform: translateY(-18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-wrap {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px 0 48px;
          min-height: 100vh;
          background: #e8e2d8;
        }
        .login-frame {
          width: 390px;
          background: #F0EBE0;
          border-radius: 46px;
          overflow: hidden;
          box-shadow: 0 32px 90px rgba(0,0,0,0.3), 0 0 0 9px #bfbcb7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 700px;
          padding: 60px 40px;
          box-sizing: border-box;
        }
        @media (max-width: 500px) {
          .login-wrap {
            padding: 0;
            background: #F0EBE0;
            align-items: center;
          }
          .login-frame {
            width: 100%;
            min-height: 100vh;
            border-radius: 0;
            box-shadow: none;
            padding: 60px 28px 40px;
          }
        }
      `}</style>

      <div className="login-wrap">
        <div className="login-frame">
          <div style={{ fontSize: 64, marginBottom: 24 }}>🌾</div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: G,
              margin: "0 0 4px",
              fontFamily: "Georgia,serif",
            }}
          >
            {farmName.split(" ")[0]}
          </h1>
          <p
            style={{
              fontSize: 11,
              color: "#aaa",
              letterSpacing: 2.5,
              textTransform: "uppercase",
              margin: "0 0 36px",
            }}
          >
            {farmName.split(" ").slice(1).join(" ") || "Ranch"}
          </p>

          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <p
                style={{
                  color: "#555",
                  fontSize: 15,
                  lineHeight: 1.6,
                  maxWidth: 280,
                }}
              >
                Link de conectare trimis la <strong>{email}</strong>. Verifică
                emailul și apasă linkul.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{
                  marginTop: 20,
                  background: "none",
                  border: "none",
                  color: G,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ← Trimite din nou
              </button>
            </div>
          ) : (
            <>
              <p
                style={{
                  color: "#666",
                  fontSize: 14,
                  textAlign: "center",
                  margin: "0 0 24px",
                  maxWidth: 280,
                  lineHeight: 1.55,
                }}
              >
                Introdu emailul tău pentru a te conecta. Vei primi un link magic
                — fără parolă.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="email@exemplu.ro"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                style={{
                  width: "100%",
                  maxWidth: 300,
                  border: error ? "1.5px solid #DC2626" : "1.5px solid #e8e8e8",
                  borderRadius: 14,
                  padding: "13px 15px",
                  fontSize: 14,
                  color: "#2D2D2D",
                  boxSizing: "border-box",
                  outline: "none",
                  fontFamily: "inherit",
                  marginBottom: 8,
                  background: "white",
                }}
              />
              {error && (
                <p style={{ color: "#DC2626", fontSize: 12, margin: "0 0 8px" }}>
                  {error}
                </p>
              )}
              <button
                onClick={handleSend}
                disabled={loading}
                style={{
                  width: "100%",
                  maxWidth: 300,
                  background: G,
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "15px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Se trimite..." : "Trimite link magic"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
