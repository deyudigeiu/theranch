import { GL } from "../../lib/constants";

const isUrl = (s) =>
  s &&
  typeof s === "string" &&
  (s.startsWith("http") || s.startsWith("data:image"));

export default function ImgBox({ src, size = 46, bg = GL, radius = 14 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {isUrl(src) ? (
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: size * 0.6 }}>{src}</span>
      )}
    </div>
  );
}

export { isUrl };
