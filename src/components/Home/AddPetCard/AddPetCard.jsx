import React from "react";
import "./AddPetCard.css";
import addPetIcon from "./add-pet-icon.png";
import grassDecor from "./grass-decor.png";

const AddPetCard = ({ onAddPet }) => {
  return (
    <div className="addpet">
      <div className="addpet__card">

        {/* Pet icon badge */}
        <div className="addpet__icon-wrap" aria-hidden="true">
          <img src={addPetIcon} alt="" className="addpet__icon-img" />
        </div>

        <h2 className="addpet__heading">Let&apos;s add your pet</h2>
        <p className="addpet__body">
          Add your pet to start managing<br />their health, records and care.
        </p>

        <button className="addpet__btn" onClick={onAddPet} aria-label="Add Your Pet">
          <span className="addpet__btn-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          Add Your Pet
        </button>
      </div>

      {/* Grass decorative strip at the bottom */}
      <div className="addpet__grass">
        <img src={grassDecor} alt="" aria-hidden="true" className="addpet__grass-img" />
      </div>
    </div>
  );
};

export default AddPetCard;