import React, { useState } from "react";
import StepProgress from "../StepProgress/StepProgress";
import StepHeaderBar from "../StepHeaderBar/StepHeaderBar";
import { FiEdit2, FiCheck } from "../icons";
import { API_BASE } from "../constants";
import fetchWithAuth from "../../../utils/fetchWithAuth";
import { PetAvatar } from "../../common/PetAvatar";
import "./Step4.css";

function Step4({ goBack, petData, setStep, isSubmitting, setIsSubmitting, submitError, setSubmitError, onNavigateToPetHome }) {
  const progress = 100;

  const [localPetData, setLocalPetData] = useState({
    petName: petData.petName || "",
    petType: petData.petType || "",
    breed: petData.breed || "",
    gender: petData.gender || "",
    birthDate: petData.birthDate || "",
    approxAge: petData.approxAge || "",
    petPhotoFile: petData.petPhotoFile || null
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("pet_type", localPetData.petType || "");
      formData.append("pet_name", (localPetData.petName || "").trim());
      if (localPetData.breed)      formData.append("breed", localPetData.breed);
      if (localPetData.gender)     formData.append("gender", localPetData.gender);
      if (localPetData.birthDate)  formData.append("birth_date", localPetData.birthDate);
      if (localPetData.approxAge)  formData.append("approx_age", localPetData.approxAge);
      if (localPetData.petPhotoFile) formData.append("pet_photo", localPetData.petPhotoFile);

      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        try {
          const userObj = JSON.parse(storedUserData);
          if (userObj.id) formData.append("user_id", userObj.id);
          const city = userObj.user_metadata?.city;
          if (city) formData.append("city", city);
        } catch {}
      }

      const validIds = (petData.petIds || []).filter(
        (p) => p.idName?.trim() && p.idNumber?.trim()
      );
      if (validIds.length > 0) {
        formData.append("pet_ids", JSON.stringify(validIds));
      }

      const response = await fetchWithAuth("/api/pet-profile/", {
        method: "POST",
        body: formData,
      });

      const profileData = await response.json();

      if (!response.ok) {
        throw new Error(
          profileData.detail || profileData.error || "Failed to create pet profile."
        );
      }

      const petProfileId = profileData.pet_profile_id;
      const petolifeId   = profileData.petolife_id;

      const localUser   = localStorage.getItem("user");
      const userId      = localUser ? JSON.parse(localUser).id : "guest";
      const storageKey  = `pets_${userId}`;

      const newPet = {
        id: petProfileId,
        petolife_id: petolifeId,
        pet_name: (localPetData.petName || "").trim(),
        pet_type: localPetData.petType,
        breed: localPetData.breed,
        gender: localPetData.gender,
        birth_date: localPetData.birthDate,
        pet_photo_url: profileData.data?.pet_photo_url,
      };

      const existingPetsStr = localStorage.getItem(storageKey);
      const existingPets    = existingPetsStr ? JSON.parse(existingPetsStr) : [];
      localStorage.setItem(storageKey, JSON.stringify([newPet, ...existingPets]));

      const petForHome = {
        id: petProfileId,
        petolife_id: petolifeId,
        name:   (localPetData.petName || "").trim(),
        breed:  localPetData.breed  || "Not added",
        gender: localPetData.gender || "Male",
        age:    localPetData.birthDate ? localPetData.birthDate : localPetData.approxAge || "Not added",
        image:  profileData.data?.pet_photo_url ||
                (localPetData.petPhotoFile ? URL.createObjectURL(localPetData.petPhotoFile) : ""),
      };

      onNavigateToPetHome({ newPet: petForHome });

    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { padding: '6px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', width: '100%', maxWidth: '150px', textAlign: 'right', fontFamily: 'inherit' };

  return (
    <div className="confirm-container">
      <StepProgress progress={progress} stepNumber={4} />
      <StepHeaderBar onBack={goBack} />

      <div className="confirm-header">
        <h2 className="confirm-title">Review Pet Profile</h2>
        <p className="confirm-subtitle">
          Please review your pet's details before generating their Pet Health ID.
        </p>
      </div>

      <div className="confirm-card">
        <div className="pet-summary-top">
          <div className="pet-avatar-wrap">
            <PetAvatar
              src={localPetData.petPhotoFile ? URL.createObjectURL(localPetData.petPhotoFile) : null}
              petType={localPetData.petType}
              className="pet-avatar"
              size={48}
            />
          </div>

          <div className="pet-summary-meta">
            <h3>{localPetData.petName || "Your Pet"}</h3>
            <p>{localPetData.breed || "Breed not added"}</p>
            <div className="pet-summary-badge">
              <span className="pet-summary-badge-icon">🐾</span>
              <span>{localPetData.petType || "Pet"}</span>
            </div>
          </div>
        </div>

        <div className="confirm-details">
          {[
            { icon: "👤", label: "Pet Name",  name: "petName", type: "text" },
            { icon: "🐕", label: "Pet Type",  name: "petType", type: "text" },
            { icon: "🐾", label: "Breed",     name: "breed", type: "text" },
            { icon: "♂",  label: "Gender",    name: "gender", type: "select", options: ["Male", "Female"] },
          ].map(({ icon, label, name, type, options }) => (
            <div className="confirm-row" key={label}>
              <div className="confirm-row-left">
                <span className="confirm-row-icon">{icon}</span>
                <span className="label">{label}</span>
              </div>
              {isEditing ? (
                 type === "select" ? (
                   <select 
                     value={localPetData[name]} 
                     onChange={e => setLocalPetData({...localPetData, [name]: e.target.value})} 
                     style={inputStyle}
                   >
                     <option value="">Select...</option>
                     {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                 ) : (
                   <input 
                     type="text" 
                     value={localPetData[name]} 
                     onChange={e => setLocalPetData({...localPetData, [name]: e.target.value})} 
                     style={inputStyle}
                     placeholder={`Enter ${label}`}
                   />
                 )
              ) : (
                 <strong>{localPetData[name] || "[Not Added]"}</strong>
              )}
            </div>
          ))}

          {/* Age / DOB Row */}
          <div className="confirm-row" key="Age">
            <div className="confirm-row-left">
              <span className="confirm-row-icon">📅</span>
              <span className="label">Age / DOB</span>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end', width: '150px' }}>
                <input 
                  type="date" 
                  value={localPetData.birthDate} 
                  max={new Date().toISOString().split("T")[0]}
                  onChange={e => setLocalPetData({...localPetData, birthDate: e.target.value, approxAge: ""})} 
                  style={inputStyle}
                  title="Date of Birth"
                />
                <span style={{ fontSize: '11px', color: '#888', marginRight: '4px' }}>OR</span>
                <input 
                  type="text" 
                  value={localPetData.approxAge} 
                  onChange={e => setLocalPetData({...localPetData, approxAge: e.target.value, birthDate: ""})} 
                  style={inputStyle}
                  placeholder="e.g. 2y 5m"
                  title="Approximate Age"
                />
              </div>
            ) : (
              <strong>{localPetData.birthDate || localPetData.approxAge || "[Not Added]"}</strong>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <button type="button" className="edit-profile-btn" onClick={() => setIsEditing(false)} style={{ background: '#eff8e8', color: '#178a32', borderColor: '#a8d48d' }}>
          <FiCheck />
          <span>Save Details</span>
        </button>
      ) : (
        <button type="button" className="edit-profile-btn" onClick={() => setIsEditing(true)}>
          <FiEdit2 />
          <span>Edit Details</span>
        </button>
      )}

      {submitError && <div className="submit-error">{submitError}</div>}

      <button
        className={`generate-btn ${isSubmitting ? "loading" : ""}`}
        onClick={handleGenerate}
        disabled={isSubmitting || isEditing}
        style={isEditing ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        {isSubmitting ? (
          <>
            <span className="btn-spinner"></span>
            Generating Pet ID…
          </>
        ) : (
          <span>Generate Pet Health ID</span>
        )}
      </button>
    </div>
  );
}

export default Step4;
