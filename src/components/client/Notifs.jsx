import { useEffect, useState } from "react";
import { G, card } from "../../lib/constants";

const typeIcon = { order: "📦", stock: "🔔", promo: "🎉", info: "ℹ️" };

export default function Notifs({ ctx }) {
  const { notifications, setNotifications, storage } = ctx;
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    storage.markNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    const diff = Math.floor((new Date() - date) / 60000);
    if (diff < 1) return "acum";
    if (diff < 60) return `${diff} min`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return date.toLocaleDateString("ro-RO", { day: "numeric", month: "short" });
  };

  if (notifications.length === 0)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 64 }}>🔔</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D" }}>
          Nicio notificare
        </div>
        <p
          style={{
            color: "#aaa",
            fontSize: 14,
            textAlign: "center",
            margin: 0,
          }}
        >
          Vei fi anunțat când se întâmplă ceva important
        </p>
      </div>
    );

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px 18px 0" }}>
        <h2
          style={{
            margin: "0 0 16px",
            fontSize: 18,
            fontWeight: 800,
            color: "#2D2D2D",
          }}
        >
          Notificări
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map((n) => {
            const isLong = n.msg?.length > 100;
            const isOpen = expanded.has(n.id);
            const displayMsg =
              isLong && !isOpen ? n.msg.slice(0, 100) + "…" : n.msg;

            return (
              <div
                key={n.id}
                style={{
                  ...card,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  background: n.read ? "white" : "#F0F7FF",
                  borderLeft: n.read ? "none" : `3px solid ${G}`,
                  cursor: isLong ? "pointer" : "default",
                }}
                onClick={() => isLong && toggle(n.id)}
              >
                <div style={{ fontSize: 24, flexShrink: 0 }}>
                  {typeIcon[n.type] || "ℹ️"}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 13, color: "#2D2D2D", lineHeight: 1.5 }}
                  >
                    {displayMsg}
                  </div>
                  {isLong && (
                    <div
                      style={{
                        fontSize: 12,
                        color: G,
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                    >
                      {isOpen ? "Arată mai puțin ▲" : "Citește mai mult ▼"}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>
                    {formatDate(n.created_at)}
                  </div>
                </div>
                {!n.read && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: G,
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
