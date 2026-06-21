/**
 * AuthCallback.jsx
 *
 * Handles the OAuth redirect from Supabase after Google login.
 * Supabase can return tokens in two ways:
 *   1. PKCE flow: /auth/callback?code=xxx  (exchange code for session on backend)
 *   2. Implicit flow: /auth/callback#access_token=xxx&refresh_token=xxx
 *
 * This component handles both, stores the session in localStorage,
 * then navigates to /home.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing your login…");

  useEffect(() => {
    async function handleCallback() {
      try {
        // ── 1. PKCE flow: ?code=... ───────────────────────────────────────────
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");

        if (code) {
          // Exchange the code for a session via the backend
          const res = await fetch(`${API_BASE}/api/auth/callback?code=${encodeURIComponent(code)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.access_token) {
              localStorage.setItem("access_token", data.access_token);
            }
            if (data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
            }
            navigate("/home", { replace: true });
            return;
          } else {
            const err = await res.json().catch(() => ({}));
            setStatus(`Login failed: ${err.detail || "unknown error"}`);
            setTimeout(() => navigate("/login", { replace: true }), 2500);
            return;
          }
        }

        // ── 2. Implicit flow: #access_token=... ──────────────────────────────
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");

          if (accessToken) {
            localStorage.setItem("access_token", accessToken);
            // Fetch user profile with the token
            try {
              const res = await fetch(`${API_BASE}/api/auth/me`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (res.ok) {
                const userData = await res.json();
                localStorage.setItem("user", JSON.stringify(userData));
              }
            } catch (e) {
              console.warn("Could not fetch user profile:", e);
            }
            navigate("/home", { replace: true });
            return;
          }
        }

        // ── 3. No tokens found — redirect to login ───────────────────────────
        setStatus("No authentication data found. Redirecting to login…");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } catch (e) {
        console.error("Auth callback error:", e);
        setStatus("Something went wrong. Redirecting to login…");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Inter, sans-serif",
        gap: "16px",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #e5e7eb",
          borderTop: "3px solid #16a34a",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>{status}</p>
    </div>
  );
}
