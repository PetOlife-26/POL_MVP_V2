import React, { useState } from "react";
import "./HomeScreen.css";
import { useNavigate } from "react-router-dom";


import TopNav      from "../TopNav/TopNav";
import HeroSection from "../HeroSection/HeroSection";
import AddPetCard  from "../AddPetCard/AddPetCard";
import HealthBanner from "../HealthBanner/HealthBanner";
import BottomNav   from "../BottomNav/BottomNav";
import ChecklistPage from "../../Checklist/Checklistpage/Checklistpage";

/**
 * HomeScreen — root screen that wires all components together.
 *
 * Props:
 *   logoSrc  — path to your PetOlife wordmark image
 *   heroSrc  — path to your dog+cat illustration
 *
 * Usage in App.jsx:
 *   import petolifeLogo from "./assets/petolife-logo.png";
 *   import heroPets     from "./assets/hero-pets.png";
 *   <HomeScreen logoSrc={petolifeLogo} heroSrc={heroPets} />
 */
const HomeScreen = () => {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

const handleAddPet = () => {
  navigate("/create-pet-profile");
};


  const handleFab = () => {
    navigate("/create-pet-profile");
  };

  if (activeTab === "checklist") {
    return (
      <ChecklistPage
        onNavigate={setActiveTab}
        onFabPress={handleFab}
      />
    );
  }

  return (
    <div className="homescreen">
      {/* ── Sticky top nav ── */}
      <TopNav />

      {/* ── Scrollable body ── */}
      <main className="homescreen__body">
        <HeroSection />

        <div className="homescreen__section">
          <AddPetCard onAddPet={handleAddPet} />

        </div>

        <div className="homescreen__section">
          <HealthBanner />
        </div>

        {/* Bottom padding so last content clears the fixed nav */}
        <div className="homescreen__nav-spacer" />
      </main>

      {/* ── Fixed bottom nav ── */}
      <BottomNav
        active={activeTab}
        onNavigate={setActiveTab}
        onFabPress={handleFab}
      />
    </div>
  );
};

export default HomeScreen;
