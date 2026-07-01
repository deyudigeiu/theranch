import { G } from "../../lib/constants";

const TYPE_ICON = {
  order: "📦",
  stock: "🌿",
  promo: "🏷️",
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "acum";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}z`;
}

export default function NotifPanel({ ctx }) {
  const {
    notifications,
    notifOpen,
    setNotifOpen,
    markNotifRead,
    markAllNotifsRead,
    notifCount,
    deleteNotif,
    deleteAllNotifs,
  } = ctx;

  if (!notifOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setNotifOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 200,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(100vw, 400px)",
          background: "white",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 18px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#2D2D2D" }}>
              Notificări
            </span>
            {notifCount > 0 && (
              <span
                style={{
                  background: "#DC2626",
                  color: "white",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: 8,
                }}
              >
                {notifCount} noi
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {notifCount > 0 && (
              <button
                onClick={markAllNotifsRead}
                style={{
                  background: "none",
                  border: "none",
                  color: G,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                Toate citite
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={deleteAllNotifs}
                style={{
                  background: "none",
                  border: "none",
                  color: "#DC2626",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                Șterge toate
              </button>
            )}
            <button
              onClick={() => setNotifOpen(false)}
              style={{
                background: "#f5f5f5",
                border: "none",
                borderRadius: 10,
                width: 32,
                height: 32,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Lista */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "64px 24px",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 48 }}>🔕</span>
              <span style={{ color: "#bbb", fontSize: 14 }}>
                Nicio notificare
              </span>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 18px",
                  borderBottom: "1px solid #f5f5f5",
                  background: n.read ? "white" : "#F0FDF4",
                  transition: "background 0.2s",
                }}
              >
                {/* Icon */}
                <div
                  onClick={() => !n.read && markNotifRead(n.id)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: n.read ? "#f5f5f5" : "#DCFCE7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                    cursor: n.read ? "default" : "pointer",
                  }}
                >
                  {TYPE_ICON[n.type] || "📢"}
                </div>

                {/* Continut */}
                <div
                  onClick={() => !n.read && markNotifRead(n.id)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    cursor: n.read ? "default" : "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: "#2D2D2D",
                      fontWeight: n.read ? 400 : 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {n.msg}
                  </div>
                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>
                    {timeAgo(n.created_at)}
                  </div>
                </div>

                {/* Buton stergere */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotif(n.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ccc",
                    fontSize: 18,
                    cursor: "pointer",
                    padding: "0 2px",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                  title="Șterge notificarea"
                >
                  ×
                </button>

                {/* Indicator necitit */}
                {!n.read && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: G,
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
