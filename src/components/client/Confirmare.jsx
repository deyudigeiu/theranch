import { G } from "../../lib/constants";

export default function Confirmare({ ctx }) {
  const { lastOrderId, settings, setPage } = ctx;

  const phone = settings?.whatsapp?.replace(/\s/g, "") || "";
  // MINOR FIX: use dynamic farmer name instead of hardcoded "Denis"
  const farmerName = settings?.farmerName || "Denis";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", minHeight: 500, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 24, boxShadow: "0 0 0 12px #D1FAE5" }}>✓</div>

      <h2 style={{ fontSize: 24, fontWeight: 900, color: "#2D2D2D", margin: "0 0 8px" }}>Comandă plasată!</h2>

      {lastOrderId && (
        <div style={{ background: "#f9f9f9", borderRadius: 14, padding: "10px 20px", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>Număr comandă: </span>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#2D2D2D" }}>#{lastOrderId}</span>
        </div>
      )}

      <p style={{ color: "#666", fontSize: 14, lineHeight: 1.7, maxWidth: 280, margin: "0 0 32px" }}>
        {farmerName} a primit comanda ta și o va pregăti pentru livrare. Vei fi anunțat când e gata.
      </p>

      {phone && (
        <button
          onClick={() => {
            const msg = encodeURIComponent(`Bună ${farmerName}! Am plasat comanda #${lastOrderId}. Mulțumesc! 🌿`);
            window.open(`https://wa.me/${phone.replace("+", "")}?text=${msg}`);
          }}
          style={{ width: "100%", maxWidth: 300, background: "#25D366", color: "white", border: "none", borderRadius: 18, padding: "16px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
        >
          💬 Scrie-i lui {farmerName} pe WhatsApp
        </button>
      )}

      <button onClick={() => setPage("comenzi")} style={{ width: "100%", maxWidth: 300, background: "white", color: G, border: `1.5px solid ${G}`, borderRadius: 18, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
        Vezi comenzile mele
      </button>

      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#aaa", fontSize: 14, cursor: "pointer", padding: "8px" }}>
        Înapoi acasă
      </button>
    </div>
  );
}
