import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../AppShell/AppShell";
import PetContextCard from "../PetContextCard/PetContextCard";
import HomeDashboard from "../HomeDashboard/HomeDashboard";
import FamilyManagement from "../FamilyAccess/FamilyManagement";
import FamilyAccessCard from "../FamilyAccess/FamilyAccessCard";
import DocsDashboard from "../DocsDashboard/DocsDashboard";
import HealthTab from "../HealthTab/HealthTab";
import "./Home.css";
import heroImg from "../../assets/images/hero_welcome.png";

/* ICONS */
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PawSvg() {
  return (
    <svg className="paw-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c-1.5 0-2.8-.5-3.8-1.3-.5-.4-.8-1-1-1.6-.6-1.7.2-3.5 1.4-4.7.8-.8 1.5-1.7 2-2.7.2-.5.8-.7 1.4-.7s1.1.2 1.4.7c.5 1 1.2 1.9 2 2.7 1.2 1.2 2 3 1.4 4.7-.2.6-.5 1.2-1 1.6-1 .8-2.3 1.3-3.8 1.3zM4.5 12C3.1 12 2 10.9 2 9.5S3.1 7 4.5 7 7 8.1 7 9.5 5.9 12 4.5 12zM9 7.5C7.6 7.5 6.5 6.4 6.5 5S7.6 2.5 9 2.5s2.5 1.1 2.5 2.5S10.4 7.5 9 7.5zM15 7.5c-1.4 0-2.5-1.1-2.5-2.5S13.6 2.5 15 2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zM19.5 12c-1.4 0-2.5-1.1-2.5-2.5S18.1 7 19.5 7 22 8.1 22 9.5 20.9 12 19.5 12z" />
    </svg>
  );
}

/* HOME SECTION (Empty State) */
function HomeSection({ onAddPet }) {
  const benefits = [
    "Health Tracking",
    "Vaccination Reminders",
    "Medical Records",
    "Growth & Activity Insights",
  ];

  return (
    <div className="home-content">
      <div className="hero-illustration">
        <img src={heroImg} alt="Dog and cat illustration" />
      </div>
      <div className="welcome-message">
        <h1 className="welcome-title">Welcome to PetoLife</h1>
        <p className="welcome-subtitle">
          Track health, appointments,
          records and precious memories
          for every pet you love.
        </p>
      </div>
      <button className="primary-cta" onClick={onAddPet}>
        <PawSvg />
        Add My First Pet
      </button>
      <div className="benefits-card">
        <h3 className="benefits-title">Your pet family starts here</h3>
        <div className="benefits-list">
          {benefits.map((benefit) => (
            <div className="benefit-item" key={benefit}>
              <div className="benefit-check">
                <CheckIcon />
              </div>
              <span className="benefit-text">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* COMING SOON PAGES */
function ComingSoonPage({ title }) {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      </div>
      <h2 className="coming-soon-title">{title}</h2>
      <p className="coming-soon-text">Coming Soon</p>
    </div>
  );
}

/* MAIN HOME COMPONENT */
export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [hasPets, setHasPets] = useState(false);
  const [activePetId, setActivePetId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showFamilyMgmt, setShowFamilyMgmt] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Check for Google OAuth redirect
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
          const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
          try {
            const res = await fetch(`${API_BASE}/api/auth/me`, {
              headers: { "Authorization": `Bearer ${accessToken}` }
            });
            if (res.ok) {
              const userData = await res.json();
              localStorage.setItem("user", JSON.stringify(userData));
            }
          } catch (e) {
            console.error("Failed to fetch user profile", e);
          }
          // Clean up URL hash
          window.history.replaceState(null, "", window.location.pathname);
        }
      }

      try {
        const localUser = localStorage.getItem("user");
        const userId = localUser ? JSON.parse(localUser).id : "guest";
        setUserId(userId);
        const storedPets = JSON.parse(localStorage.getItem(`pets_${userId}`)) || [];
        setHasPets(storedPets.length > 0);

        if (storedPets.length > 0) {
          const savedActiveId = localStorage.getItem(`active_pet_id_${userId}`);
          if (savedActiveId && storedPets.find((p) => p.id === savedActiveId)) {
            setActivePetId(savedActiveId);
          } else {
            setActivePetId(storedPets[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    initAuth();
  }, []);

  const handleAddPet = () => {
    navigate("/create-pet-profile");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        if (hasPets && activePetId) {
          return <HomeDashboard activePetId={activePetId} onManageFamilyClick={() => setShowFamilyMgmt(true)} />;
        }
        return <HomeSection onAddPet={handleAddPet} />;
      case "health":
        return <HealthTab />;
      case "docs":
        return <DocsDashboard activePetId={activePetId} onTabChange={setActiveTab} />;
      case "profile":
        if (hasPets) {
          return (
            <div className="profile-tab-wrapper" style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: "100px" }}>
              <PetContextCard />
              <div style={{ padding: "16px 20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-dark)", marginBottom: "8px" }}>Household</h3>
                <FamilyAccessCard userId={userId} onManageClick={() => setShowFamilyMgmt(true)} />
              </div>
            </div>
          );
        }
        return <ComingSoonPage title="Profile" />;
      default:
        return <HomeSection onAddPet={handleAddPet} />;
    }
  };

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} hasPets={hasPets}>
      {renderContent()}
      {/* Family Management Overlay */}
      {showFamilyMgmt && userId && (
        <FamilyManagement userId={userId} onClose={() => setShowFamilyMgmt(false)} />
      )}
    </AppShell>
  );
}
