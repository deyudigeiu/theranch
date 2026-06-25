export const G = "#4A7C59";
export const GL = "#E8F2EC";
export const BG = "#F0EBE0";
export const DK = "#2D2D2D";

export const SC = {
  Nouă: { bg: "#EEF2FE", c: "#3B4FCC" },
  "În procesare": { bg: "#FEF3CD", c: "#B45309" },
  Pregătită: { bg: "#ECFDF5", c: "#059669" },
  Livrată: { bg: "#F0FDF4", c: "#15803D" },
  Anulată: { bg: "#FEF2F2", c: "#DC2626" },
};

export const bs = (bg, c) => ({
  width: 28,
  height: 28,
  borderRadius: 9,
  background: bg,
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: c,
  fontWeight: 600,
});

export const inp = {
  width: "100%",
  border: "1.5px solid #e8e8e8",
  borderRadius: 14,
  padding: "13px 15px",
  fontSize: 14,
  color: "#2D2D2D",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
};

export const btnG = (extra = {}) => ({
  width: "100%",
  background: "#4A7C59",
  color: "white",
  border: "none",
  borderRadius: 18,
  padding: "16px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  ...extra,
});

export const btnGhost = (extra = {}) => ({
  width: "100%",
  background: "white",
  color: "#4A7C59",
  border: "1.5px solid #4A7C59",
  borderRadius: 18,
  padding: "14px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  ...extra,
});

export const card = {
  background: "white",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

export const lbl = {
  fontSize: 13,
  fontWeight: 700,
  color: "#555",
  display: "block",
  marginBottom: 7,
};

export const sectHdr = {
  margin: "0 0 12px",
  fontSize: 11,
  fontWeight: 700,
  color: "#bbb",
  letterSpacing: 1.2,
  textTransform: "uppercase",
};
