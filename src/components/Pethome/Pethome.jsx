import React, { useEffect, useRef, useState } from "react";
import "./PetHome.css";

import ProfileCard from "./ProfileCard/ProfileCard";
import HealthBanner from "./HealthBanner/HealthBanner";
import QuickActions from "./QuickActions/QuickActions";
import ReminderCard from "./ReminderCard/ReminderCard";
import NoRecordsCard from "./NoRecordsCard/NoRecordsCard";

export default function PetHome({
  pets = [],
  selectedPet,
  setSelectedPet,
  onAddPet,
}) {
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const dropdownRef = useRef(null);

  if (!selectedPet) {
    return <div style={{ padding: "20px" }}>No pet selected</div>;
  }

  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
    setShowPetDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowPetDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pet-home">
      <ProfileCard
        pets={pets}
        selectedPet={selectedPet}
        showPetDropdown={showPetDropdown}
        setShowPetDropdown={setShowPetDropdown}
        handlePetSelect={handlePetSelect}
        dropdownRef={dropdownRef}
        onAddPet={onAddPet}
      />

      <HealthBanner />
      <QuickActions />
      <ReminderCard />
      <NoRecordsCard />
    </div>
  );
}