import { G, card } from "../../lib/constants";

export default function About({ ctx }) {
  const { aboutData, settings } = ctx;
  const about = aboutData || {};

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${G} 0%, #3a6347 100%)`,
          padding: "32px 18px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }}>🌾</div>
        <h1
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: 900,
            margin: "0 0 6px",
            fontFamily: "Georgia,serif",
          }}
        >
          {about.heroTitle || settings?.farmName || "Drăgăneasa Ranch"}
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,.8)",
            fontSize: 13,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {about.heroSubtitle ||
            settings?.tagline ||
            "Produse de la fermă, direct la tine"}
        </p>
      </div>

      <div style={{ padding: "20px 18px 0" }}>
        {/* Povestea */}
        {about.story && (
          <div style={{ ...card, marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Povestea noastră
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#555",
                lineHeight: 1.7,
              }}
            >
              {about.story}
            </p>
          </div>
        )}

        {/* Misiunea */}
        {about.mission && (
          <div style={{ ...card, marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Misiunea noastră
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#555",
                lineHeight: 1.7,
              }}
            >
              {about.mission}
            </p>
          </div>
        )}

        {/* Contact */}
        {(settings?.contactPhone || settings?.contactEmail) && (
          <div style={{ ...card }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Contact
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {settings.contactPhone && (
                <div style={{ fontSize: 13, color: "#555" }}>
                  📞 {settings.contactPhone}
                </div>
              )}
              {settings.contactEmail && (
                <div style={{ fontSize: 13, color: "#555" }}>
                  ✉️ {settings.contactEmail}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
