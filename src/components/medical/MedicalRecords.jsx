import React, { useState, useRef, useEffect, useCallback } from "react";
import "./MedicalRecords.css";

import {
  FolderOpen,
  Upload,
  Camera,
  Image,
  FileText,
  ArrowLeft,
  FileImage,
  File,
  ChevronRight,
  CheckCircle2,
  X,
  Trash2,
} from "lucide-react";
import heroImage from "../../assets/medical-banner.png";
import emptyDog from "../../assets/empty-dog.png";
import ProfileCard from "../Home/ProfileCard/ProfileCard";
import "../Home/ProfileCard/ProfileCard.css";
import TopNav from "../common/TopNav/TopNav";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const categories = [
  "Quick Access",
  "Prescription",
  "Lab Reports",
  "Vaccination",
  "Deworming",
  "Deticking",
  "Anti-rabies",
  "Treatment",
  "Other",
];

export default function MedicalRecords({
  pets,
  activePetId,
  onPetSelect,
  onAddPet,
}) {
  const [activeCategory, setActiveCategory] = useState("Quick Access");
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const handleChooseImage = () => {
    imageInputRef.current?.click();
  };
  const handleChoosePDF = () => {
    pdfInputRef.current?.click();
  };
  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);

  // DB-backed records
  const [dbRecords, setDbRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const activePet = pets?.find((p) => p.id === activePetId) || pets?.[0];
  const petProfileId = activePet?.id;

  // Fetch records from backend
  const fetchRecords = useCallback(async () => {
    if (!petProfileId) return;
    setLoadingRecords(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${API_BASE}/api/medical-records/${petProfileId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (res.ok) {
        const data = await res.json();
        setDbRecords(data);
      }
    } catch (err) {
      console.error("Failed to fetch medical records:", err);
    } finally {
      setLoadingRecords(false);
    }
  }, [petProfileId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Filter records by category
  const getRecordsForCategory = (cat) => {
    if (!cat || cat === "Quick Access") {
      return dbRecords; // Show all records in Quick Access
    }
    const target = cat.toLowerCase().trim();
    return dbRecords.filter((r) => {
      const recCat = (r.category || "").toLowerCase().trim();
      return (
        recCat === target || recCat.includes(target) || target.includes(recCat)
      );
    });
  };

  const currentRecords = getRecordsForCategory(activeCategory);

  // Upload to backend
  const uploadToBackend = async (file, title, category) => {
    if (!petProfileId || !file) return false;
    try {
      const formData = new FormData();
      formData.append("pet_profile_id", petProfileId);
      formData.append("title", title || file.name);
      formData.append("category", category || "Other");
      formData.append("file", file);

      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/medical-records/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        await fetchRecords(); // Refresh records
        return true;
      }
      return false;
    } catch (err) {
      console.error("Upload error:", err);
      return false;
    }
  };

  const startUpload = (file) => {
    setSelectedFile(file);
    setShowUploadSheet(false);
    setShowUploadProgress(true);
    setProgress(0);

    let value = 0;

    const timer = setInterval(() => {
      value += 10;
      setProgress(value);

      if (value >= 100) {
        clearInterval(timer);
        setProgress(100);
      }
    }, 200);
  };

  const [showMetaForm, setShowMetaForm] = useState(false);
  const [formData, setFormData] = useState({
    recordName: "",
    category: "Prescription",
    date: "",
    notes: "",
  });

  // Mobile-friendly category picker state
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const allCategories = [
    "Prescription",
    "Lab Reports",
    "Vaccination",
    "Deworming",
    "Deticking",
    "Anti-rabies",
    "Treatment",
    "Other",
  ];

  const saveCategoryRecord = async () => {
    if (!selectedFile) return;

    const category = formData.category || "Other";
    const title = formData.recordName || selectedFile.name;

    // Upload to backend
    const success = await uploadToBackend(selectedFile, title, category);

    setShowMetaForm(false);
    setSelectedFile(null);
    setFormData({
      recordName: "",
      category: "Prescription",
      date: "",
      notes: "",
    });
    setShowPreview(false);
    setShowUploadSheet(false);

    if (!success) {
      alert("Failed to upload record. Please try again.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const EmptyState = ({ message }) => (
    <div className="empty-card">
      <img src={emptyDog} alt="empty" className="empty-dog" />
      <h3>No Record Found</h3>
      <p>{message}</p>
    </div>
  );

  const deleteRecord = async (recordId) => {
    if (!recordId) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/medical-records/${recordId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setViewRecord(null);
        await fetchRecords();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Helper to format file size
  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="medical-records">
      {/* HEADER */}
      <TopNav />

      {/* PET PROFILE CARD WITH SWITCHER */}
      {pets && pets.length > 0 && (
        <div style={{ padding: "16px 16px 0" }}>
          <ProfileCard
            pets={pets}
            selectedPet={activePet}
            handlePetSelect={onPetSelect}
            onAddPet={onAddPet}
          />
        </div>
      )}

      {/* HERO IMAGE */}
      <section className="hero-banner">
        <img src={heroImage} alt="Medical Banner" />
      </section>

      {/* ACTION BUTTONS */}
      <section className="action-grid">
        <button
          className="action-card"
          onClick={() => {
            setUploadType("quick-access");
            setShowUploadSheet(true);
          }}
        >
          <div className="card-icon">
            <FolderOpen size={28} strokeWidth={2} />
          </div>
          <h3>Quick Access</h3>

          <p>View your important records instantly.</p>
        </button>

        <button
          className="action-card"
          onClick={() => {
            setUploadType("category");
            setShowUploadSheet(true);
          }}
        >
          <div className="card-icon">
            <Upload size={28} strokeWidth={2} />
          </div>

          <h3>Upload via Category</h3>

          <p>Organize and upload records by type.</p>
        </button>
      </section>

      {/* RECORDS */}
      <section className="records-section">
        <div className="section-header">
          <h2>View Records</h2>
        </div>

        <div className="category-scroll">
          {categories.map((item) => (
            <button
              key={item}
              className={`chip ${activeCategory === item ? "active" : ""}`}
              onClick={() => setActiveCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* RECORDS LIST or EMPTY STATE */}
        <div className="empty-state">
          {/* 1. UPLOAD PROGRESS */}
          {showUploadProgress && (
            <div className="uploading-placeholder">
              {progress < 100 ? (
                <>
                  <div className="upload-spinner"></div>
                  <h3>Uploading...</h3>
                </>
              ) : (
                <>
                  <div className="upload-success-icon">
                    <CheckCircle2 size={52} strokeWidth={2.4} />
                  </div>
                  <h3 className="upload-success-text">Uploaded Successfully</h3>
                </>
              )}

              <p>{selectedFile?.name}</p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span>{progress}%</span>

              {progress === 100 && (
                <div className="upload-actions">
                  <button
                    className="preview-btn"
                    onClick={() => setShowPreview(true)}
                  >
                    Preview
                  </button>

                  <button
                    className="save-btn"
                    onClick={async () => {
                      // Upload to backend as quick access
                      await uploadToBackend(
                        selectedFile,
                        selectedFile.name,
                        "Quick Access",
                      );
                      setShowUploadProgress(false);
                      setShowPreview(false);
                      setSelectedFile(null);
                      setProgress(0);
                    }}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. RECORDS FROM DB */}
          {!showUploadProgress &&
            (loadingRecords ? (
              <div className="records-loading">
                <div className="upload-spinner"></div>
                <p>Loading records...</p>
              </div>
            ) : currentRecords.length > 0 ? (
              <div className="records-list">
                {currentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="record-card"
                    onClick={() => setViewRecord(record)}
                  >
                    <div className="record-icon">
                      {record.file_type?.includes("pdf") ? (
                        <File size={30} />
                      ) : (
                        <FileImage size={30} />
                      )}
                    </div>

                    <div className="record-details">
                      <h4>{record.title || record.file_name}</h4>
                      <p>{record.category}</p>
                      <span>
                        {record.created_at
                          ? new Date(record.created_at).toLocaleDateString()
                          : ""}
                        {record.file_size
                          ? ` · ${formatSize(record.file_size)}`
                          : ""}
                      </span>
                    </div>

                    <div className="record-chevron">
                      <ChevronRight size={18} color="#999" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                message={
                  activeCategory === "Quick Access"
                    ? "Start by uploading your medical records"
                    : `No records in ${activeCategory}`
                }
              />
            ))}
        </div>
      </section>

      {/* FILE CHOOSING UPLOAD POPUP */}
      {showUploadSheet && (
        <div
          className="sheet-overlay"
          onClick={() => setShowUploadSheet(false)}
        >
          <div className="upload-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle"></div>

            <div className="upload-icon">
              <Upload size={36} strokeWidth={2.2} />
            </div>

            <h3>Upload Medical File</h3>

            <button className="upload-option" onClick={handleTakePhoto}>
              <Camera size={20} />
              <span>Take Photo</span>
            </button>
            {/* Camera */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                if (uploadType === "quick-access") {
                  startUpload(file);
                } else if (uploadType === "category") {
                  setSelectedFile(file);
                  setShowUploadSheet(false);
                  setShowMetaForm(true);
                }
              }}
            />

            <button className="upload-option" onClick={handleChooseImage}>
              <Image size={20} />
              <span>Choose Image</span>
            </button>
            {/* Gallery */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                if (uploadType === "quick-access") {
                  startUpload(file);
                } else if (uploadType === "category") {
                  setSelectedFile(file);
                  setShowUploadSheet(false);
                  setShowMetaForm(true);
                }
              }}
            />

            <button className="upload-option" onClick={handleChoosePDF}>
              <FileText size={20} />
              <span>Select PDF</span>
            </button>
            {/* PDF */}
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                if (uploadType === "quick-access") {
                  startUpload(file);
                } else if (uploadType === "category") {
                  setSelectedFile(file);
                  setShowUploadSheet(false);
                  setShowMetaForm(true);
                }
              }}
            />

            <button
              className="cancel-btn"
              onClick={() => setShowUploadSheet(false)}
            >
              ✖ Cancel
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW IMAGE (for newly selected file) */}
      {showPreview && selectedFile && (
        <div className="preview-overlay">
          <div className="preview-card">
            <button
              className="back-btn"
              onClick={() => {
                setShowPreview(false);
              }}
            >
              <ArrowLeft size={22} />
            </button>

            {selectedFile.type.startsWith("image") ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt=""
                className="preview-image"
              />
            ) : (
              <iframe
                title="pdf"
                src={`${URL.createObjectURL(selectedFile)}#toolbar=0&navpanes=0&scrollbar=0`}
                className="preview-pdf"
              />
            )}
          </div>
        </div>
      )}

      {/* VIEW RECORD (from DB — uses URL) */}
      {viewRecord && (
        <div className="file-view-overlay" onClick={() => setViewRecord(null)}>
          <div className="file-view-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setViewRecord(null)}>
              <X size={22} />
            </button>

            <div className="file-view-header">
              <h3>{viewRecord.title || viewRecord.file_name}</h3>
              <p>
                {viewRecord.category}
                {viewRecord.created_at &&
                  ` · ${new Date(viewRecord.created_at).toLocaleDateString()}`}
              </p>
            </div>

            <div className="file-view-content">
              {viewRecord.file_type?.startsWith("image") ? (
                <img src={viewRecord.file_url} alt="Medical record" />
              ) : (
                <iframe
                  src={`${viewRecord.file_url}#toolbar=0&navpanes=0`}
                  title="PDF"
                />
              )}
            </div>

            <button
              className="delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={20} />
              Delete Record
            </button>

            {showDeleteConfirm && (
              <div className="confirm-dialog">
                <p>Delete this record?</p>
                <div className="confirm-actions">
                  <button
                    className="confirm-yes"
                    onClick={() => {
                      deleteRecord(viewRecord.id);
                      setShowDeleteConfirm(false);
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="confirm-no"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATEGORY META FORM */}
      {showMetaForm && selectedFile && (
        <div className="meta-overlay">
          <div className="meta-modal">
            <h3>Record Details</h3>

            {/* Record Name */}
            <input
              name="recordName"
              placeholder="Enter record name"
              value={formData.recordName}
              onChange={handleFormChange}
              className="input"
            />

            {/* Category — Mobile-friendly picker */}
            <div className="category-row">
              <button
                type="button"
                className="category-picker-btn"
                onClick={() => setShowCategoryPicker(true)}
              >
                <span>{formData.category}</span>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Date */}
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              className="input"
            />

            {/* Notes */}
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={handleFormChange}
              className="textarea"
            />

            {/* ACTION BUTTONS */}
            <div className="form-actions">
              <button onClick={saveCategoryRecord}>Save</button>
              <button
                className="form-cancel-btn"
                onClick={() => {
                  setShowMetaForm(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE CATEGORY PICKER BOTTOM SHEET */}
      {showCategoryPicker && (
        <div
          className="sheet-overlay"
          onClick={() => setShowCategoryPicker(false)}
        >
          <div className="category-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle"></div>
            <h3>Select Category</h3>
            <div className="category-options">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  className={`category-option ${formData.category === cat ? "active" : ""}`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, category: cat }));
                    setShowCategoryPicker(false);
                  }}
                >
                  <span className="category-option-text">{cat}</span>
                  {formData.category === cat && (
                    <CheckCircle2 size={20} className="category-check" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
