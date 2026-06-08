import React from "react";

export default function Technology() {
  return (
    <div
      className="glass-panel"
      style={{ maxWidth: "800px", margin: "4rem auto", textAlign: "center" }}
    >
      <h2
        style={{
          color: "var(--text-main)",
          marginBottom: "1rem",
          fontSize: "2rem",
        }}
      >
        Technology
      </h2>
      <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
        Deep dive into our Quartz Crystal Microbalance (QCM) monitoring
        capabilities. (Space to add papers, whitepapers, and tech details here
        in the future.)
      </p>
    </div>
  );
}
