import { DK } from "../../lib/constants";

export default function Toast({ toast }) {
  if (!toast) return null;
  const msg = typeof toast === "string" ? toast : toast.msg;
  const icon =
    typeof toast === "string" ? "✅" : toast.type || toast.icon || "✅";

  return (
    <div
      className="t-in"
      style={{
        position: "absolute",
        top: 88,
        left: 16,
        right: 16,
        background: DK,
        color: "white",
        borderRadius: 16,
        padding: "13px 18px",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 14,
        fontWeight: 600,
        boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {msg}
    </div>
  );
}
