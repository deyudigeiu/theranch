import { G } from "../../lib/constants";

export default function TabBar({ ctx }) {
  const { setPage, page, cartCount, modules } = ctx;

  const tabs = [
    { id: "home", e: "🏠", l: "Acasă" },
    { id: "produse", e: "🛍️", l: "Produse" },
    ...(modules?.live ? [{ id: "live", e: "📹", l: "Live" }] : []),
    { id: "cos", e: "🛒", l: "Coș", badge: cartCount },
  ];

  const tabId =
    page === "home"
      ? "home"
      : ["produse", "detail"].includes(page)
      ? "produse"
      : ["cos", "checkout", "confirmare"].includes(page)
      ? "cos"
      : page === "live"
      ? "live"
      : null;

  return (
    <div
      style={{
        background: "white",
        padding: "10px 0 22px",
        display: "flex",
        borderTop: "1px solid #f0f0f0",
        flexShrink: 0,
      }}
    >
      {tabs.map((tab) => {
        const on = tab.id === tabId;
        return (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 0",
              color: on ? G : "#ccc",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.e}</span>
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 400 }}>
              {tab.l}
            </span>
            {tab.badge > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  right: "24%",
                  background: "#E53935",
                  color: "white",
                  fontSize: 9,
                  fontWeight: 800,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tab.badge}
              </span>
            )}
            {on && (
              <div
                style={{ width: 22, height: 3, background: G, borderRadius: 2 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
