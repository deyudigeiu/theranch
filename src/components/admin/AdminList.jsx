import { useState } from "react";
import { G, GL, card, inp, lbl, btnG } from "../../lib/constants";

export default function AdminList({ ctx }) {
  const { setAdminPage } = ctx;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div
        style={{
          padding: "14px 18px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => setAdminPage("dash")}
          style={{
            background: "none",
            border: "none",
            color: G,
            fontSize: 15,
            cursor: "pointer",
            fontWeight: 600,
            padding: 0,
          }}
        >
          ‹ Înapoi
        </button>
        <span style={{ fontWeight: 800, fontSize: 16, color: "#2D2D2D" }}>
          Listă
        </span>
      </div>
      <div
        style={{
          padding: "40px 18px",
          textAlign: "center",
          color: "#aaa",
          fontSize: 13,
        }}
      >
        Această secțiune nu este configurată.
      </div>
    </div>
  );
}
