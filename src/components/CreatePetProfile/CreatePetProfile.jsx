import { useState, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CreatePetProfile.css";

import dogIcon from "../../assets/pets/dog.png";
import catIcon from "../../assets/pets/cat.png";
import birdIcon from "../../assets/pets/bird.png";
import rabbitIcon from "../../assets/pets/rabbit.png";
import otherIcon from "../../assets/pets/other.png";

import labradorImg from "../../assets/dogbreeds/labrador.png";
import goldenImg from "../../assets/dogbreeds/golden-retriever.png";
import shepherdImg from "../../assets/dogbreeds/german-shepherd.png";
import beagleImg from "../../assets/dogbreeds/beagle.png";
import pugImg from "../../assets/dogbreeds/pug.png";
import rottweilerImg from "../../assets/dogbreeds/rottweiler.png";
import shihTzuImg from "../../assets/dogbreeds/shih-tzu.png";

import persianImg from "../../assets/catbreeds/persian.png";
import siameseImg from "../../assets/catbreeds/siamese.png";
import maineCoonImg from "../../assets/catbreeds/maine-coon.png";
import ragdollImg from "../../assets/catbreeds/ragdoll.png";
import britishShorthairImg from "../../assets/catbreeds/british-shorthair.png";

import parrotImg from "../../assets/birdbreeds/parrot.png";
import cockatielImg from "../../assets/birdbreeds/cockatiel.png";
import lovebirdImg from "../../assets/birdbreeds/lovebird.png";
import macawImg from "../../assets/birdbreeds/macaw.png";
import budgieImg from "../../assets/birdbreeds/budgie.png";

import hollandLopImg from "../../assets/rabbitbreeds/holland-lop.png";
import miniRexImg from "../../assets/rabbitbreeds/mini-rex.png";
import lionheadImg from "../../assets/rabbitbreeds/lionhead.png";
import dutchRabbitImg from "../../assets/rabbitbreeds/dutch-rabbit.png";

const CreatePetProfile = () => {
  const [selectedPet, setSelectedPet] = useState("");
  const [petImage, setPetImage] = useState(null);
  const [petPhotoFile, setPetPhotoFile] = useState(null);
  const [selectedPetCard, setSelectedPetCard] = useState("");
  const [showBreedPopup, setShowBreedPopup] = useState(false);
  const dateRef = useRef(null);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [showOtherPopup, setShowOtherPopup] = useState(false);
  const [customPetType, setCustomPetType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [showGenderPopup, setShowGenderPopup] = useState(false);
  const [petName, setPetName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [clinicName, setClinicName] = useState("");
  const [vetName, setVetName] = useState("");
  const [vetContact, setVetContact] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");


  const [petIds, setPetIds] = useState([
    {
      idName: "",
      idNumber: "",
    },
  ]);

  const addPetId = () => {
    setPetIds([
      ...petIds,
      {
        idName: "",
        idNumber: "",
      },
    ]);
  };

  const removePetId = (index) => {
    if (petIds.length === 1) return;

    setPetIds(petIds.filter((_, i) => i !== index));
  };

  const updatePetId = (index, field, value) => {
    const updated = [...petIds];

    updated[index][field] = value;

    setPetIds(updated);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setPetImage(URL.createObjectURL(file));
      setPetPhotoFile(file);
    }
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const handleNextStep = () => {
    if (!selectedPet) {
      setSubmitError("Please select a pet type.");
      return;
    }
    if (!petName.trim()) {
      setSubmitError("Please enter a pet name.");
      return;
    }
    setSubmitError("");
    setCurrentStep(2);
  };

  // Submit form to backend, get petolifeId, navigate to QR success
  const handleSubmit = async () => {
    if (!emergencyContactName.trim() || !emergencyContactNumber.trim()) {
      setSubmitError("Emergency Contact Name and Contact Number are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. Submit Pet Profile
      const formData = new FormData();
      formData.append("pet_type", selectedPet);
      formData.append("pet_name", petName.trim());
      if (selectedBreed) formData.append("breed", selectedBreed);
      if (selectedGender) formData.append("gender", selectedGender);
      if (birthDate) formData.append("birth_date", birthDate);
      if (bloodGroup.trim()) formData.append("blood_group", bloodGroup.trim());
      if (petPhotoFile) formData.append("pet_photo", petPhotoFile);

      // Send pet IDs as JSON string
      const validIds = petIds.filter((p) => p.idName.trim() && p.idNumber.trim());
      if (validIds.length > 0) {
        formData.append("pet_ids", JSON.stringify(validIds));
      }

      const response = await fetch(`${API_BASE}/api/pet-profile`, {
        method: "POST",
        body: formData,
      });

      const profileData = await response.json();

      if (!response.ok) {
        throw new Error(profileData.detail || profileData.error || "Failed to create pet profile.");
      }

      const petProfileId = profileData.pet_profile_id;
      const petolifeId = profileData.petolife_id;

      // 2. Submit Care Team Details
      const careTeamResponse = await fetch(`${API_BASE}/api/care-team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pet_profile_id: petProfileId,
          clinic_name: clinicName.trim() || null,
          vet_name: vetName.trim() || null,
          vet_contact: vetContact.trim() || null,
          emergency_contact_name: emergencyContactName.trim(),
          emergency_relationship: emergencyRelationship.trim() || null,
          emergency_contact_number: emergencyContactNumber.trim(),
        }),
      });

      const careTeamData = await careTeamResponse.json();

      if (!careTeamResponse.ok) {
        throw new Error(careTeamData.detail || careTeamData.error || "Failed to save care team details.");
      }

      // Save pet profile locally under the user-specific storage key
      const localUser = localStorage.getItem("user");
      const userId = localUser ? JSON.parse(localUser).id : "guest";
      const storageKey = `pets_${userId}`;

      const newPet = {
        id: petProfileId,
        petolife_id: petolifeId,
        pet_name: petName.trim(),
        pet_type: selectedPet,
        breed: selectedBreed,
        gender: selectedGender,
        birth_date: birthDate,
        blood_group: bloodGroup,
        pet_photo_url: profileData.data?.pet_photo_url,
      };

      const existingPetsStr = localStorage.getItem(storageKey);
      const existingPets = existingPetsStr ? JSON.parse(existingPetsStr) : [];
      localStorage.setItem(storageKey, JSON.stringify([newPet, ...existingPets]));

      // Navigate to QR success page with the generated petolifeId
      navigate("/qr-success", {
        state: {
          petolifeId: petolifeId,
          petProfileId: petProfileId,
          petName: petName.trim(),
          petType: selectedPet,
        },
      });
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const petTypes = [
    {
      name: "Dog",
      image: dogIcon,
    },
    {
      name: "Cat",
      image: catIcon,
    },
    {
      name: "Bird",
      image: birdIcon,
    },
    {
      name: "Rabbit",
      image: rabbitIcon,
    },
    {
      name: "Other",
      image: otherIcon,
    },
  ];

  const breedData = {
    Dog: [
      { name: "Labrador", image: labradorImg },
      { name: "Golden Retriever", image: goldenImg },
      { name: "German Shepherd", image: shepherdImg },
      { name: "Beagle", image: beagleImg },
      { name: "Pug", image: pugImg },
      { name: "Rottweiler", image: rottweilerImg },
      { name: "Shih Tzu", image: shihTzuImg },
    ],

    Cat: [
      {
        name: "Persian",
        image: persianImg,
      },
      {
        name: "Siamese",
        image: siameseImg,
      },
      {
        name: "Maine Coon",
        image: maineCoonImg,
      },
      {
        name: "Ragdoll",
        image: ragdollImg,
      },
      {
        name: "British Shorthair",
        image: britishShorthairImg,
      },
    ],

    Bird: [
      {
        name: "Parrot",
        image: parrotImg,
      },
      {
        name: "Cockatiel",
        image: cockatielImg,
      },
      {
        name: "Lovebird",
        image: lovebirdImg,
      },
      {
        name: "Macaw",
        image: macawImg,
      },
      {
        name: "Budgie",
        image: budgieImg,
      },
    ],

    Rabbit: [
      {
        name: "Holland Lop",
        image: hollandLopImg,
      },
      {
        name: "Mini Rex",
        image: miniRexImg,
      },
      {
        name: "Lionhead",
        image: lionheadImg,
      },
      {
        name: "Dutch Rabbit",
        image: dutchRabbitImg,
      },
    ],
  };

  const navigate = useNavigate();

  return (
    <section className="cpp">
      <div className="cpp-container">
        {/* HEADER */}

        <div className="cpp-header">
          <button className="cpp-back-btn" onClick={() => currentStep === 2 ? setCurrentStep(1) : navigate("/home")}>←</button>

          <div>
            <h2>Create Pet Profile</h2>
            <p>Step {currentStep} of 2</p>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="cpp-progress">
          <div className="progress-line"></div>

          <div className="progress-active" style={{ width: currentStep === 1 ? "40%" : "100%", transition: "width 0.4s ease" }}></div>

          <div className="step active">
            <div className="dot">1</div>
            <span>Profile</span>
          </div>

          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="dot">2</div>
            <span>Care Team</span>
          </div>
        </div>

        {currentStep === 1 && (
          <>
            {/* PHOTO */}

        <div className="photo-section">
          <h3>Pet Photo</h3>

          <div
            className="upload-box"
            onClick={() => document.getElementById("petPhotoInput").click()}
          >
            <input
              id="petPhotoInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            {petImage ? (
              <img src={petImage} alt="Pet" className="pet-preview-image" />
            ) : (
              <>
                <div className="upload-icon">📸</div>

                <h4>Upload Photo</h4>

                <p>PNG / JPG up to 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* PET TYPE */}

        <div className="pet-type-section">
          <h3>What type of pet?</h3>

          <div className="pet-grid">
            {petTypes.map((pet) => (
              <button
                key={pet.name}
                type="button"
                className={`pet-card ${
                  selectedPetCard === pet.name ? "active" : ""
                }`}
                onClick={() => {
                  if (pet.name === "Other") {
                    setShowOtherPopup(true);
                  } else {
                    setSelectedPet(pet.name);
                    setSelectedPetCard(pet.name);
                    setSelectedBreed("");
                  }
                }}
              >
                <div className="icon-wrapper">
                  <img src={pet.image} alt={pet.name} className="pet-image" />
                </div>

                <span>
                  {pet.name === "Other" &&
                  selectedPet &&
                  !["Dog", "Cat", "Bird", "Rabbit"].includes(selectedPet)
                    ? selectedPet
                    : pet.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PET NAME */}

        <div className="form-group">
          <label>Pet Name</label>

          <input
            type="text"
            placeholder="Enter pet name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
        </div>

        {/* BREED */}

        <div className="form-group">
          <label>Breed</label>

          <button
            type="button"
            className="breed-selector"
            onClick={() => {
              if (!selectedPet) {
                alert("Please select a pet type first");
                return;
              }

              setShowBreedPopup(true);
            }}
          >
            <span>{selectedBreed || "Select Breed"}</span>

            <span>›</span>
          </button>
        </div>

        {/* GENDER */}

        <div className="form-group">
          <label>Gender</label>

          <button
            type="button"
            className="breed-selector"
            onClick={() => setShowGenderPopup(true)}
          >
            <span>{selectedGender || "Select Gender"}</span>

            <span>›</span>
          </button>
        </div>

        {/* DATE OF BIRTH */}

        <div className="form-group">
          <label className="field-label">
            Birth Date
            <span className="optional-text">(Optional)</span>
          </label>

          <div className="date-input-wrapper">
            <input
              ref={dateRef}
              type="date"
              className="dob-input"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />

            <div
              className="calendar-badge"
              onClick={() => {
                if (dateRef.current?.showPicker) {
                  dateRef.current.showPicker();
                } else {
                  dateRef.current.focus();
                }
              }}
            >
              <FaCalendarAlt />
            </div>
          </div>
        </div>

        {/* BLOOD GROUP */}

        <div className="form-group">
          <label>
            Blood Group
            <span className="optional-text">(Optional)</span>
          </label>

          <input
            type="text"
            placeholder="Enter blood group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />
        </div>

        {/* PET IDS */}

        <div className="form-group">
          <div className="pet-id-header">
            <label>Pet IDs</label>

            <button type="button" className="add-id-btn" onClick={addPetId}>
              +
            </button>
          </div>

          {petIds.map((item, index) => (
            <div key={index} className="pet-id-row">
              <input
                type="text"
                placeholder="ex. KCI ID"
                value={item.idName}
                onChange={(e) => updatePetId(index, "idName", e.target.value)}
              />

              <input
                type="text"
                placeholder="ID Number"
                value={item.idNumber}
                onChange={(e) => updatePetId(index, "idNumber", e.target.value)}
              />

              <button
                type="button"
                className="delete-id-btn"
                onClick={() => removePetId(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* VETERINARIAN DETAILS */}
            <div className="care-section">
              <div className="section-title-row">
                <h3>Primary Veterinarian</h3>
                <span className="optional-tag">Optional</span>
              </div>

              <div className="form-group">
                <label>Clinic Name</label>
                <input
                  type="text"
                  placeholder="Enter clinic name"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Clinic Veterinarian</label>
                <input
                  type="text"
                  placeholder="Enter veterinarian name"
                  value={vetName}
                  onChange={(e) => setVetName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  value={vetContact}
                  onChange={(e) => setVetContact(e.target.value)}
                />
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            <div className="care-section">
              <div className="section-title-row">
                <h3>Emergency Contact</h3>
                <span className="required-tag">Required</span>
              </div>

              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  placeholder="Enter contact name"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Relationship</label>
                <input
                  type="text"
                  placeholder="Ex. Friend, Family"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={emergencyContactNumber}
                  onChange={(e) => setEmergencyContactNumber(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* SUBMIT ERROR */}
        {submitError && (
          <div className="submit-error">
            {submitError}
          </div>
        )}

        {/* CONTINUE */}

        <div className="submit-section">
          {currentStep === 1 ? (
            <button
              className="continue-btn"
              onClick={handleNextStep}
            >
              Continue
            </button>
          ) : (
            <button
              className={`continue-btn ${isSubmitting ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  Generating Pet ID…
                </>
              ) : (
                "Generate Pet ID"
              )}
            </button>
          )}
        </div>
      </div>

      {/* GENDER POPUP */}

      {showGenderPopup && (
        <div
          className="other-popup-overlay"
          onClick={() => setShowGenderPopup(false)}
        >
          <div className="breed-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Select Gender</h3>

            <div className="breed-list">
              {["Male", "Female"].map((gender) => (
                <label key={gender} className="breed-option gender-option">
                  <div className="breed-left">
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === gender}
                      onChange={() => {
                        setSelectedGender(gender);
                        setShowGenderPopup(false);
                      }}
                    />
                    <span>{gender}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OTHER PET POPUP */}

      {showBreedPopup && (
        <div
          className="other-popup-overlay"
          onClick={() => setShowBreedPopup(false)}
        >
          <div className="breed-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">🧬</div>

            <h3>Select Breed</h3>

            {breedData[selectedPet] ? (
              <div className="breed-list">
                {breedData[selectedPet].map((breed) => (
                  <label key={breed.name} className="breed-option">
                    <div className="breed-left">
                      <input
                        type="radio"
                        name="breed"
                        checked={selectedBreed === breed.name}
                        onChange={() => {
                          setSelectedBreed(breed.name);
                          setShowBreedPopup(false);
                        }}
                      />

                      <span>{breed.name}</span>
                    </div>

                    <img
                      src={breed.image}
                      alt={breed.name}
                      className="breed-image"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <div className="custom-breed-box">
                <input
                  type="text"
                  placeholder="Enter breed..."
                  value={selectedBreed}
                  onChange={(e) => setSelectedBreed(e.target.value)}
                />

                <button
                  className="save-breed-btn"
                  onClick={() => setShowBreedPopup(false)}
                >
                  Save Breed
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showOtherPopup && (
        <div
          className="other-popup-overlay"
          onClick={() => setShowOtherPopup(false)}
        >
          <div className="other-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">🐾</div>

            <h3>Tell us about your pet</h3>

            <p>Enter your pet type below</p>

            <input
              type="text"
              placeholder="Eg. Hamster, Turtle, Fish..."
              value={customPetType}
              onChange={(e) => setCustomPetType(e.target.value)}
            />

            <div className="popup-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowOtherPopup(false)}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={() => {
                  if (!customPetType.trim()) return;

                  setSelectedPet(customPetType);
                  setSelectedPetCard("Other");

                  setShowOtherPopup(false);

                  setCustomPetType("");
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreatePetProfile;
