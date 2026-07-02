import React from "react";
import StepProgress from "../StepProgress/StepProgress";
import StepHeaderBar from "../StepHeaderBar/StepHeaderBar";
import { FiEdit2 } from "../icons";
import { API_BASE } from "../constants";
import fetchWithAuth from "../../../utils/fetchWithAuth";
import { PetAvatar } from "../../common/PetAvatar";
import "./Step4.css";

function Step4({ goBack, petData, setStep, isSubmitting, setIsSubmitting, submitError, setSubmitError, onNavigateToPetHome }) {
  const progress = 100;

  const handleGenerate = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("pet_type", petData.petType || "");
      formData.append("pet_name", (petData.petName || "").trim());
      if (petData.breed)      formData.append("breed", petData.breed);
      if (petData.gender)     formData.append("gender", petData.gender);
      if (petData.birthDate)  formData.append("birth_date", petData.birthDate);
      if (petData.approxAge)  formData.append("approx_age", petData.approxAge);
      if (petData.petPhotoFile) formData.append("pet_photo", petData.petPhotoFile);

      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        try {
          const userObj = JSON.parse(storedUserData);
          if (userObj.id) formData.append("user_id", userObj.id);
          // City was auto-detected from the PIN code at signup and saved
          // into user_metadata — pass it through so the PetLife ID uses
          // the user's real city instead of the old hardcoded default.
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
        pet_name: (petData.petName || "").trim(),
        pet_type: petData.petType,
        breed: petData.breed,
        gender: petData.gender,
        birth_date: petData.birthDate,
        pet_photo_url: profileData.data?.pet_photo_url,
      };

      const existingPetsStr = localStorage.getItem(storageKey);
      const existingPets    = existingPetsStr ? JSON.parse(existingPetsStr) : [];
      localStorage.setItem(storageKey, JSON.stringify([newPet, ...existingPets]));

      const petForHome = {
        id: petProfileId,
        petolife_id: petolifeId,
        name:   (petData.petName || "").trim(),
        breed:  petData.breed  || "Not added",
        gender: petData.gender || "Male",
        age:    petData.birthDate ? petData.birthDate : petData.approxAge || "Not added",
        image:  profileData.data?.pet_photo_url ||
                (petData.petPhotoFile ? URL.createObjectURL(petData.petPhotoFile) : ""),
      };

      onNavigateToPetHome({ newPet: petForHome });

    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const petAgeValue = petData.birthDate || petData.approxAge || "[Not Added]";

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
              src={petData.petPhotoFile ? URL.createObjectURL(petData.petPhotoFile) : null}
              petType={petData.petType}
              className="pet-avatar"
              size={48}
            />
          </div>

          <div className="pet-summary-meta">
            <h3>{petData.petName || "Your Pet"}</h3>
            <p>{petData.breed || "Breed not added"}</p>
            <div className="pet-summary-badge">
              <span className="pet-summary-badge-icon">🐾</span>
              <span>{petData.petType || "Pet"}</span>
            </div>
          </div>
        </div>

        <div className="confirm-details">
          {[
            { icon: "👤", label: "Pet Name",  value: petData.petName  || "[Not Added]" },
            { icon: "🐕", label: "Pet Type",  value: petData.petType  || "[Not Added]" },
            { icon: "🐾", label: "Breed",     value: petData.breed    || "[Not Added]" },
            { icon: "♂",  label: "Gender",    value: petData.gender   || "[Not Added]" },
            { icon: "📅", label: "Age / DOB", value: petAgeValue },
          ].map(({ icon, label, value }) => (
            <div className="confirm-row" key={label}>
              <div className="confirm-row-left">
                <span className="confirm-row-icon">{icon}</span>
                <span className="label">{label}</span>
              </div>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="edit-profile-btn" onClick={() => setStep(2)}>
        <FiEdit2 />
        <span>Edit Details</span>
      </button>

      {submitError && <div className="submit-error">{submitError}</div>}

      <button
        className={`generate-btn ${isSubmitting ? "loading" : ""}`}
        onClick={handleGenerate}
        disabled={isSubmitting}
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
