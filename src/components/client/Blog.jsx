import { useState, useEffect } from "react";
import { G, card } from "../../lib/constants";

export default function Blog({ ctx }) {
  const { storage } = ctx;

  const [posts, setPosts] = useState([]);
  const [openPost, setOpenPost] = useState(null);

  useEffect(() => {
    storage.getBlogPosts().then(setPosts);
  }, []);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  if (openPost) {
    const post = posts.find((p) => p.id === openPost);
    if (!post) return null;
    return (
      <div style={{ paddingBottom: 80 }}>
        <div
          style={{
            padding: "14px 18px 0",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => setOpenPost(null)}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#2D2D2D",
            }}
          >
            ‹
          </button>
          <span
            style={{ fontWeight: 800, fontSize: 16, color: "#2D2D2D", flex: 1 }}
          >
            {post.title}
          </span>
        </div>
        <div style={{ padding: "16px 18px 0" }}>
          <div style={{ fontSize: 12, color: "#bbb", marginBottom: 16 }}>
            {formatDate(post.date)}
          </div>
          <p
            style={{ fontSize: 15, color: "#444", lineHeight: 1.8, margin: 0 }}
          >
            {post.content}
          </p>
        </div>
      </div>
    );
  }

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
          Blog & Noutăți
        </h2>
        {posts.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
            <p style={{ fontSize: 14 }}>Niciun articol momentan</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setOpenPost(post.id)}
                style={{ ...card, cursor: "pointer" }}
              >
                <div style={{ fontSize: 12, color: "#bbb", marginBottom: 6 }}>
                  {formatDate(post.date)}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#2D2D2D",
                    marginBottom: 6,
                  }}
                >
                  {post.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#777",
                    lineHeight: 1.5,
                    marginBottom: 10,
                  }}
                >
                  {post.excerpt}
                </div>
                <div style={{ fontSize: 13, color: G, fontWeight: 700 }}>
                  Citește mai mult →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
