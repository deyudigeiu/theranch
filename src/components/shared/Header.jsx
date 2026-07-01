import { G, GL } from "../../lib/constants";

export default function Header({ ctx }) {
  // MINOR FIX #1: folosește settings.farmName în loc de "Drăgăneasa Ranch" hardcodat
  const { setMenu, setPage, cartCount, notifCount, admin, viewAsClient, setNotifOpen, settings } = ctx;

  const showAdmin = admin && !viewAsClient;

  const farmName = settings?.farmName || "Drăgăneasa";

  return (
    <div
      style={{
        background: "white",
        padding: "6px 18px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Hamburger */}
      <button
        onClick={() => setMenu(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 22,
              height: 2.5,
              background: "#2D2D2D",
              borderRadius: 2,
            }}
          />
        ))}
      </button>

      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 9,
            color: "#bbb",
            letterSpacing: 2.5,
            textTransform: "uppercase",
            marginBottom: 1,
          }}
        >
          Ferma
        </div>
        <div
          style={{
            fontWeight: 900,
            color: G,
            letterSpacing: "-0.5px",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 19,
            fontStyle: "italic",
            lineHeight: 1,
          }}
        >
          {farmName}
        </div>
      </div>

      {/* Dreapta: bell + cos / admin */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Bell */}
        <button
          onClick={() => setNotifOpen(true)}
          style={{
            background: notifCount > 0 ? "#FEF2F2" : GL,
            border: "none",
            cursor: "pointer",
            padding: "7px 10px",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            gap: 4,
            position: "relative",
          }}
        >
          <span style={{ fontSize: 18 }}>{notifCount > 0 ? "🔔" : "🔕"}</span>
          {notifCount > 0 && (
            <span
              style={{
                background: "#DC2626",
                color: "white",
                fontSize: 10,
                fontWeight: 800,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
              }}
            >
              {notifCount}
            </span>
          )}
        </button>

        {/* Cos sau Admin */}
        {showAdmin ? (
          <span
            style={{
              background: "#FEF3CD",
              color: "#B45309",
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 8,
            }}
          >
            ADMIN
          </span>
        ) : (
          <button
            onClick={() => setPage("cos")}
            style={{
              background: GL,
              border: "none",
              cursor: "pointer",
              padding: "7px 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 19 }}>🛒</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: G,
                  color: "white",
                  fontSize: 10,
                  fontWeight: 800,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
