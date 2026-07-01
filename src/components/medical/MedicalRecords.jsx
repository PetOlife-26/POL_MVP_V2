import React, { useState, useRef, useCallback } from "react";
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

export default function MedicalRecords() {
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
  const [quickAccessRecords, setQuickAccessRecords] = useState([]);
  const [uploadType, setUploadType] = useState("");
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [viewFile, setViewFile] = useState(null);
  const [showUploadChoice, setShowUploadChoice] = useState(false);

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

  const [categoryRecords, setCategoryRecords] = useState({});
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [formData, setFormData] = useState({
    recordName: "",
    category: "Prescription",
    date: "",
    notes: "",
  });

  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const currentRecords = categoryRecords[activeCategory] || [];

  const allCategories = [
    "Quick Access",
    ...customCategories,
    "Prescription",
    "Lab Reports",
    "Vaccination",
    "Deworming",
    "Deticking",
    "Anti-rabies",
    "Treatment",
    "Other",
  ];

  const saveCategoryRecord = () => {
    if (!selectedFile) return;

    const category = formData.category || "Other";

    const newRecord = {
      file: selectedFile,
      name: formData.recordName || selectedFile.name,
      category,
      date: formData.date,
      notes: formData.notes,
      type: selectedFile.type,
      size: selectedFile.size,
      uploadedAt: new Date().toLocaleDateString(),
    };

    setCategoryRecords((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newRecord],
    }));

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

      <button
        className="upload-record-btn"
        onClick={() => setShowUploadChoice(true)}
      >
        Upload Record
      </button>
    </div>
  );

  const deleteRecord = () => {
    if (!viewFile) return;

    setQuickAccessRecords((prev) =>
      prev.filter((item) => item.file !== viewFile),
    );

    setCategoryRecords((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((cat) => {
        updated[cat] = updated[cat].filter((item) => item.file !== viewFile);
      });

      return updated;
    });

    setViewFile(null);
  };
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="medical-records">
      {/* HEADER */}
      <TopNav />

      <header className="mr-header">
        <h1>Medical Records</h1>
      </header>

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

        {/* EMPTY STATE */}
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
                    onClick={() => {
                      setQuickAccessRecords((prev) => [
                        ...prev,
                        {
                          file: selectedFile,
                          name: formData.recordName || selectedFile.name,
                          size: selectedFile.size,
                          type: selectedFile.type,
                          uploadedAt: new Date().toLocaleDateString(),
                        },
                      ]);

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

          {/* 2. QUICK ACCESS */}
          {!showUploadProgress &&
            activeCategory === "Quick Access" &&
            (quickAccessRecords.length > 0 ? (
              <div className="records-list">
                {quickAccessRecords.map((record, index) => (
                  <div
                    key={index}
                    className="record-card"
                    onClick={() => setViewFile(record.file)}
                  >
                    <div className="record-icon">
                      {record.type.includes("pdf") ? (
                        <File size={30} />
                      ) : (
                        <FileImage size={30} />
                      )}
                    </div>

                    <div className="record-details">
                      <h4>{record.name}</h4>
                      <p>
                        {record.type.includes("pdf")
                          ? "PDF Document"
                          : "Image File"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Start by uploading your medical records" />
            ))}

          {/* 3. CATEGORY RECORDS */}
          {!showUploadProgress &&
            activeCategory !== "Quick Access" &&
            (currentRecords.length > 0 ? (
              <div className="records-list">
                {currentRecords.map((record, index) => (
                  <div
                    key={index}
                    className="record-card"
                    onClick={() => setViewFile(record.file)}
                  >
                    <div className="record-icon">
                      {record.type.includes("pdf") ? (
                        <File size={30} />
                      ) : (
                        <FileImage size={30} />
                      )}
                    </div>

                    <div className="record-details">
                      <h4>{record.name}</h4>
                      <p>{record.category}</p>
                      <span>{record.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={`No records in ${activeCategory}`} />
            ))}
        </div>
      </section>

      {/* Upload Choice Popup */}

      {showUploadChoice && (
        <div
          className="sheet-overlay"
          onClick={() => setShowUploadChoice(false)}
        >
          <div className="choice-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Choose Upload Method</h3>

            <button
              className="choice-btn"
              onClick={() => {
                setUploadType("quick-access");
                setShowUploadChoice(false);
                setShowUploadSheet(true);
              }}
            >
              Quick Access
            </button>

            <button
              className="choice-btn"
              onClick={() => {
                setUploadType("category");
                setShowUploadChoice(false);
                setShowUploadSheet(true);
              }}
            >
              Upload via Category
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowUploadChoice(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/*file choosing for upload-pop-up*/}
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

      {/*preview image*/}

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

      {/*preview after upload*/}
      {viewFile && (
        <div className="file-view-overlay" onClick={() => setViewFile(null)}>
          <div className="file-view-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setViewFile(null)}>
              <X size={22} />
            </button>

            <div className="file-view-content">
              {viewFile.type.startsWith("image") ? (
                <img src={URL.createObjectURL(viewFile)} alt="Preview" />
              ) : (
                <iframe
                  src={`${URL.createObjectURL(viewFile)}#toolbar=0&navpanes=0`}
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
                      deleteRecord();
                      setShowDeleteConfirm(false);
                      setViewFile(null);
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

            {/* Category + Add Button */}
            <div className="category-row">
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Category Input */}
            {showAddCategory && (
              <div className="add-category-box">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                />
                <button onClick={addCustomCategory}>Add</button>
              </div>
            )}

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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
