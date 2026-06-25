import { useState, useEffect } from "react";
import { G, GL, card } from "../../lib/constants";

export default function Live({ ctx }) {
  const { storage } = ctx;
  const [cams, setCams] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    storage.getConfig().then((rows) => {
      const cfg = {};
      (rows || []).forEach((r) => {
        cfg[r.key] = r.value;
      });
      setCams(cfg.liveCams || []);
    });
  }, []);

  if (cams.length === 0)
    return (
      <div
        style={{ paddingBottom: 80, padding: "48px 24px", textAlign: "center" }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>📹</div>
        <p style={{ color: "#bbb", fontSize: 14 }}>
          Nicio cameră live configurată momentan
        </p>
      </div>
    );

  const cam = cams[active];

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
          Live la fermă
        </h2>

        {/* Player */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            background: "#000",
            aspectRatio: "16/9",
            marginBottom: 12,
          }}
        >
          <iframe
            src={cam.url}
            title={cam.name}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "#2D2D2D",
            marginBottom: 4,
          }}
        >
          {cam.name}
        </div>
        {cam.desc && (
          <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
            {cam.desc}
          </div>
        )}

        {/* Selector camere */}
        {cams.length > 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cams.map((c, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  ...card,
                  textAlign: "left",
                  border: `2px solid ${active === i ? G : "transparent"}`,
                  cursor: "pointer",
                  background: active === i ? GL : "white",
                  padding: "10px 14px",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: active === i ? G : "#2D2D2D",
                  }}
                >
                  📹 {c.name}
                </div>
                {c.desc && (
                  <div style={{ fontSize: 11, color: "#aaa" }}>{c.desc}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
