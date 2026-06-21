import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCamera,
  FiArrowRight,
  FiSkipForward,
} from "react-icons/fi";
import "./Profilecreation.css";



const TOTAL_STEPS = 4; // photo, pet-id details, age, confirm
const API_BASE = import.meta.env.VITE_API_BASE_URL !== undefined ? import.meta.env.VITE_API_BASE_URL : (import.meta.env.PROD ? "" : "http://localhost");

const dogBreeds = [
  "Afghan Hound",
  "Akita",
  "Alaskan Malamute",
  "American Bully",
  "American Staffordshire Terrier",
  "Australian Shepherd",
  "Bakharwal Dog",
  "Banjara Hound",
  "Basset Hound",
  "Beagle",
  "Belgian Malinois",
  "Belgian Shepherd",
  "Bernese Mountain Dog",
  "Bloodhound",
  "Border Collie",
  "Borzoi",
  "Boston Terrier",
  "Boxer",
  "Bullmastiff",
  "Bully Kutta",
  "Cane Corso",
  "Caravan Hound",
  "Cavalier King Charles Spaniel",
  "Chihuahua",
  "Chippiparai",
  "Chow Chow",
  "Cockapoo",
  "Cocker Spaniel",
  "Dachshund",
  "Dalmatian",
  "Doberman",
  "English Bulldog",
  "English Springer Spaniel",
  "French Bulldog",
  "Gaddi Kutta (Himalayan Sheepdog)",
  "German Shepherd",
  "Golden Retriever",
  "Goldendoodle",
  "Great Dane",
  "Greyhound",
  "Himalayan Mastiff",
  "Indian Pariah Dog (Indie)",
  "Indian Spitz",
  "Irish Setter",
  "Jack Russell Terrier",
  "Jonangi",
  "Kaikadi",
  "Kanni",
  "Kombai",
  "Labradoodle",
  "Labrador Retriever",
  "Lhasa Apso",
  "Mahratta Hound",
  "Maltese",
  "Miniature Pinscher",
  "Miniature Poodle",
  "Mudhol Hound",
  "Neapolitan Mastiff",
  "Newfoundland",
  "Pandikona",
  "Pashmi Hound",
  "Pekingese",
  "Pit Bull Terrier",
  "Pointer",
  "Pomeranian",
  "Poodle (Standard)",
  "Pug",
  "Rajapalayam",
  "Ramanadhapuram Mandai",
  "Rampur Hound",
  "Rottweiler",
  "Rough Collie",
  "Saint Bernard",
  "Saluki",
  "Samoyed",
  "Shetland Sheepdog",
  "Shih Tzu",
  "Siberian Husky",
  "Sindh Mastiff",
  "Tangkhul Hui Dog",
  "Tibetan Mastiff",
  "Toy Poodle",
  "Vizsla",
  "Weimaraner",
  "Whippet",
  "Yorkshire Terrier",
  "Other",
];
const catBreeds = [
  "American Bobtail",
  "American Curl",
  "American Shorthair",
  "Balinese",
  "Bengal",
  "Birman",
  "Bombay",
  "British Longhair",
  "British Shorthair",
  "Burmese",
  "Chartreux",
  "Cornish Rex",
  "Devon Rex",
  "Egyptian Mau",
  "Exotic Shorthair",
  "Havana Brown",
  "Himalayan",
  "Japanese Bobtail",
  "Khao Manee",
  "Korat",
  "LaPerm",
  "Maine Coon",
  "Manx",
  "Munchkin",
  "Norwegian Forest Cat",
  "Ocicat",
  "Oriental Longhair",
  "Oriental Shorthair",
  "Persian",
  "Peterbald",
  "Pixie-Bob",
  "Ragamuffin",
  "Ragdoll",
  "Russian Blue",
  "Savannah",
  "Scottish Fold",
  "Selkirk Rex",
  "Siamese",
  "Siberian",
  "Singapura",
  "Snowshoe",
  "Somali",
  "Sphynx",
  "Thai",
  "Tonkinese",
  "Toyger",
  "Turkish Angora",
  "Turkish Van",
  "York Chocolate",
  "Other",
];
const birdBreeds = [
  "Alexandrine Parakeet",
  "African Grey Parrot",
  "Australian King Parrot",
  "Blue-and-Gold Macaw",
  "Blue-fronted Amazon",
  "Blue-winged Parakeet",
  "Budgerigar (Budgie)",
  "Canary",
  "Cockatiel",
  "Cockatoo",
  "Crimson Rosella",
  "Derbyan Parakeet",
  "Diamond Dove",
  "Eclectus Parrot",
  "Finch (Bengalese)",
  "Finch (Gouldian)",
  "Finch (Zebra)",
  "Golden-fronted Leafbird",
  "Green Cheek Conure",
  "Hill Myna",
  "Indian Ringneck Parakeet",
  "Indian Silverbill",
  "Java Sparrow",
  "Lorikeet",
  "Lovebird (Fischer's)",
  "Lovebird (Masked)",
  "Lovebird (Peach-faced)",
  "Macaw (Green-winged)",
  "Macaw (Hyacinth)",
  "Moluccan Cockatoo",
  "Monk Parakeet",
  "Mustache Parakeet",
  "Nanday Conure",
  "Orange-winged Amazon",
  "Parrotlet",
  "Plum-headed Parakeet",
  "Princess Parrot",
  "Quaker Parrot",
  "Rainbow Lorikeet",
  "Red-breasted Parakeet",
  "Rose-ringed Parakeet",
  "Rosy-faced Lovebird",
  "Senegal Parrot",
  "Sun Conure",
  "Sulphur-crested Cockatoo",
  "White Cockatiel",
  "White-eyed Conure",
  "Yellow-collared Lovebird",
  "Yellow-headed Amazon",
  "Other",
];
const rabbitBreeds = [
  "Alaska",
  "American",
  "American Chinchilla",
  "American Fuzzy Lop",
  "American Sable",
  "Angora",
  "Belgian Hare",
  "Beveren",
  "Blanc de Hotot",
  "Britannia Petite",
  "Californian",
  "Champagne d'Argent",
  "Checkered Giant",
  "Chinchilla",
  "Cinnamon",
  "Continental Giant",
  "Crème d'Argent",
  "Dutch",
  "Dwarf Hotot",
  "English Angora",
  "English Lop",
  "English Spot",
  "Flemish Giant",
  "Florida White",
  "French Angora",
  "French Lop",
  "Giant Chinchilla",
  "Harlequin",
  "Havana",
  "Himalayan",
  "Holland Lop",
  "Jersey Wooly",
  "Lionhead",
  "Mini Lop",
  "Mini Rex",
  "Mini Satin",
  "Netherland Dwarf",
  "New Zealand White",
  "Palomino",
  "Polish",
  "Rex",
  "Satin",
  "Silver",
  "Silver Fox",
  "Silver Marten",
  "Tan",
  "Thrianta",
  "Velveteen Lop",
  "Vienna White",
  "White Giant"
];
const breedData = {
  Dog: dogBreeds,

  Cat: catBreeds,

  Bird: birdBreeds,

  Rabbit: rabbitBreeds
};

