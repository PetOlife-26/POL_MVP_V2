import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import AuthCallback from "./components/AuthCallback/AuthCallback";
import "./App.css";

// Lazy-loaded routes
const Homepg = lazy(() => import("./components/homepg/Homepg"));
const ProfileCreate = lazy(
  () => import("./components/profilecreation/Profilecreation"),
);
const PostIdScreen = lazy(
  () => import("./components/postidscreen/postidscreen"),
);
const PetCard = lazy(() => import("./components/petcard/petcard"));

function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Inter, sans-serif",
        color: "#9ca3af",
      }}
    >
      Loading…
    </div>
  );
}

/**
 * GlobalOAuthHandler
 *
 * Runs on EVERY page load before routing.
 * Catches Supabase OAuth tokens in the URL regardless of which path
 * Supabase redirects to (even if it ignores redirect_to and goes to root /).
 *
 * Handles:
 *   - Implicit flow: #access_token=xxx (stored directly)
 *   - PKCE flow:     ?code=xxx          (sent to /auth/callback for processing)
 */
function GlobalOAuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;

    // ── Implicit flow: tokens in hash ──────────────────────────────────────
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        // Fetch user profile in background then redirect
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
        fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((r) => r.ok ? r.json() : null)
          .then((userData) => {
            if (userData) localStorage.setItem("user", JSON.stringify(userData));
          })
          .catch(() => {})
          .finally(() => {
            window.history.replaceState(null, "", window.location.pathname);
            navigate("/home", { replace: true });
          });
        return;
      }
    }

    // ── PKCE flow: code in query string ────────────────────────────────────
    if (search && search.includes("code=")) {
      const params = new URLSearchParams(search);
      const code = params.get("code");
      if (code) {
        // Let AuthCallback handle the code exchange
        navigate(`/auth/callback${search}`, { replace: true });
        return;
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function App() {
  return (
    <Router>
      <GlobalOAuthHandler />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<Homepg />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/create-pet-profile" element={<ProfileCreate />} />
          <Route path="/post-id-success" element={<PostIdScreen />} />
          <Route path="/pet-card" element={<PetCard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
