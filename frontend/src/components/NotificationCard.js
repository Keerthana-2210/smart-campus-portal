import React from "react";

const NotificationCard = ({ message, type = "info" }) => {
    return (
        <div className="glass-card" style={{
            padding: "1rem 1.5rem",
            marginBottom: "1rem",
            borderLeft: `4px solid ${type === "warning" ? "var(--warning)" : "var(--accent-secondary)"}`,
            display: "flex",
            alignItems: "center",
            gap: "1rem"
        }}>
            <div style={{ fontSize: "1.5rem" }}>
                {type === "warning" ? "⚠️" : "💡"}
            </div>
            <p style={{ color: "var(--text-primary)", fontSize: "0.95rem", margin: 0 }}>
                {message}
            </p>
        </div>
    );
};

export default NotificationCard;
