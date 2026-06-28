import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import EditableUserCard from "./EditableUserCard";
import EditablePetCard from "./EditablePetCard";
import HealthBanner from "../Home/HealthBanner/HealthBanner";
import QuickActions from "../Home/QuickActions/QuickActions";
import ReminderCard from "../Home/ReminderCard/ReminderCard";
import NoRecordsCard from "../Home/NoRecordsCard/NoRecordsCard";
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
    // We could trigger a refetch of the pet list here if we passed down a fetch callback,
    // but typically the app relies on a global state or reload.
    // For now, the user can refresh or we trigger a soft reload:
    window.location.reload(); 
  };

  return (
    <div className="user-profile-page">
      <h2 className="profile-dashboard-title">Profile Dashboard</h2>
      
      {user && <EditableUserCard user={user} />}
      
      {selectedPet ? (
        <EditablePetCard pet={selectedPet} onUpdate={handlePetUpdate} />
      ) : (
        <div className="no-pet-banner">
          <p>No pet profiles found.</p>
          <button className="add-pet-btn" onClick={onAddPet}>+ Add Pet</button>
        </div>
      )}

      {selectedPet && (
        <>
          <HealthBanner />
          <QuickActions />
          <ReminderCard />
          <NoRecordsCard selectedPet={selectedPet} />
        </>
      )}

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
