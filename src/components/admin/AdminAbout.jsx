import { useState, useEffect } from "react";
import { G, card, inp, lbl, btnG, sectHdr } from "../../lib/constants";

export default function AdminAbout({ ctx }) {
  const { storage, aboutData, setAboutData, showToast, setAdminPage } = ctx;

  const [hero, setHero] = useState(aboutData?.heroTitle || "");
  const [heroSub, setHeroSub] = useState(aboutData?.heroSubtitle || "");
  const [story, setStory] = useState(aboutData?.story || "");
  const [mission, setMission] = useState(aboutData?.mission || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (aboutData) {
      setHero(aboutData.heroTitle || "");
      setHeroSub(aboutData.heroSubtitle || "");
      setStory(aboutData.story || "");
      setMission(aboutData.mission || "");
    }
  }, [aboutData]);

  const save = async () => {
    setSaving(true);
    const updated = { heroTitle: hero, heroSubtitle: heroSub, story, mission };
    await storage.setConfig("about", updated);
    setAboutData(updated);
    showToast("Pagina Despre salvată", "✓");
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
          Despre fermă
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        <p style={sectHdr}>Hero (banner principal)</p>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>Titlu hero</span>
          <input
            value={hero}
            onChange={(e) => setHero(e.target.value)}
            placeholder="ex: Drăgăneasa Ranch"
            style={inp}
          />
        </label>

        <label style={{ display: "block", marginBottom: 20 }}>
          <span style={lbl}>Subtitlu hero</span>
          <input
            value={heroSub}
            onChange={(e) => setHeroSub(e.target.value)}
            placeholder="ex: Produse de la fermă, direct la tine"
            style={inp}
          />
        </label>

        <p style={sectHdr}>Povestea noastră</p>
        <label style={{ display: "block", marginBottom: 20 }}>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={5}
            placeholder="Scrie povestea fermei..."
            style={{ ...inp, resize: "vertical", fontFamily: "inherit" }}
          />
        </label>

        <p style={sectHdr}>Misiunea noastră</p>
        <label style={{ display: "block", marginBottom: 20 }}>
          <textarea
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            rows={4}
            placeholder="Scrie misiunea fermei..."
            style={{ ...inp, resize: "vertical", fontFamily: "inherit" }}
          />
        </label>

        <div style={{ ...card, marginBottom: 20, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
            ℹ️ Contactul (telefon, email) se configurează din{" "}
            <strong>Setări → Setări generale</strong>.
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          style={{ ...btnG({ opacity: saving ? 0.7 : 1 }) }}
        >
          {saving ? "Se salvează..." : "Salvează pagina"}
        </button>
      </div>
    </div>
  );
}
