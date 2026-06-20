import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCamera,
  FiArrowRight,
  FiSkipForward,
} from "react-icons/fi";
import "./ProfileCreation.css";

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

const TOTAL_STEPS = 6; // photo, pet-id details, age, location, care crew, confirm
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const breedData = {
  Dog: [
    { name: "Labrador", image: labradorImg },
    { name: "Golden Retriever", image: goldenImg },
    { name: "German Shepherd", image: shepherdImg },
    { name: "Beagle", image: beagleImg },
    { name: "Pug", image: pugImg },
    { name: "Rottweiler", image: rottweilerImg },
    { name: "Shih Tzu", image: shihTzuImg },
    { name: "Other", image: otherIcon },
  ],
  Cat: [
    { name: "Persian", image: persianImg },
    { name: "Siamese", image: siameseImg },
    { name: "Maine Coon", image: maineCoonImg },
    { name: "Ragdoll", image: ragdollImg },
    { name: "British Shorthair", image: britishShorthairImg },
    { name: "Other", image: otherIcon },
  ],
  Bird: [
    { name: "Parrot", image: parrotImg },
    { name: "Cockatiel", image: cockatielImg },
    { name: "Lovebird", image: lovebirdImg },
    { name: "Macaw", image: macawImg },
    { name: "Budgie", image: budgieImg },
    { name: "Other", image: otherIcon },
  ],
  Rabbit: [
    { name: "Holland Lop", image: hollandLopImg },
    { name: "Mini Rex", image: miniRexImg },
    { name: "Lionhead", image: lionheadImg },
    { name: "Dutch Rabbit", image: dutchRabbitImg },
    { name: "Other", image: otherIcon },
  ],
};

const petTypes = [
  { name: "Dog", image: dogIcon },
  { name: "Cat", image: catIcon },
  { name: "Bird", image: birdIcon },
  { name: "Rabbit", image: rabbitIcon },
  { name: "Other", image: otherIcon },
];

// Shared progress bar, reused by every step.
function StepProgress({ progress, stepNumber }) {
  return (
    <div className="pet-progress-container">
      <div className="pet-progress-track">
        <div className="pet-progress-fill" style={{ width: `${progress}%` }} />
        <div
          className="running-pet"
          style={{ left: progress === 0 ? "0%" : `calc(${progress}% - 10px)` }}
        />
      </div>

      <div className="progress-labels">
        <span>Photo</span>
        <span>Pet Life ID</span>
      </div>

      <div className="step-text">Step {stepNumber} of {TOTAL_STEPS + 1}</div>
    </div>
  );
}

