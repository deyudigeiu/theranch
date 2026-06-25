import { useState, useEffect } from "react";

export default function Gallery({ ctx }) {
  const { storage } = ctx;
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    storage.getConfig().then((rows) => {
      const cfg = {};
      (rows || []).forEach((r) => {
        cfg[r.key] = r.value;
      });
      setPhotos(cfg.gallery || []);
    });
  }, []);

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
          Galerie foto
        </h2>

        {photos.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
            <p style={{ fontSize: 14 }}>Nicio fotografie momentan</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 6,
            }}
          >
            {photos.map((photo, i) => (
              <div
                key={i}
                onClick={() => setOpen(photo)}
                style={{
                  aspectRatio: "1",
                  overflow: "hidden",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: "#f0f0f0",
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          onClick={() => setOpen(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <img
            src={open.url}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              borderRadius: 12,
              objectFit: "contain",
            }}
          />
          {open.caption && (
            <p
              style={{
                color: "rgba(255,255,255,.8)",
                fontSize: 13,
                marginTop: 12,
              }}
            >
              {open.caption}
            </p>
          )}
          <p style={{ color: "#aaa", fontSize: 12, marginTop: 8 }}>
            Atinge pentru a închide
          </p>
        </div>
      )}
    </div>
  );
}