const petTypes = [
  { name: "Dog" },
  { name: "Cat"  },
  { name: "Bird"},
  { name: "Rabbit"},
  { name: "Other" },
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

      <div className="step-text">Step {stepNumber} of {TOTAL_STEPS}</div>
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
    const progress = photoUploaded ? 25 : 0;

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

          <span className="step-badge">Step 1 of {TOTAL_STEPS}</span>

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
    const [breedSearch, setBreedSearch] = useState("");
    const [showBreedDropdown, setShowBreedDropdown] = useState(false);
    const filteredBreeds =
      breedData[selectedPet]?.filter((breed) =>
        breed.toLowerCase().includes(breedSearch.toLowerCase())
      ) || [];
    const [selectedGender, setSelectedGender] = useState("");
    const [petName, setPetName] = useState("");
    const [showOtherPopup, setShowOtherPopup] = useState(false);
    const [showOtherBreedPopup, setShowOtherBreedPopup] = useState(false);
    const [customPetType, setCustomPetType] = useState("");
    const [customBreed, setCustomBreed] = useState("");
    const [localError, setLocalError] = useState("");
    const breedBoxRef = React.useRef(null);
    const progress = 50;

    // Close breed dropdown when clicking outside of it.
    React.useEffect(() => {
      const handleClickOutside = (e) => {
        if (breedBoxRef.current && !breedBoxRef.current.contains(e.target)) {
          setShowBreedDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                      setBreedSearch("");
                    }
                  }}
                >
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

          {/* BREED — searchable dropdown */}
          <div className="form-group">
            <label>Breed</label>
            <div className="breed-search-box" ref={breedBoxRef}>
              <button
                type="button"
                className="breed-selector"
                onClick={() => {
                  if (!selectedPet) {
                    alert("Please select a pet type first");
                    return;
                  }
                  setShowBreedDropdown((prev) => !prev);
                }}
              >
                <span>{selectedBreed || "Search or select breed"}</span>
                <span className={`chevron ${showBreedDropdown ? "open" : ""}`}>›</span>
              </button>

              {showBreedDropdown && breedData[selectedPet] && (
                <div className="breed-dropdown">
                  <div className="breed-dropdown-search">
                    <span className="search-icon"></span>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type to search breed..."
                      value={breedSearch}
                      onChange={(e) => setBreedSearch(e.target.value)}
                    />
                  </div>

                  <div className="breed-dropdown-list">
                    {filteredBreeds.length > 0 ? (
                      filteredBreeds.map((breed) => (
                        <button
                          type="button"
                          key={breed}
                          className={`breed-dropdown-item ${
                            selectedBreed === breed ? "active" : ""
                          }`}
                          onClick={() => {
                            if (breed === "Other") {
                              setShowBreedDropdown(false);
                              setShowOtherBreedPopup(true);
                            } else {
                              setSelectedBreed(breed);
                              setShowBreedDropdown(false);
                              setBreedSearch("");
                            }
                          }}
                        >
                          {breed}
                        </button>
                      ))
                    ) : (
                      <div className="breed-dropdown-empty">No breeds found</div>
                    )}
                  </div>
                </div>
              )}

              {showBreedDropdown && !breedData[selectedPet] && (
                <div className="breed-dropdown">
                  <div className="custom-breed-box">
                    <input
                      type="text"
                      placeholder="Enter breed..."
                      value={selectedBreed}
                      onChange={(e) => setSelectedBreed(e.target.value)}
                    />
                    <button
                      type="button"
                      className="save-breed-btn"
                      onClick={() => setShowBreedDropdown(false)}
                    >
                      Save Breed
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GENDER — direct toggle buttons */}
          <div className="form-group">
            <label>Gender</label>
            <div className="gender-toggle-grid">
              {["Male", "Female"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  className={`gender-toggle-card ${
                    selectedGender === gender ? "active" : ""
                  }`}
                  onClick={() => setSelectedGender(gender)}
                >
                  <span className="gender-icon">
                    {gender === "Male" ? "♂" : "♀"}
                  </span>
                  <span>{gender}</span>
                </button>
              ))}
            </div>
          </div>

          {localError && <div className="submit-error">{localError}</div>}

          <div className="submit-section">
            <button className="continue-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>

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
    const progress = 75;

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
  // STEP 4 — Confirm + Submit
  // ============================================================
  const Step4 = () => {
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
        <StepProgress progress={progress} stepNumber={4} />

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
    default:
      return <Step1 />;
  }
}

export default ProfileCreation;