function ProfileCreation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [petData, setPetData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const goNext = (data) => {
    setPetData((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // ============================================================
  // STEP 1 — Pet Photo
  // ============================================================
  const Step1 = () => {
    const [image, setImage] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const progress = photoUploaded ? 14 : 0;

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(URL.createObjectURL(file));
        setPhotoFile(file);
        setPhotoUploaded(true);
      }
    };

    return (
      <motion.div
        className="petphoto-container"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>

        <StepProgress progress={progress} stepNumber={1} />

        <div className="paw paw1">🐾</div>
        <div className="paw paw2">🐾</div>
        <div className="paw paw3">🐾</div>

        <div className="hero-section">
          <div className="floating-circle circle1"></div>
          <div className="floating-circle circle2"></div>

          <div className="pet-avatar">
            {image ? <img src={image} alt="pet" /> : <span>🐶</span>}
          </div>

          <span className="step-badge">Step 1 of {TOTAL_STEPS + 1}</span>

          <h1>Add Your Pet's Photo</h1>

          <p className="subtitle">
            Help veterinarians and caregivers identify your furry friend
            quickly.
          </p>
        </div>

        <label className="upload-card">
          {image ? (
            <img src={image} alt="preview" />
          ) : (
            <>
              <div className="upload-icon">
                <FiCamera />
              </div>
              <h3>Upload Pet Photo</h3>
              <p>JPG, PNG up to 10MB</p>
            </>
          )}

          <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
        </label>

        <button
          type="button"
          className="skip-btn"
          onClick={() => goNext({ petPhotoFile: null })}
        >
          <FiSkipForward />
          Skip for Now
        </button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="next-btn"
          onClick={() => goNext({ petPhotoFile: photoFile })}
        >
          Next
          <FiArrowRight />
        </motion.button>
      </motion.div>
    );
  };

  // ============================================================
  // STEP 2 — Pet Type / Name / Breed / Gender
  // ============================================================
  const Step2 = () => {
    const [selectedPet, setSelectedPet] = useState("");
    const [selectedPetCard, setSelectedPetCard] = useState("");
    const [selectedBreed, setSelectedBreed] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [petName, setPetName] = useState("");
    const [showBreedPopup, setShowBreedPopup] = useState(false);
    const [showGenderPopup, setShowGenderPopup] = useState(false);
    const [showOtherPopup, setShowOtherPopup] = useState(false);
    const [showOtherBreedPopup, setShowOtherBreedPopup] = useState(false);
    const [customPetType, setCustomPetType] = useState("");
    const [customBreed, setCustomBreed] = useState("");
    const [localError, setLocalError] = useState("");
    const progress = 28;

    // Microchip / pet-ID tags. UI for adding/removing rows isn't part of
    // the original design yet, so this is kept as state only, ready to
    // render a list later (see addPetId / removePetId / updatePetId).
    const [petIds, setPetIds] = useState([{ idName: "", idNumber: "" }]);

    const addPetId = () =>
      setPetIds((prev) => [...prev, { idName: "", idNumber: "" }]);

    const removePetId = (index) => {
      if (petIds.length === 1) return;
      setPetIds((prev) => prev.filter((_, i) => i !== index));
    };

    const updatePetId = (index, field, value) => {
      setPetIds((prev) => {
        const updated = [...prev];
        updated[index][field] = value;
        return updated;
      });
    };

    const handleNext = () => {
      if (!selectedPet) {
        setLocalError("Please select a pet type.");
        return;
      }
      if (!petName.trim()) {
        setLocalError("Please enter pet name.");
        return;
      }

      setLocalError("");
      goNext({
        petType: selectedPet,
        breed: selectedBreed,
        gender: selectedGender,
        petName,
        petIds,
      });
    };

    return (
      <section className="cpp">
        <div className="cpp-container">
          <StepProgress progress={progress} stepNumber={2} />

          <div className="cpp-header">
            <center>
              <h2>Tell us about your pet</h2>
            </center>
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

          {localError && <div className="submit-error">{localError}</div>}

          <div className="submit-section">
            <button className="continue-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>

        {/* GENDER POPUP */}
        {showGenderPopup && (
          <div className="other-popup-overlay" onClick={() => setShowGenderPopup(false)}>
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

        {/* BREED POPUP */}
        {showBreedPopup && (
          <div className="other-popup-overlay" onClick={() => setShowBreedPopup(false)}>
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
                            if (breed.name === "Other") {
                              setShowBreedPopup(false);
                              setShowOtherBreedPopup(true);
                            } else {
                              setSelectedBreed(breed.name);
                              setShowBreedPopup(false);
                            }
                          }}
                        />
                        <span>{breed.name}</span>
                      </div>
                      <img src={breed.image} alt={breed.name} className="breed-image" />
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
                  <button className="save-breed-btn" onClick={() => setShowBreedPopup(false)}>
                    Save Breed
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OTHER PET TYPE POPUP */}
        {showOtherPopup && (
          <div className="other-popup-overlay" onClick={() => setShowOtherPopup(false)}>
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
                <button className="cancel-btn" onClick={() => setShowOtherPopup(false)}>
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

        {/* OTHER BREED POPUP */}
        {showOtherBreedPopup && (
          <div
            className="other-popup-overlay"
            onClick={() => setShowOtherBreedPopup(false)}
          >
            <div className="other-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-icon">🧬</div>
              <h3>Enter Breed</h3>
              <p>Type your breed name</p>

              <input
                type="text"
                placeholder="Eg. Indie, Rajapalayam..."
                value={customBreed}
                onChange={(e) => setCustomBreed(e.target.value)}
              />

              <div className="popup-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowOtherBreedPopup(false);
                    setCustomBreed("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="save-btn"
                  onClick={() => {
                    if (!customBreed.trim()) return;
                    setSelectedBreed(customBreed);
                    setShowOtherBreedPopup(false);
                    setCustomBreed("");
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

  // ============================================================
  // STEP 3 — Age / DOB
  // ============================================================
  const Step3 = () => {
    const [knowDOB, setKnowDOB] = useState(true);
    const [dob, setDob] = useState("");
    const [years, setYears] = useState("");
    const [months, setMonths] = useState("");
    const progress = 42;

    return (
      <div className="pet-age-container">
        <StepProgress progress={progress} stepNumber={3} />

        <h2>
          Pet Age Details <span>🐾</span>
        </h2>

        <p className="subtitle">Do you know your pet's date of birth?</p>

        <div className={`card ${knowDOB ? "selected" : ""}`} onClick={() => setKnowDOB(true)}>
          <label className="radio-label">
            <input type="radio" checked={knowDOB} onChange={() => setKnowDOB(true)} />
            <span>Yes, I know DOB</span>
          </label>

          {knowDOB && (
            <>
              <div className="input-group">
                <label>Date of Birth</label>
                <div className="date-input">
                  <input
                    type="text"
                    placeholder="DD / MM / YYYY"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <span>📅</span>
                </div>
              </div>
              <p className="hint">Age is calculated automatically</p>
            </>
          )}
        </div>

        <div className={`card ${!knowDOB ? "selected" : ""}`} onClick={() => setKnowDOB(false)}>
          <label className="radio-label">
            <input type="radio" checked={!knowDOB} onChange={() => setKnowDOB(false)} />
            <span>No, I know approximate age</span>
          </label>

          {!knowDOB && (
            <>
              <div className="age-row">
                <div>
                  <label>Years</label>
                  <input
                    type="number"
                    placeholder="e.g. 3"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>
                <div>
                  <label>Months</label>
                  <input
                    type="number"
                    placeholder="e.g. 6"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                  />
                </div>
              </div>
              <p className="hint">We will save this estimated age.</p>
            </>
          )}
        </div>

        <button
          className="next-btn"
          onClick={() =>
            goNext({
              knowDOB,
              birthDate: knowDOB ? dob : "",
              approxAge: !knowDOB ? `${years || 0}y ${months || 0}m` : "",
            })
          }
        >
          Next
        </button>
      </div>
    );
  };

  // ============================================================
  // STEP 4 — Location
  // ============================================================
  const Step4 = () => {
    const [form, setForm] = useState({ pincode: "", city: "", state: "" });
    const progress = 56;

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
      <div className="location-container">
        <StepProgress progress={progress} stepNumber={4} />

        <h2>
          Where is your pet located? <span> 🐾</span>
        </h2>

        <div className="location-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
            alt="location"
          />
        </div>

        <div className="input-box">
          <span className="icon">📍</span>
          <div className="input-content">
            <label>
              Pincode <span>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 641001"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-box">
          <span className="icon">🏙️</span>
          <div className="input-content">
            <label>
              City <span>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Coimbatore"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-box">
          <span className="icon">🗺️</span>
          <div className="input-content">
            <label>
              State <span>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tamil Nadu"
              name="state"
              value={form.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          className="next-btn"
          onClick={() => {
            if (!form.pincode || !form.city || !form.state) {
              alert("Please fill all fields.");
              return;
            }
            goNext(form);
          }}
        >
          Next
        </button>
      </div>
    );
  };

  // ============================================================
  // STEP 5 — Care Crew (vet + emergency contact)
  // ============================================================
  const Step5 = () => {
    const [form, setForm] = useState({
      clinicName: "",
      veterinarian: "",
      clinicContact: "",
      emergencyName: "",
      relationship: "",
      emergencyContact: "",
    });

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const InputField = ({ icon, placeholder, name, value }) => (
      <div className="input-box">
        <span className="input-icon">{icon}</span>
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleChange}
        />
      </div>
    );

    return (
      <div className="pet-care-container">
        <h1>Pet Care Crew 🐾</h1>
        <p className="subtitle">Add veterinary and emergency contact information.</p>

        <div className="section">
          <div className="section-head">
            <h3>Primary Veterinarian</h3>
            <span>Optional</span>
          </div>

          <InputField icon="🏥" placeholder="Clinic Name" name="clinicName" value={form.clinicName} />
          <InputField icon="🩺" placeholder="Clinic Veterinarian" name="veterinarian" value={form.veterinarian} />
          <InputField icon="📞" placeholder="Clinic Contact" name="clinicContact" value={form.clinicContact} />
        </div>

        <div className="section">
          <div className="section-head">
            <h3>Emergency Contact</h3>
            <span className="required">Required</span>
          </div>

          <InputField icon="👤" placeholder="Contact Name" name="emergencyName" value={form.emergencyName} />
          <InputField icon="🤝" placeholder="Relationship" name="relationship" value={form.relationship} />
          <InputField icon="📱" placeholder="Contact Number" name="emergencyContact" value={form.emergencyContact} />
        </div>

        {submitError && <div className="submit-error">{submitError}</div>}

        <button
          className="next-btn"
          onClick={() => {
            if (!form.emergencyName.trim() || !form.emergencyContact.trim()) {
              setSubmitError("Emergency Contact Name and Contact Number are required.");
              return;
            }
            setSubmitError("");
            goNext({
              clinicName: form.clinicName,
              vetName: form.veterinarian,
              vetContact: form.clinicContact,
              emergencyContactName: form.emergencyName,
              emergencyRelationship: form.relationship,
              emergencyContactNumber: form.emergencyContact,
            });
          }}
        >
          Next
        </button>
      </div>
    );
  };

  // ============================================================
  // STEP 6 — Confirm + Submit
  // ============================================================
  const Step6 = () => {
    const progress = 100;

    const handleGenerate = async () => {
      setIsSubmitting(true);
      setSubmitError("");

      try {
        const formData = new FormData();
        formData.append("pet_type", petData.petType || "");
        formData.append("pet_name", (petData.petName || "").trim());
        if (petData.breed) formData.append("breed", petData.breed);
        if (petData.gender) formData.append("gender", petData.gender);
        if (petData.birthDate) formData.append("birth_date", petData.birthDate);
        if (petData.approxAge) formData.append("approx_age", petData.approxAge);
        if (petData.petPhotoFile) formData.append("pet_photo", petData.petPhotoFile);

        if (petData.city) formData.append("city", petData.city);
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
          try {
            const userObj = JSON.parse(storedUserData);
            if (userObj.id) formData.append("user_id", userObj.id);
          } catch {}
        }

        const validIds = (petData.petIds || []).filter(
          (p) => p.idName?.trim() && p.idNumber?.trim()
        );
        if (validIds.length > 0) {
          formData.append("pet_ids", JSON.stringify(validIds));
        }

        const response = await fetch(`${API_BASE}/api/pet-profile`, {
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
        const petolifeId = profileData.petolife_id;

        const careTeamResponse = await fetch(`${API_BASE}/api/care-team`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pet_profile_id: petProfileId,
            clinic_name: petData.clinicName?.trim() || null,
            vet_name: petData.vetName?.trim() || null,
            vet_contact: petData.vetContact?.trim() || null,
            emergency_contact_name: petData.emergencyContactName?.trim(),
            emergency_relationship: petData.emergencyRelationship?.trim() || null,
            emergency_contact_number: petData.emergencyContactNumber?.trim(),
          }),
        });

        const careTeamData = await careTeamResponse.json();

        if (!careTeamResponse.ok) {
          throw new Error(
            careTeamData.detail || careTeamData.error || "Failed to save care team details."
          );
        }

        const localUser = localStorage.getItem("user");
        const userId = localUser ? JSON.parse(localUser).id : "guest";
        const storageKey = `pets_${userId}`;

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
        const existingPets = existingPetsStr ? JSON.parse(existingPetsStr) : [];
        localStorage.setItem(storageKey, JSON.stringify([newPet, ...existingPets]));

        // Navigate to the post ID screen
        navigate("/post-id-success", { 
          state: { 
            petName: (petData.petName || "").trim(),
            petolifeId: petolifeId, 
            petProfileId: petProfileId,
            petPhotoUrl: profileData.data?.pet_photo_url || ""
          } 
        });
        console.log("Pet profile created:", petolifeId);
      } catch (err) {
        console.error("Submit error:", err);
        setSubmitError(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="confirm-container">
        <StepProgress progress={progress} stepNumber={6} />

        <h2 className="confirm-title">Confirm Pet Details</h2>

        <div className="confirm-card">
          <div className="confirm-row">
            <span>🐾 Name:</span>
            <strong>{petData.petName || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>🐾 Pet Type:</span>
            <strong>{petData.petType || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>🐾 Breed:</span>
            <strong>{petData.breed || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>🐾 Gender:</span>
            <strong>{petData.gender || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>🐾 Age / DOB:</span>
            <strong>{petData.birthDate || petData.approxAge || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>📍 Pincode:</span>
            <strong>{petData.pincode || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>🏙 City:</span>
            <strong>{petData.city || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>🗺 State:</span>
            <strong>{petData.state || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>👨‍⚕️ Veterinary:</span>
            <strong>{petData.vetName || "[Not Added]"}</strong>
          </div>
          <div className="confirm-row">
            <span>☎ Emergency:</span>
            <strong>{petData.emergencyContactName || "[Not Added]"}</strong>
          </div>

          <div className="dog-preview">
            {petData.petPhotoFile ? (
              <img src={URL.createObjectURL(petData.petPhotoFile)} alt="" />
            ) : (
              <div className="photo-placeholder">🐶</div>
            )}
          </div>
        </div>

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
            "Generate Pet Health ID"
          )}
        </button>
      </div>
    );
  };

  switch (step) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
    case 3:
      return <Step3 />;
    case 4:
      return <Step4 />;
    case 5:
      return <Step5 />;
    case 6:
      return <Step6 />;
    default:
      return <Step1 />;
  }
}

export default ProfileCreation;