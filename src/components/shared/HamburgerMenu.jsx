export default function HamburgerMenu({ ctx }) {
  const {
    setMenu,
    setPage,
    setAdminPage,
    admin,
    viewAsClient,
    setViewAsClient,
    profile,
    menuOpen,
    signOut,
    modules,
  } = ctx;

  if (!menuOpen) return null;

  const go = (pg) => {
    setPage(pg);
    setMenu(false);
  };
  const goAdmin = (pg) => {
    setAdminPage(pg);
    setMenu(false);
  };

  const G = "#4A7C59";

  const clientItems = [
    { e: "📋", l: "Comenzile mele", a: () => go("comenzi") },
    { e: "❤️", l: "Favoritele mele", a: () => go("wishlist"), mod: "wishlist" },
    { e: "👤", l: "Profilul meu", a: () => go("profile") },
    { e: "🌾", l: "Despre fermă", a: () => go("about"), mod: "about" },
    { e: "🖼️", l: "Galerie foto", a: () => go("gallery"), mod: "gallery" },
    { e: "📹", l: "Live", a: () => go("live"), mod: "live" },
    { e: "📝", l: "Blog & Noutăți", a: () => go("blog"), mod: "blog" },
    { e: "❓", l: "Ajutor", a: () => go("help"), mod: "help" },
  ];

  const adminItems = [
    { e: "🏠", l: "Dashboard", a: () => goAdmin("dash") },
    { e: "📋", l: "Comenzi", a: () => goAdmin("orders") },
    { e: "📦", l: "Produse", a: () => goAdmin("products") },
    { e: "👥", l: "Clienți", a: () => goAdmin("clients") },
    { e: "📊", l: "Analytics", a: () => goAdmin("analytics") },
    { e: "📢", l: "Broadcast", a: () => goAdmin("broadcast") },
    { e: "🛒", l: "Coșul Lunii", a: () => goAdmin("cosBaza") },
    { e: "🚚", l: "Lista livrare", a: () => goAdmin("deliveryList") },
    { e: "🔄", l: "Abonamente", a: () => goAdmin("subscriptions") },
    { e: "⚙️", l: "Setări", a: () => goAdmin("settings") },
    { e: "✏️", l: "Conținut", a: () => goAdmin("content") },
    { e: "🌾", l: "Despre fermă", a: () => goAdmin("about") },
    { e: "📝", l: "Blog", a: () => goAdmin("blog") },
    { e: "🖼️", l: "Galerie foto", a: () => goAdmin("gallery") },
    { e: "📹", l: "Live camere", a: () => goAdmin("live") },
  ];

  const items = (admin && !viewAsClient ? adminItems : clientItems).filter(
    (item) => !item.mod || modules?.[item.mod]
  );

  const initials = (profile?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div
        onClick={() => setMenu(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "82%",
          maxWidth: 300,
          background: "white",
          zIndex: 30,
          boxShadow: "8px 0 32px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header profil */}
        <div
          style={{
            padding: "40px 22px 18px",
            borderBottom: "1px solid #f5f5f5",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: G,
              color: "white",
              fontSize: 20,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            {initials}
          </div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#2D2D2D" }}>
            {profile?.name || "—"}
          </div>
          <div style={{ color: "#aaa", fontSize: 13, marginTop: 2 }}>
            {profile?.email || ""}
          </div>
          {admin && (
            <span
              style={{
                background: viewAsClient ? "#E8F2EC" : "#FEF3CD",
                color: viewAsClient ? G : "#B45309",
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 8,
                marginTop: 8,
                display: "inline-block",
              }}
            >
              {viewAsClient ? "MOD CLIENT" : "ADMIN"}
            </span>
          )}
        </div>

        {/* Toggle admin ↔ client */}
        {admin && (
          <button
            onClick={() => {
              setViewAsClient(!viewAsClient);
              setPage("home");
              setMenu(false);
            }}
            style={{
              margin: "12px 16px 4px",
              background: viewAsClient ? "#FEF3CD" : "#E8F2EC",
              color: viewAsClient ? "#B45309" : G,
              border: "none",
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {viewAsClient ? "← Înapoi la Admin" : "👁️ Vezi ca client"}
          </button>
        )}

        <div
          style={{ height: 1, background: "#f5f5f5", margin: "8px 0 4px" }}
        />

        {/* Items */}
        {items.map((item) => (
          <button
            key={item.l}
            onClick={item.a}
            style={{
              background: "none",
              border: "none",
              padding: "13px 22px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
              fontSize: 14,
              color: "#2D2D2D",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 19 }}>{item.e}</span>
            {item.l}
          </button>
        ))}

        {/* Deconectare */}
        <button
          onClick={signOut}
          style={{
            background: "none",
            border: "none",
            padding: "15px 22px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            cursor: "pointer",
            fontSize: 14,
            color: "#DC2626",
            marginTop: "auto",
            width: "100%",
          }}
        >
          <span style={{ fontSize: 19 }}>🚪</span>Deconectare
        </button>
      </div>
    </>
  );
}
