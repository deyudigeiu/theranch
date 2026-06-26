import { useState, useEffect } from "react";
import { G, card, inp, lbl, btnG, sectHdr } from "../../lib/constants";

const MODULES = [
  { key: "blog", label: "Blog" },
  { key: "gallery", label: "Galerie foto" },
  { key: "live", label: "Camere live" },
  { key: "about", label: "Despre noi" },
  { key: "help", label: "Ajutor" },
  { key: "wishlist", label: "Wishlist clienți" },
  { key: "reviews", label: "Recenzii produse" },
  { key: "cosBaza", label: "Coșul Lunii" },
];

export default function AdminContent({ ctx }) {
  const {
    storage,
    modules,
    setModules,
    bannerText,
    setBannerText,
    welcomeMsg,
    setWelcomeMsg,
    showToast,
    setAdminPage,
  } = ctx;

  const [mods, setMods] = useState(modules || {});
  const [banner, setBanner] = useState(bannerText || "");
  const [welcome, setWelcome] = useState(welcomeMsg || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (modules) setMods(modules); }, [modules]);
  useEffect(() => { if (bannerText) setBanner(bannerText); }, [bannerText]);
  useEffect(() => { if (welcomeMsg) setWelcome(welcomeMsg); }, [welcomeMsg]);

  const toggleModule = (key) => {
    setMods((m) => ({ ...m, [key]: !m[key] }));
  };

  const saveAll = async () => {
    setSaving(true);
    await Promise.all([
      storage.setConfig("modules", mods),
      storage.setConfig("bannerText", banner),
      storage.setConfig("welcomeMsg", welcome),
    ]);
    setModules(mods);
    setBannerText(banner);
    setWelcomeMsg(welcome);
    showToast("Conținut salvat", "✓");
    setSaving(false);
  };

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
          Conținut
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        <p style={sectHdr}>Texte afișate clienților</p>

        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={lbl}>Banner livrare (pagina principală)</span>
          <textarea
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            rows={2}
            placeholder="ex: Livrare 15 iunie · Comandă până pe 12 iunie"
            style={{ ...inp, resize: "vertical", fontFamily: "inherit" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 20 }}>
          <span style={lbl}>Mesaj de bun venit (Denis → clienți)</span>
          <textarea
            value={welcome}
            onChange={(e) => setWelcome(e.target.value)}
            rows={3}
            placeholder="ex: Bună ziua! Bienvenidos la Drăgăneasa Ranch 🌿"
            style={{ ...inp, resize: "vertical", fontFamily: "inherit" }}
          />
        </label>

        <p style={sectHdr}>Module active</p>
        <div style={{ ...card, padding: "6px 16px" }}>
          {MODULES.map(({ key, label }, i) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 0",
                borderBottom:
                  i < MODULES.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              <span style={{ fontSize: 14, color: "#2D2D2D" }}>{label}</span>
              <button
                onClick={() => toggleModule(key)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  background: mods[key] ? G : "#ccc",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: mods[key] ? 25 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {(!mods.blog || !mods.gallery || !mods.live) && (
          <div
            style={{
              background: "#FEF3C7",
              borderRadius: 12,
              padding: "10px 14px",
              marginTop: 12,
            }}
          >
            <span style={{ fontSize: 12, color: "#92400E" }}>
              ⚠️ Module dezactivate:{" "}
              {MODULES.filter((m) => !mods[m.key])
                .map((m) => m.label)
                .join(", ")}
            </span>
          </div>
        )}

        <button
          onClick={saveAll}
          disabled={saving}
          style={{ ...btnG({ marginTop: 20, opacity: saving ? 0.7 : 1 }) }}
        >
          {saving ? "Se salvează..." : "Salvează tot"}
        </button>
      </div>
    </div>
  );
}
