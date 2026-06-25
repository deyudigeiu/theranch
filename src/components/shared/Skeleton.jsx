export function SkeletonCard({ height = 80 }) {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div
        style={{
          background: "white",
          borderRadius: 18,
          height,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>
    </>
  );
}

export function SkeletonProductGrid() {
  return (
    <div
      style={{
        padding: "0 18px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} height={180} />
      ))}
    </div>
  );
}

export function SkeletonList() {
  return (
    <div
      style={{
        padding: "0 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} height={74} />
      ))}
    </div>
  );
}
