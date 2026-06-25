import { G, bs } from "../../lib/constants";

export default function QA({ pid, cart, addToCart, setCartQty }) {
  const q = Array.isArray(cart)
    ? cart.find((i) => i.product_id === pid)?.qty || 0
    : cart?.[pid] || 0;

  const stop = (e) => e.stopPropagation();

  if (q > 0)
    return (
      <div
        onClick={stop}
        style={{ display: "flex", alignItems: "center", gap: 4 }}
      >
        <button
          onClick={() => setCartQty(pid, q - 1)}
          style={bs("#f0f0f0", "#333")}
        >
          −
        </button>
        <span
          style={{
            fontWeight: 800,
            fontSize: 14,
            minWidth: 18,
            textAlign: "center",
            color: "#2D2D2D",
          }}
        >
          {q}
        </span>
        <button onClick={() => setCartQty(pid, q + 1)} style={bs(G, "white")}>
          +
        </button>
      </div>
    );

  return (
    <button
      onClick={(e) => {
        stop(e);
        addToCart(pid, 1);
      }}
      style={{
        width: 34,
        height: 34,
        borderRadius: 12,
        background: G,
        border: "none",
        color: "white",
        fontSize: 22,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      +
    </button>
  );
}
