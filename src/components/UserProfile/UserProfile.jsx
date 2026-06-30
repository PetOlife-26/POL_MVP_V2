import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import EditableUserCard from "./EditableUserCard";
import EditablePetCard from "./EditablePetCard";
import NO_PETS_IMG from "../../assets/no-pets.png";
import PETS_BANNER_IMG from "../../assets/dog-cat-banner.png";
import "./UserProfile.css";

const UserProfile = ({ pets = [], activePetId, onPetSelect, onAddPet }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fallback to first pet if no activePetId is provided but pets exist
  const selectedPet = pets.find(p => p.id === activePetId) || (pets.length > 0 ? pets[0] : null);

  const confirmLogout = async () => {
    if (user?.id) {
      localStorage.removeItem(`pets_${user.id}`);
      localStorage.removeItem(`active_pet_id_${user.id}`);
    }

    if (signOut) {
      await signOut();
    }

    localStorage.removeItem("petolife_user_session");
    sessionStorage.clear();

    navigate("/login");
  };

  const handlePetUpdate = () => {
    window.location.reload();
  };

  return (
    <div className="user-profile-page">
      <h2 className="profile-dashboard-title">Profile Dashboard</h2>

      {user && <EditableUserCard user={user} />}

      {/* My Pets Section */}
      <div className="section-header">
        <h3>My Pets</h3>
        {pets.length > 0 && (
          <a href="/pets" className="view-all-link">
            View All <span className="arrow">→</span>
          </a>
        )}
      </div>

      {pets.length === 0 ? (
        <div className="no-pets-card">
          <img src={NO_PETS_IMG} alt="No pets added" className="no-pets-img" />
          <h4 className="no-pets-title">No pets added yet</h4>
          <p className="no-pets-subtitle">
            Add your furry friends to get personalized care, reminders and
            everything they need for a happy life.
          </p>
          <button className="add-pet-btn" type="button" onClick={onAddPet}>
            <span className="plus-icon">+</span> Add New Pet
          </button>
        </div>
      ) : (
        <div className="pets-grid">
          {pets.map((pet) => (
            <div
              className={`pet-chip${pet.id === selectedPet?.id ? " active" : ""}`}
              key={pet.id}
              onClick={() => onPetSelect?.(pet.id)}
              role="button"
              tabIndex={0}
            >
              <img
                src={pet.pet_photo_url || pet.image || NO_PETS_IMG}
                alt={pet.pet_name || pet.name || "Pet"}
                className="pet-chip-img"
              />
              <span className="pet-chip-name">
                {pet.pet_name || pet.name || "Unnamed"}
              </span>
            </div>
          ))}

          {/* Add New Pet */}
          <div className="add-pet-card" onClick={onAddPet}>
            <div className="add-pet-circle">
              <FiPlus size={26} />
            </div>
            <p>Add New Pet</p>
          </div>
</div>
      )}


      {/* Bottom Banner */}
      <div className="pets-banner">
        <div className="banner-img-wrapper">
          <img src={PETS_BANNER_IMG} alt="Dog and cat" className="banner-img" />
          <span className="banner-heart">♥</span>
        </div>
        <p className="banner-text">
          Together, let's build a
          <br />
          healthier &amp; happier life for pets! <span className="heart">💚</span>
        </p>
      </div>

      <div className="logout-section">
        <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
          Log Out
        </button>
      </div>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Confirm Log Out</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="logout-modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;