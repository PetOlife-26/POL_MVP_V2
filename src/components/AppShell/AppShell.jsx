import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AppShell.css";

/* ─────────────────────────────────
   UTILITY: Dynamic Greeting
   ───────────────────────────────── */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  return { text: "Good Evening", emoji: "🌙" };
}

/* ─────────────────────────────────
   ICONS (inline SVG)
   ───────────────────────────────── */
function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function StethoscopeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ─────────────────────────────────
   TOP BAR
   ───────────────────────────────── */
function TopBar({ userName, onAvatarClick }) {
  const greeting = getGreeting();

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <span className="greeting-text">
          {greeting.text} {greeting.emoji}
        </span>
        <span className="user-name">{userName}</span>
      </div>
      <button className="avatar-btn" onClick={onAvatarClick} aria-label="Profile">
        <UserIcon />
      </button>
    </header>
  );
}

/* ─────────────────────────────────
   BOTTOM NAVIGATION
   ───────────────────────────────── */
function BottomNav({ activeTab, onTabChange, onFabClick }) {
  const tabs = [
    { id: "home", label: "Home", icon: <HouseIcon /> },
    { id: "health", label: "Health", icon: <StethoscopeIcon /> },
    { id: "docs", label: "Docs", icon: <FolderIcon /> },
    { id: "profile", label: "Profile", icon: <ProfileIcon /> },
  ];

  return (
    <>
      <button className="fab-button" onClick={onFabClick} aria-label="Add Pet">
        <PlusIcon />
      </button>
      <nav className="bottom-nav">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            style={i === 1 ? { marginRight: 32 } : i === 2 ? { marginLeft: 32 } : {}}
          >
            {tab.icon}
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

/* ─────────────────────────────────
   APP SHELL — Reusable Layout
   ───────────────────────────────── */
export default function AppShell({ children, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("There");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const name =
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "There";
        setUserName(name);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleAvatarClick = () => {
    if (onTabChange) onTabChange("profile");
  };

  const handleFabClick = () => {
    navigate("/create-pet-profile");
  };

  return (
    <div className="app-shell">
      <TopBar userName={userName} onAvatarClick={handleAvatarClick} />

      <main className="main-content">
        {children}
      </main>

      <BottomNav
        activeTab={activeTab || "home"}
        onTabChange={onTabChange || (() => {})}
        onFabClick={handleFabClick}
      />
    </div>
  );
}
