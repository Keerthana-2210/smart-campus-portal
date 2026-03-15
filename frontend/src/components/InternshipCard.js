import React from "react";

const InternshipCard = ({ internship, onApply }) => {
    return (
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "4px" }}>
                        {internship.title}
                    </h3>
                    <span className="badge badge-purple" style={{ whiteSpace: "nowrap" }}>New</span>
                </div>

                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", WebkitLineClamp: 3, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {internship.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                        {internship.company?.name ? internship.company.name.charAt(0) : "C"}
                    </div>
                    <span style={{ fontWeight: "500" }}>{internship.company?.name || "Tech Company"}</span>
                </div>
            </div>

            {onApply && (
                <button
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "auto" }}
                    onClick={() => onApply(internship._id)}
                >
                    Apply Now
                </button>
            )}
        </div>
    );
};

export default InternshipCard;
