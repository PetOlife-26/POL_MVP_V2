import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MedicalRecords.css";

import heroBg from "../../assets/hero-bg.png";
import dogImg from "../../assets/upload.png";
import doctorDogImg from "../../assets/doctor-check-dog.png";
import emptyRecords from "../../assets/empty.png";
import brunoImg from "../../assets/bruno.png";
import bellaImg from "../../assets/cat.png";

import {
  FiUploadCloud,
  FiCamera,
  FiImage,
  FiFileText,
  FiSearch,
  FiChevronRight,
  FiMoreVertical,
  FiEye,
} from "react-icons/fi";

const CATEGORIES = [
  "Vaccination Record",
  "Prescription",
  "Lab Report",
  "Medical Report",
  "Other",
];

function MedicalRecords({ records = [], setRecords, pets = [], activePetId }) {
  const navigate = useNavigate();

  // ---- shared pet selection (drives both upload + records list) ----
  const [selectedPet, setSelectedPet] = useState(activePetId || (pets.length > 0 ? pets[0].id : null));
  const [showPetDropdown, setShowPetDropdown] = useState(false);

  // Keep selectedPet in sync if activePetId changes from parent
  useEffect(() => {
    if (activePetId) setSelectedPet(activePetId);
  }, [activePetId]);

  const currentPet = pets.find((p) => p.id === selectedPet) || pets[0] || {};

  // Helper to calculate age (similar to PetCard)
  const getAge = (birthDate) => {
    if (!birthDate) return "Unknown Age";
    const dob = new Date(birthDate);
    if (isNaN(dob.getTime())) return "Unknown Age";
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    const y = Math.abs(ageDate.getUTCFullYear() - 1970);
    const m = ageDate.getUTCMonth();
    if (y === 0 && m === 0) return 'Newborn';
    if (y === 0) return `${m} month${m > 1 ? 's' : ''}`;
    if (m === 0) return `${y} year${y > 1 ? 's' : ''}`;
    return `${y}y ${m}m`;
  };

  // ---- upload flow state ----
  const [pendingFiles, setPendingFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [recordTitle, setRecordTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // ---- records list / search / filter state ----
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setPendingFiles(files);
    setShowModal(true);
  };

  const saveRecord = () => {
    const uploadedFiles = pendingFiles.map((file) => ({
      id: Date.now() + Math.random(),
      petId: selectedPet,
      name: recordTitle || file.name,
      file,
      type: file.type,
      size: file.size,
      date: new Date().toLocaleDateString("en-GB"),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      thumbnail: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      category: selectedCategory,
    }));

    setRecords((prev) => [...uploadedFiles, ...prev]);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 2000);

    setShowModal(false);
    setSelectedCategory("");
    setRecordTitle("");
    setPendingFiles([]);
  };

  // ---- derived data ----
  const petRecords = useMemo(
    () => records.filter((r) => r.petId === selectedPet),
    [records, selectedPet]
  );

  const filteredRecords = useMemo(() => {
    return petRecords.filter((record) => {
      const name = (record.name || "").toLowerCase();
      const matchesSearch = name.includes(searchQuery.toLowerCase());
      if (activeTab === "All") return matchesSearch;
      return matchesSearch && record.category === activeTab;
    });
  }, [petRecords, searchQuery, activeTab]);

  const counts = useMemo(() => {
    const getCount = (cat) =>
      petRecords.filter((r) => r.category === cat).length;
    return {
      total: petRecords.length,
      lab: getCount("Lab Report"),
      prescription: getCount("Prescription"),
      vaccine: getCount("Vaccination Record"),
      medical: getCount("Medical Report"),
      other: getCount("Other"),
    };
  }, [petRecords]);

  // Quick preview list (top 3) shown right under the upload card,
  // expands into the full searchable/filterable list on "View All".
  const previewRecords = petRecords.slice(0, 3);

  return (
    <div className="medical-records-page">
      {/* ===================== HERO ===================== */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-content">
          <h1>
            Your Pet's <br />
            <span>Digital Medical</span> <br />
            Vault
          </h1>
          <p>
            Store prescriptions, lab reports, vaccination cards, and other
            important medical records securely in one place.
          </p>
        </div>
              <div className="hero-visual">
                
              </div>
      </section>

      <div className="records-container">
        {/* ===================== PET SELECTOR ===================== */}
        <div className="pet-selector-section">
          <h3>Select Pet</h3>

          <div
            className="selected-pet-card"
            onClick={() => setShowPetDropdown(!showPetDropdown)}
          >
            <div className="selected-pet-left">
              <img
                src={currentPet.pet_photo_url || brunoImg}
                alt={currentPet.pet_name || "Pet"}
                className="selected-pet-avatar"
              />
              <div>
                <h4>{currentPet.pet_name || "No Pet Selected"}</h4>
                <span>
                  {currentPet.breed || currentPet.pet_type || "Unknown"} • {getAge(currentPet.birth_date)}
                </span>
              </div>
            </div>

            <div className={`dropdown-arrow ${showPetDropdown ? "rotate" : ""}`}>
              ▾
            </div>
          </div>

          {showPetDropdown && (
            <div className="pet-dropdown-menu">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={`dropdown-pet ${
                    selectedPet === pet.id ? "active-pet" : ""
                  }`}
                  onClick={() => {
                    setSelectedPet(pet.id);
                    setShowPetDropdown(false);
                  }}
                >
                  <img src={pet.pet_photo_url || brunoImg} alt={pet.pet_name} />
                  <div>
                    <h4>{pet.pet_name}</h4>
                    <span>{pet.breed || pet.pet_type}</span>
                  </div>
                </div>
              ))}
              <button className="add-pet-btn" onClick={() => navigate("/create-pet-profile")}>+ Add New Pet</button>
            </div>
          )}
        </div>

        {/* ===================== UPLOAD CARD ===================== */}
        <div className="upload-card">
          <div className="drop-area">
            <FiUploadCloud className="upload-icon" />
            <h3>Drag or Drop Files Here</h3>
            <p>or tap to browse</p>

            <input
              type="file"
              id="fileUpload"
              multiple
              hidden
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />

            <img src={dogImg} alt="Dog" className="upload-dog" />

            <label htmlFor="fileUpload" className="browse-btn">
              Browse Files
            </label>

            <div className="file-options">
              <div className="option-card">
                <FiCamera />
                <span>Camera</span>
              </div>
              <div className="option-card">
                <FiImage />
                <span>Image</span>
              </div>
              <div className="option-card">
                <FiFileText />
                <span>PDF</span>
              </div>
            </div>

            <small>Minimum 1 MB file allowed</small>
          </div>
        </div>

        {/* ===================== QUICK PREVIEW LIST ===================== */}
        {!showAllRecords && petRecords.length > 0 && (
          <div className="records-section">
            <div className="records-header-row">
              <h2>Medical Records</h2>
              <span
                className="view-all-link"
                onClick={() => setShowAllRecords(true)}
              >
                <FiEye className="eye-icon" />
                View All
              </span>
            </div>

            <div className="records-list">
              {previewRecords.map((record) => (
                <div
                  className="record-card"
                  key={record.id}
                  onClick={() => setSelectedFile(record)}
                >
                  <div className="record-thumbnail">
                    {record.thumbnail ? (
                      <img src={record.thumbnail} alt={record.name} />
                    ) : (
                      <div className="pdf-box">
                        <FiFileText />
                      </div>
                    )}
                  </div>

                  <div className="record-details">
                    <h4>{record.name}</h4>
                    <span className="category-chip">{record.category}</span>
                    <div className="record-meta">
                      <span>{record.date}</span>
                      <span>
                        {record.size > 1024 * 1024
                          ? `${(record.size / 1024 / 1024).toFixed(1)} MB`
                          : `${(record.size / 1024).toFixed(0)} KB`}
                      </span>
                    </div>
                  </div>

                  <FiChevronRight className="record-arrow" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== FULL RECORDS VIEW (search + chips) ===================== */}
        {showAllRecords && (
          <div className="full-records-section">
            <div className="top-bar">
              <span
                className="view-all-link back-link"
                onClick={() => setShowAllRecords(false)}
              >
                ← Back
              </span>

              <div className="search-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="chips-container">
              <button
                className={`chip chip-all ${activeTab === "All" ? "active" : ""}`}
                onClick={() => setActiveTab("All")}
              >
                All ({counts.total})
              </button>
              <button
                className={`chip chip-lab ${activeTab === "Lab Report" ? "active" : ""}`}
                onClick={() => setActiveTab("Lab Report")}
              >
                Lab ({counts.lab})
              </button>
              <button
                className={`chip chip-rx ${activeTab === "Prescription" ? "active" : ""}`}
                onClick={() => setActiveTab("Prescription")}
              >
                Rx ({counts.prescription})
              </button>
              <button
                className={`chip chip-vac ${
                  activeTab === "Vaccination Record" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Vaccination Record")}
              >
                Vaccine ({counts.vaccine})
              </button>
              <button
                className={`chip chip-med ${
                  activeTab === "Medical Report" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Medical Report")}
              >
                Medical ({counts.medical})
              </button>
              <button
                className={`chip chip-other ${activeTab === "Other" ? "active" : ""}`}
                onClick={() => setActiveTab("Other")}
              >
                Other ({counts.other})
              </button>
            </div>

            <div className="medical-list">
              {filteredRecords.length === 0 ? (
                <div className="empty-state">
                  <img src={emptyRecords} alt="empty" />
                  <h3>No Records Yet</h3>
                  <p>
                    Upload prescriptions, lab reports, vaccination records and
                    more.
                  </p>
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div
                    className="medical-card"
                    key={record.id}
                    onClick={() => setSelectedFile(record)}
                  >
                    <div className="card-left-section">
                      {record.thumbnail ? (
                        <img
                          src={record.thumbnail}
                          alt={record.name}
                          className="card-thumb"
                        />
                      ) : (
                        <div className="card-thumb pdf-fallback">
                          <FiFileText />
                        </div>
                      )}

                      <div className="card-info">
                        <span
                          className={`badge badge-${record.category
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {record.category || "Other"}
                        </span>
                        <h3>{record.name}</h3>
                        <div className="card-timestamp">
                          <span className="date-text">{record.date}</span>
                          <span className="divider-dot">•</span>
                          <span className="time-text">
                            {record.time || "12:00 PM"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="card-right-actions">
                      <FiMoreVertical className="action-dots" />
                      <FiChevronRight className="action-arrow" />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="banner-illustration">
              <img src={doctorDogImg} alt="Doctor checking dog" />
            </div>
          </div>
        )}
      </div>

      {/* ===================== PREVIEW MODAL ===================== */}
      {selectedFile && (
        <div className="preview-overlay" onClick={() => setSelectedFile(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedFile(null)}>
              ×
            </button>

            <h3>{selectedFile.name}</h3>

            {selectedFile.type?.includes("pdf") ? (
              <iframe
                src={URL.createObjectURL(selectedFile.file)}
                title="PDF Preview"
                className="pdf-frame"
              />
            ) : (
              <img
                src={selectedFile.thumbnail}
                alt={selectedFile.name}
                className="preview-image"
              />
            )}
          </div>
        </div>
      )}

      {/* ===================== CATEGORY / TITLE MODAL ===================== */}
      {showModal && (
        <div className="preview-overlay">
          <div className="category-modal">
            <h3>Record Details</h3>

            <input
              type="text"
              placeholder="Record Title"
              value={recordTitle}
              onChange={(e) => setRecordTitle(e.target.value)}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              className="save-record-btn"
              onClick={saveRecord}
              disabled={!selectedCategory}
            >
              Save Record
            </button>
          </div>
        </div>
      )}

      {/* ===================== SUCCESS TOAST ===================== */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-box">
            <div className="success-check">✓</div>
            <h3>Uploaded Successfully</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalRecords;