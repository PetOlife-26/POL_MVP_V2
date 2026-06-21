import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../AppShell/AppShell";
import FamilyManagement from "../FamilyAccess/FamilyManagement";
import FamilyAccessCard from "../FamilyAccess/FamilyAccessCard";
import MedicalRecords from "../medical/MedicalRecords";
import PetCard from "../petcard/petcard";
import HealthTab from "../HealthTab/HealthTab";
import "./Home.css";
import heroImg from "../../assets/images/hero_welcome.png";

/* ── ICONS ── */
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

/* ── PROFILE COMPLETION RING ── */
function CompletionRing({ percent, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  let ringColor = "#ef4444";
  if (percent >= 100) ringColor = "#22c55e";
  else if (percent >= 50) ringColor = "#f59e0b";
  else ringColor = "#0D5C5C";

  return (
    <div className="completion-ring-wrap">
      <svg className="completion-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#f0f1f3" strokeWidth={strokeWidth}
        />
        <circle
          className="completion-ring-progress"
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={ringColor} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="completion-ring-label">
        <span className="completion-percent">{percent}%</span>
        <span className="completion-text">Complete</span>
      </div>
    </div>
  );
}

/* ── PROFILE COMPLETION STEP ── */
function CompletionStep({ number, title, description, isDone, isCurrent, ctaLabel, onCta }) {
  return (
    <div className={`completion-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
      <div className={`step-indicator ${isDone ? 'done' : ''}`}>
        {isDone ? <CheckIcon /> : <span>{number}</span>}
      </div>
      <div className="step-content">
        <h4 className="step-title">{title}</h4>
        <p className="step-desc">{description}</p>
        {isCurrent && ctaLabel && (
          <button className="step-cta" onClick={onCta}>{ctaLabel}</button>
        )}
      </div>
    </div>
  );
}

/* ── MEDICAL RECORDS PROMOTION BANNER ── */
function MedicalBanner({ onUpload }) {
  return (
    <motion.div
      className="medical-banner"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="medical-banner-icon">📋</div>
      <div className="medical-banner-content">
        <h4>Complete Your Pet's Medical Profile</h4>
        <p>Upload vaccination records, prescriptions, and lab reports to unlock 100% profile completion.</p>
      </div>
      <button className="medical-banner-btn" onClick={onUpload}>
        Upload Now
      </button>
    </motion.div>
  );
}

/* ── HOME SECTION (Empty State / Completion Tracker) ── */
function HomeSection({ onAddPet, hasPets, hasMedical, onUploadMedical }) {
  const completionPercent = hasMedical ? 100 : hasPets ? 70 : 20;

  const steps = [
    {
      title: "Create Account",
      description: "Sign up and join PetOLife",
      isDone: true,
      isCurrent: false,
    },
    {
      title: "Add Your Pet",
      description: "Create a health profile for your furry friend",
      isDone: hasPets,
      isCurrent: !hasPets,
      ctaLabel: "Add My First Pet",
      onCta: onAddPet,
    },
    {
      title: "Upload Medical Records",
      description: "Complete your pet's digital health vault",
      isDone: hasMedical,
      isCurrent: hasPets && !hasMedical,
      ctaLabel: "Upload Records",
      onCta: onUploadMedical,
    },
  ];

  return (
    <div className="home-content">
      {hasPets && (
        <div style={{ marginBottom: "24px" }}>
          <PetCard />
        </div>
      )}
      {/* Completion Ring */}
      <motion.div
        className="completion-hero"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CompletionRing percent={completionPercent} />
        <h2 className="completion-hero-title">
          {completionPercent === 100
            ? "🎉 Profile Complete!"
            : completionPercent >= 70
            ? "Almost there!"
            : "Let's get started"}
        </h2>
        <p className="completion-hero-sub">
          {completionPercent === 100
            ? "Your pet's health identity is fully set up."
            : completionPercent >= 70
            ? "Upload medical records to complete your pet's health vault."
            : "Create a pet profile to begin tracking health & wellness."}
        </p>
      </motion.div>

      {/* Steps */}
      <div className="completion-steps-card">
        <h3 className="completion-steps-heading">Profile Setup</h3>
        {steps.map((step, i) => (
          <CompletionStep
            key={i}
            number={i + 1}
            title={step.title}
            description={step.description}
            isDone={step.isDone}
            isCurrent={step.isCurrent}
            ctaLabel={step.ctaLabel}
            onCta={step.onCta}
          />
        ))}
      </div>

      {/* Medical banner (show when pet exists but no medical records) */}
      {hasPets && !hasMedical && (
        <MedicalBanner onUpload={onUploadMedical} />
      )}

      {/* Welcome illustration for new users */}
      {!hasPets && (
        <motion.div
          className="welcome-illustration"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="hero-illustration">
            <img src={heroImg} alt="Dog and cat illustration" />
          </div>
          <div className="welcome-message">
            <h1 className="welcome-title">Welcome to PetoLife</h1>
            <p className="welcome-subtitle">
              Track health, appointments, records and precious memories for every pet you love.
            </p>
          </div>
          <button className="primary-cta" onClick={onAddPet}>
            <PawSvg />
            Add My First Pet
          </button>
          <div className="benefits-card">
            <h3 className="benefits-title">Your pet family starts here</h3>
            <div className="benefits-list">
              {["Health Tracking", "Vaccination Reminders", "Medical Records", "Growth & Activity Insights"].map((benefit) => (
                <div className="benefit-item" key={benefit}>
                  <div className="benefit-check"><CheckIcon /></div>
                  <span className="benefit-text">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 100% celebration */}
      {completionPercent === 100 && (
        <motion.div
          className="completion-celebrate"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="celebrate-icon">🏆</div>
          <h3>Congratulations!</h3>
          <p>Your pet's health identity is fully set up. Explore all features from the tabs below.</p>
        </motion.div>
      )}
    </div>
  );
}

/* ── MAIN HOME COMPONENT ── */
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");
  const [hasPets, setHasPets] = useState(false);
  const [hasMedicalRecords, setHasMedicalRecords] = useState(false);
  const [activePetId, setActivePetId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showFamilyMgmt, setShowFamilyMgmt] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      // Check for Google OAuth redirect
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
          const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
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
          window.history.replaceState(null, "", window.location.pathname);
        }
      }

      try {
        const localUser = localStorage.getItem("user");
        const userId = localUser ? JSON.parse(localUser).id : "guest";
        setUserId(userId);
        const storedPets = JSON.parse(localStorage.getItem(`pets_${userId}`)) || [];
        setPets(storedPets);
        const petsExist = storedPets.length > 0;
        setHasPets(petsExist);

        // Check medical records flag
        const medFlag = localStorage.getItem(`has_medical_${userId}`);
        setHasMedicalRecords(medFlag === 'true');

        if (petsExist) {
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

  // Handle tab hint from PostIdScreen navigation
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      // Clean up state so it doesn't persist on refresh
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [location.state]);

  const handleAddPet = () => {
    navigate("/create-pet-profile");
  };

  const handleUploadMedical = () => {
    setActiveTab("docs");
  };

  // When MedicalRecords uploads a record, set the completion flag
  const handleSetMedicalRecords = (updater) => {
    setMedicalRecords((prev) => {
      const newRecords = typeof updater === 'function' ? updater(prev) : updater;
      if (newRecords.length > 0 && userId) {
        localStorage.setItem(`has_medical_${userId}`, 'true');
        setHasMedicalRecords(true);
      }
      return newRecords;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeSection
            onAddPet={handleAddPet}
            hasPets={hasPets}
            hasMedical={hasMedicalRecords}
            onUploadMedical={handleUploadMedical}
          />
        );
      case "health":
        return <HealthTab />;
      case "docs":
        return (
          <MedicalRecords
            records={medicalRecords}
            setRecords={handleSetMedicalRecords}
            pets={pets}
            activePetId={activePetId}
          />
        );
      case "profile":
        if (hasPets) {
          return (
            <div className="profile-tab-wrapper" style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: "100px" }}>
              <PetCard />
              <div style={{ padding: "16px 20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-dark, #111827)", marginBottom: "8px" }}>Household</h3>
                <FamilyAccessCard userId={userId} onManageClick={() => setShowFamilyMgmt(true)} />
              </div>
            </div>
          );
        }
        return (
          <div className="coming-soon-page">
            <div className="coming-soon-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="coming-soon-title">Profile</h2>
            <p className="coming-soon-text">Create a pet profile first to see your pet's details here.</p>
          </div>
        );
      default:
        return (
          <HomeSection
            onAddPet={handleAddPet}
            hasPets={hasPets}
            hasMedical={hasMedicalRecords}
            onUploadMedical={handleUploadMedical}
          />
        );
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
