import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../AppShell/AppShell";
import PetContextCard from "../PetContextCard/PetContextCard";
import "./Home.css";
import heroImg from "../../assets/images/hero_welcome.png";

/* ─────────────────────────────────
   ICONS
   ───────────────────────────────── */
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

/* ─────────────────────────────────
   HOME SECTION (Empty State)
   ───────────────────────────────── */
function HomeSection({ onAddPet }) {
  const benefits = [
    "Health Tracking",
    "Vaccination Reminders",
    "Medical Records",
    "Growth & Activity Insights",
  ];

  return (
    <div className="home-content">
      {/* Hero Illustration */}
      <div className="hero-illustration">
        <img src={heroImg} alt="Dog and cat illustration" />
      </div>

      {/* Welcome Message */}
      <div className="welcome-message">
        <h1 className="welcome-title">Welcome to PetoLife</h1>
        <p className="welcome-subtitle">
          Track health, appointments,
          records and precious memories
          for every pet you love.
        </p>
      </div>

      {/* Primary CTA */}
      <button className="primary-cta" onClick={onAddPet}>
        <PawSvg />
        Add My First Pet
      </button>

      {/* Benefits Card */}
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

/* ─────────────────────────────────
   COMING SOON PAGES
   ───────────────────────────────── */
function ComingSoonPage({ emoji, title }) {
  return (
    <div className="coming-soon-page">
      <span className="coming-soon-emoji">{emoji}</span>
      <h2 className="coming-soon-title">{title}</h2>
      <p className="coming-soon-text">Coming Soon</p>
    </div>
  );
}

/* ─────────────────────────────────
   MAIN HOME COMPONENT
   ───────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [hasPets, setHasPets] = useState(false);

  useEffect(() => {
    try {
      const localUser = localStorage.getItem("user");
      const userId = localUser ? JSON.parse(localUser).id : "guest";
      const storedPets = JSON.parse(localStorage.getItem(`pets_${userId}`)) || [];
      setHasPets(storedPets.length > 0);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddPet = () => {
    navigate("/create-pet-profile");
  };

  // Render tab content
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        if (hasPets) {
          return (
            <>
              <PetContextCard />
              <ComingSoonPage emoji="📊" title="Dashboard" />
            </>
          );
        }
        return <HomeSection onAddPet={handleAddPet} />;
      case "health":
        return <ComingSoonPage emoji="🩺" title="Health" />;
      case "docs":
        return <ComingSoonPage emoji="📁" title="Documents" />;
      case "profile":
        return <ComingSoonPage emoji="👤" title="Profile" />;
      default:
        return <HomeSection onAddPet={handleAddPet} />;
    }
  };

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AppShell>
  );
}
