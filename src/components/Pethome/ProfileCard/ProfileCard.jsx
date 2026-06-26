import React from "react";

import calendarIcon from "./calendar-icon.png";
import maleIcon from "./male-icon.png";
import femaleIcon from "./female-icon.png";
import pawIcon from "./paw-icon.png";

export default function ProfileCard({
  pets,
  selectedPet,
  showPetDropdown,
  setShowPetDropdown,
  handlePetSelect,
  dropdownRef,
  onAddPet,
}) {
  const genderIcon =
    selectedPet.gender?.toLowerCase() === "female"
      ? femaleIcon
      : maleIcon;

  return (
    <div className="profile-wrapper" ref={dropdownRef}>
      <div
        className="profile-card clickable"
        onClick={() => setShowPetDropdown((prev) => !prev)}
      >
        <div className="profile-avatar">
          <img src={selectedPet.image} alt={selectedPet.name} />
        </div>

        <div className="profile-info">
          <div className="profile-name-row">
            <h2 className="profile-name">{selectedPet.name}</h2>
            <span
              className={`profile-chevron ${
                showPetDropdown ? "rotate" : ""
              }`}
            >
              &#8964;
            </span>
          </div>

          <p className="profile-breed">{selectedPet.breed}</p>

          <div className="profile-meta">
            <span className="meta-item">
              <img src={calendarIcon} alt="" className="meta-icon" />
              {selectedPet.age}
            </span>

            <span className="meta-item">
              <img src={genderIcon} alt="" className="meta-icon" />
              {selectedPet.gender}
            </span>
          </div>
        </div>

        <div className="profile-paw">
          <img src={pawIcon} alt="paw" />
        </div>
      </div>

      {/* Floating Pet Switcher (UNCHANGED LOGIC) */}
      <div className={`pet-switcher ${showPetDropdown ? "open" : ""}`}>
        {pets.map((pet) => {
          const petGenderIcon =
            pet.gender?.toLowerCase() === "female"
              ? femaleIcon
              : maleIcon;

          return (
            <div
              key={pet.id}
              className={`pet-switcher__item ${
                selectedPet.id === pet.id ? "active" : ""
              }`}
              onClick={() => handlePetSelect(pet)}
            >
              <img src={pet.image} alt={pet.name} />

              <div className="pet-switcher__info">
                <h4>{pet.name}</h4>
                <p>{pet.breed}</p>

                <div className="pet-switcher__meta">
                  <span>
                    <img src={calendarIcon} alt="" />
                    {pet.age}
                  </span>

                  <span>
                    <img src={petGenderIcon} alt="" />
                    {pet.gender}
                  </span>
                </div>
              </div>

              {selectedPet.id === pet.id && (
                <div className="pet-switcher__tick">✓</div>
              )}
            </div>
          );
        })}

        <button className="pet-switcher__add-btn" onClick={onAddPet}>
          + Add Pet
        </button>
      </div>
    </div>
  );
}