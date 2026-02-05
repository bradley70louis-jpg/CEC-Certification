import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

/**
 * 🧾 Central Ad Box configuration
 * ➡ Add or remove advertisers here only.
 */
const adBoxes = [
  {
    title: "BES Group (electrical)",
    link: "https://besgroup.com/services/electrical/",
    background: "linear-gradient(135deg, #004080, #0073e6)",
  },
  {
    title: "Advertise Here",
    link: "https://example.com/right-ad",
    background: "linear-gradient(135deg, #004080, #0073e6)",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "20px",
          minHeight: "90vh",
          background: "linear-gradient(to bottom right, #e6f0ff, #ffffff)",
          padding: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* 📢 Left Ad Box */}
        <AdBox {...adBoxes[0]} />

        {/* 🏡 HERO SECTION */}
        <div
          style={{
            flex: "2 1 420px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            position: "relative",
          }}
        >
          {/* 🔐 Login / Signup icons (above heading) */}
          <div
            style={{
              width: "100%",
              maxWidth: 720,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={navBtn}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
              aria-label="Login"
            >
              <span style={{ fontSize: 18 }}>🔐</span>
              <span style={{ fontWeight: 700 }}>Login</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              style={navBtnPrimary}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
              aria-label="Sign up"
            >
              <span style={{ fontSize: 18 }}>✨</span>
              <span style={{ fontWeight: 800 }}>Sign Up</span>
            </button>
          </div>

          <h1
            style={{
              fontSize: "2.5rem",
              color: "#004080",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Welcome to CEC Certification
          </h1>

          {/* 🪄 3D Logo */}
          <div style={{ perspective: "1000px", marginBottom: "15px" }}>
            <img
              src={logo}
              alt="CEC Certification Logo"
              style={{
                maxWidth: "400px",
                width: "90%",
                transform: "rotateY(0deg) translateZ(0px)",
                transition: "transform 0.5s ease",
                filter:
                  "drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2)) drop-shadow(0px 15px 25px rgba(0, 0, 0, 0.1))",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "rotateY(10deg) translateZ(20px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "rotateY(0deg) translateZ(0px)";
              }}
            />
          </div>

          <p
            style={{
              fontSize: "1.2rem",
              color: "#333",
              maxWidth: "600px",
              textAlign: "center",
              fontStyle: "italic",
              marginBottom: "30px",
            }}
          >
            “Electrical certification made by electricians for electricians”
          </p>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#333",
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            The platform designed for all professional electrical certification and compliance.
          </p>
        </div>

        {/* 📢 Right Ad Box */}
        <AdBox {...adBoxes[1]} />
      </div>
    </div>
  );
}

/**
 * 📢 Reusable 3D Ad Box Component
 */
function AdBox({ title, link, background }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        flex: "1 1 300px",
        minHeight: "400px",
        background: background || "linear-gradient(135deg, #004080, #0073e6)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "12px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25), 0 20px 40px rgba(0, 0, 0, 0.15)",
        fontSize: "2rem",
        textAlign: "center",
        cursor: "pointer",
        textDecoration: "none",
        perspective: "800px",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-10px) rotateY(5deg)";
        e.currentTarget.style.boxShadow =
          "0 20px 40px rgba(0, 0, 0, 0.35), 0 30px 60px rgba(0, 0, 0, 0.25)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0px) rotateY(0deg)";
        e.currentTarget.style.boxShadow =
          "0 10px 20px rgba(0, 0, 0, 0.25), 0 20px 40px rgba(0, 0, 0, 0.15)";
      }}
    >
      <div
        style={{
          position: "relative",
          fontWeight: "bold",
          textTransform: "uppercase",
          animation: "floatText 5s ease-in-out infinite alternate",
          padding: "20px",
        }}
      >
        {title}
      </div>

      <style>
        {`
          @keyframes floatText {
            0% { transform: translateX(0px) rotateY(0deg); }
            50% { transform: translateX(15px) rotateY(10deg); }
            100% { transform: translateX(-15px) rotateY(-10deg); }
          }
        `}
      </style>
    </a>
  );
}

/* --- styles for the new buttons --- */
const navBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 16px",
  borderRadius: 12,
  border: "1px solid rgba(0,64,128,0.25)",
  background: "rgba(255,255,255,0.75)",
  color: "#004080",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
  backdropFilter: "blur(6px)",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
};

const navBtnPrimary = {
  ...navBtn,
  background: "linear-gradient(135deg, #004080, #0073e6)",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.25)",
};
