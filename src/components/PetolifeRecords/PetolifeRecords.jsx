import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Bell,
  Pencil,
  ShieldCheck,
  ChevronRight,
  Eye,
  MoreVertical,
  Home,
  Folder,
  Plus,
  MessageCircle,
  User,
  X,
  Camera,
  Images,
  FileText,
  Upload,
  Clock,
} from "lucide-react";

import "./PetolifeRecords.css";

import logo from "../../assets/petolife-logo.png";
import petPhoto from "../../assets/bruno.png";
import petPhoto1 from "../../assets/anudogy.png";
import petPhoto2 from "../../assets/divya.png";

const T = {
  teal: "#0b6b3a",
  tealDark: "#08552e",
  tealLight: "#d8f2e2",
  tealSoft: "#f2fbf5",
  green: "#4caf50",
  greenLight: "#e4f5e5",
  gray: "#6b7280",
  dark: "#111827",
  border: "#cde8d7",
  white: "#ffffff",
};

const PETS = {
  bruno: {
    name: "Bruno",
    image: petPhoto,
    breed: "Golden Retriever",
    gender: "Male",
    age: "2 Years",
    id: "PET-BRUNO-001",
  },
  anu: {
    name: "Anu dogy",
    image: petPhoto1,
    breed: "Golden Retriever",
    gender: "Male",
    age: "2 Years",
    id: "PET-ANUDOGY-002",
  },
  divya: {
    name: "divya",
    image: petPhoto2,
    breed: "Golden Retriever",
    gender: "Male",
    age: "2 Years",
    id: "PET-DIVYA-003",
  },
};

const PawIcon = ({ size = 140 }) => (
  <svg className="pl-dropzone-paw" viewBox="0 0 64 64" width={size} height={size} fill="#d8f2e2">
    <ellipse cx="32" cy="40" rx="15" ry="13" />
    <ellipse cx="14" cy="26" rx="7" ry="9" />
    <ellipse cx="50" cy="26" rx="7" ry="9" />
    <ellipse cx="22" cy="12" rx="6" ry="8" />
    <ellipse cx="42" cy="12" rx="6" ry="8" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg
    viewBox="0 0 64 64"
    width="56"
    height="56"
    fill="none"
    stroke="#0b6b3a"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 44h-2a10 10 0 0 1-1-19.9A14 14 0 0 1 42 18a11 11 0 0 1 4 21.3" />
    <path d="M32 50V30" />
    <path d="M24 38l8-8 8 8" />
  </svg>
);

const FileBadge = ({ type }) => {
  const palette = {
    PDF: { fg: "#b8520a", bg: "#fde8d8" },
    JPG: { fg: "#0b6b3a", bg: "#d8f2e2" },
    JPEG: { fg: "#0b6b3a", bg: "#d8f2e2" },
    PNG: { fg: "#4caf50", bg: "#e4f5e5" },
    DOC: { fg: "#1d4ed8", bg: "#e0eeff" },
    DOCX: { fg: "#1d4ed8", bg: "#e0eeff" },
  };
  const c = palette[type] || palette.PDF;
  return (
    <svg viewBox="0 0 40 44" width="34" height="38">
      <path
        d="M4 2h22l10 10v28a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        fill={c.bg}
        stroke={c.fg}
        strokeWidth="1.5"
      />
      <path d="M26 2v10h10" fill="none" stroke={c.fg} strokeWidth="1.5" />
      <text x="20" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={c.fg}>
        {type.length > 4 ? type.slice(0, 4) : type}
      </text>
    </svg>
  );
};

const formatDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const formatTime = (d) =>
  d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

function FileViewer({ file, onClose }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getFileUrl = () => {
    if (file.url) return file.url;
    return localStorage.getItem(`file_${file.id}`) || "";
  };

  const fileUrl = getFileUrl();

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100000,
    padding: isMobile ? "0" : "20px",
  };

  const viewerStyle = {
    background: T.white,
    borderRadius: isMobile ? "0" : "16px",
    width: isMobile ? "100%" : "90%",
    height: isMobile ? "100%" : "90%",
    maxWidth: isMobile ? "100%" : "1200px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "12px 16px" : "16px 24px",
    background: "#f2fbf5",
    borderBottom: `1px solid ${T.border}`,
    minWidth: 0,
  };

  const titleStyle = {
    margin: 0,
    fontSize: isMobile ? "15px" : "18px",
    fontWeight: 700,
    color: T.teal,
    maxWidth: isMobile ? "200px" : "400px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  };

  const closeBtnStyle = {
    width: isMobile ? "36px" : "40px",
    height: isMobile ? "36px" : "40px",
    borderRadius: "50%",
    border: "none",
    background: T.teal,
    color: T.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    overflow: "auto",
    padding: isMobile ? "0" : "20px",
    minHeight: 0,
  };

  const fileContent = () => {
    if (!fileUrl) return <p style={{ color: T.gray }}>File not found</p>;

    const ext = file.type.toUpperCase();

    if (ext === "PDF") {
      return <iframe src={fileUrl} style={{ width: "100%", height: "100%", border: "none" }} title={file.name} />;
    } else if (ext === "JPG" || ext === "JPEG" || ext === "PNG") {
      return (
        <img
          src={fileUrl}
          alt={file.name}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      );
    } else {
      return (
        <div style={{ textAlign: "center", color: T.gray }}>
          <FileBadge type={file.type} />
          <p style={{ marginTop: "16px", fontSize: isMobile ? "14px" : "16px" }}>{file.name}</p>
          <p style={{ fontSize: isMobile ? "12px" : "14px" }}>{file.size}</p>
          <p style={{ fontSize: "12px", marginTop: "8px" }}>{ext} files are displayed in their native format</p>
        </div>
      );
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={viewerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{file.name}</h3>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Close">
            <X size={isMobile ? 18 : 20} />
          </button>
        </div>
        <div style={contentStyle}>{fileContent()}</div>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onFiles }) {
  const photoRef = useRef(null);
  const imageRef = useRef(null);
  const pdfRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handle = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    onFiles(files);
    onClose();
  };

  const options = [
    {
      ref: photoRef,
      accept: "image/*",
      capture: "environment",
      icon: <Camera size={24} color={T.teal} />,
      iconBg: T.tealLight,
      title: "Take Photo",
      sub: "Capture report instantly with camera",
    },
    {
      ref: imageRef,
      accept: "image/*",
      multiple: true,
      icon: <Images size={24} color={T.green} />,
      iconBg: T.greenLight,
      title: "Upload Images",
      sub: "Select one or multiple image files",
    },
    {
      ref: pdfRef,
      accept: ".pdf",
      multiple: true,
      icon: <FileText size={24} color="#b8520a" />,
      iconBg: "#fde8d8",
      title: "Upload PDF",
      sub: "Single or multi-page documents",
    },
  ];

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    padding: isMobile ? "12px" : "16px",
  };

  const modalStyle = {
    background: T.white,
    borderRadius: isMobile ? "20px" : "24px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 24px 60px rgba(30,107,58,0.22)",
    overflow: "hidden",
    fontFamily: '"Segoe UI", Arial, sans-serif',
  };

  const stripStyle = {
    background: `linear-gradient(135deg, ${T.teal} 0%, ${T.green} 100%)`,
    padding: isMobile ? "16px 16px 12px" : "20px 20px 16px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: isMobile ? "18px" : "20px",
    fontWeight: 800,
    color: T.white,
    lineHeight: 1.2,
  };

  const subStyle = {
    margin: "4px 0 0",
    fontSize: isMobile ? "12px" : "13px",
    color: "rgba(255,255,255,0.82)",
    lineHeight: 1.5,
  };

  const closeBtnStyle = {
    flexShrink: 0,
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.20)",
    color: T.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const bodyStyle = {
    padding: isMobile ? "12px 12px 16px" : "16px 16px 20px",
  };

  const optBase = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "12px" : "14px",
    width: "100%",
    border: `1.5px solid ${T.border}`,
    borderRadius: isMobile ? "12px" : "14px",
    padding: isMobile ? "12px 12px" : "14px 14px",
    cursor: "pointer",
    textAlign: "left",
    background: T.white,
    marginBottom: "10px",
    transition: "border-color 0.15s, background 0.15s",
    minWidth: 0,
  };

  const optHovered = {
    ...optBase,
    borderColor: T.teal,
    background: T.tealSoft,
  };

  const iconWrapStyle = (bg) => ({
    width: isMobile ? "42px" : "46px",
    height: isMobile ? "42px" : "46px",
    borderRadius: isMobile ? "10px" : "12px",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  const optTitleStyle = {
    display: "block",
    fontSize: isMobile ? "14px" : "15px",
    fontWeight: 700,
    color: T.dark,
    margin: 0,
  };

  const optSubStyle = {
    display: "block",
    fontSize: isMobile ? "11px" : "12px",
    color: T.gray,
    margin: "2px 0 0",
  };

  const footerStyle = {
    borderTop: `1px solid ${T.border}`,
    padding: isMobile ? "12px 14px 14px" : "14px 16px 16px",
    textAlign: "center",
  };

  const petPillStyle = {
    fontSize: isMobile ? "11px" : "12px",
    color: T.gray,
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    flexWrap: "wrap",
  };

  const dotStyle = {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: T.green,
    display: "inline-block",
  };

  const cancelStyle = {
    width: "100%",
    height: isMobile ? "44px" : "48px",
    border: "none",
    borderRadius: isMobile ? "10px" : "12px",
    background: `linear-gradient(135deg, ${T.teal} 0%, ${T.green} 100%)`,
    color: T.white,
    fontSize: isMobile ? "14px" : "15px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(30,107,58,0.25)",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={stripStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1, minWidth: 0 }}>
            <div>
              <p style={titleStyle}>Upload Record</p>
              <p style={subStyle}>
                Case sheet, prescription, vaccination or lab report. PetoLife AI reads and organises it automatically.
              </p>
            </div>
          </div>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div style={bodyStyle}>
          {options.map(({ ref, accept, capture, multiple, icon, iconBg, title, sub }, i) => (
            <button
              key={title}
              style={hovered === i ? optHovered : optBase}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => ref.current.click()}
            >
              <span style={iconWrapStyle(iconBg)}>{icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={optTitleStyle}>{title}</span>
                <span style={optSubStyle}>{sub}</span>
              </span>
              <ChevronRight size={isMobile ? 16 : 18} color={hovered === i ? T.teal : "#c4d4d4"} />
              <input
                ref={ref}
                type="file"
                accept={accept}
                capture={capture}
                multiple={multiple}
                onChange={handle}
                style={{ display: "none" }}
              />
            </button>
          ))}
        </div>

        <div style={footerStyle}>
          <div style={petPillStyle}>
            <span style={dotStyle} />
            <span>Bruno</span>
            <span style={{ color: "#d1d5db" }}>•</span>
            <span>PET-BRUNO-001</span>
            <span style={{ color: "#d1d5db" }}>•</span>
            <span>Up to 10 pages</span>
          </div>
          <button style={cancelStyle} onClick={onClose}>
            Save & Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PetoLifeRecords() {
  const [selectedPet, setSelectedPet] = useState("bruno");
  const [showPetModal, setShowPetModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [records, setRecords] = useState([]);

  const currentPet = PETS[selectedPet];
  const petRecords = records.filter((r) => r.petId === selectedPet);

  useEffect(() => {
    const storedRecords = localStorage.getItem("petolife_records");
    if (storedRecords) {
      try {
        setRecords(JSON.parse(storedRecords));
      } catch (e) {
        console.error("Failed to parse stored records:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem("petolife_records", JSON.stringify(records));
    }
  }, [records]);

  const handleFiles = (files) => {
    const now = new Date();
    const uploaded = files.map((file) => {
      const ext = file.name.split(".").pop().toUpperCase();
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        name: file.name,
        date: formatDate(now),
        time: formatTime(now),
        size:
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`,
        type: ext,
        isNew: true,
        id: fileId,
        url: null,
        petId: selectedPet,
      };
    });

    uploaded.forEach((record, index) => {
      const file = files[index];
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        localStorage.setItem(record.id, fileData);
        setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, url: fileData } : r)));
      };
      reader.readAsDataURL(file);
    });

    setRecords((prev) => [...uploaded, ...prev]);
  };

  const handleFileClick = (file) => {
    setViewingFile({
      ...file,
      url: file.url || localStorage.getItem(file.id),
    });
  };

  const aiSection = (
    <section className="pl-ai-card">
      <div className="pl-ai-content">
        <div className="pl-ai-left">
          <div className="pl-ai-title-row">
            <h3>AI Document Reading</h3>
            <span className="pl-ai-badge">Coming Soon</span>
          </div>

          <p>
            We're working on AI-powered document reading and information extraction to make pet care easier and smarter.
          </p>

          <div className="pl-ai-progress-box">
            <div className="pl-ai-progress-header">
              <span className="pl-ai-sparkle">✦</span>
              <span>Analyzing documents...</span>
            </div>

            <div className="pl-ai-progress-bar">
              <div className="pl-ai-progress-fill"></div>
            </div>

            <span className="pl-ai-percent">60%</span>
          </div>
        </div>

        <div className="pl-ai-right">
          <div className="pl-ai-robot-wrap">
            <div className="pl-ai-circle"></div>

            <div className="pl-ai-stars">
              <span>✨</span>
              <span>✨</span>
              <span>✨</span>
            </div>

            <div className="pl-ai-document">
              <div className="pl-ai-doc-line"></div>
              <div className="pl-ai-doc-line short"></div>
              <div className="pl-ai-doc-check"></div>
              <div className="pl-ai-doc-check"></div>
            </div>

            <div className="pl-ai-robot">
              <div className="pl-ai-head">
                <div className="pl-ai-face">
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="pl-ai-body"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (showAllRecords) {
    return (
      <div className="pl-page">
        <div className="pl-card">
          <header className="pl-header">
            <button className="pl-back-btn" onClick={() => setShowAllRecords(false)} aria-label="Back">
              <ChevronLeft size={24} />
            </button>
            <h2 className="pl-page-title">Medical Records</h2>
            <div style={{ width: 24 }} />
          </header>

          <main className="pl-main">
            <div className="pl-all-records">
              {petRecords.length === 0 && <p className="pl-empty-state">No records uploaded yet.</p>}

              {petRecords.map((file, i) => (
                <div
                  className={`pl-record-item ${file.isNew ? "pl-record-item--new" : ""}`}
                  key={file.name + i}
                  onClick={() => handleFileClick(file)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="pl-record-left">
                    <FileBadge type={file.type} />
                  </div>

                  <div className="pl-record-info">
                    <p className="pl-record-name">{file.name}</p>
                    <p className="pl-record-meta">
                      <Clock size={11} style={{ marginRight: 4, verticalAlign: "middle", flexShrink: 0 }} />
                      <span>{file.date} · {file.time}</span>
                    </p>
                  </div>

                  <div className="pl-record-right">
                    {file.isNew && <span className="pl-new-badge">New</span>}
                    <span className="pl-record-size">{file.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {aiSection}
        </div>

        {viewingFile && <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />}
      </div>
    );
  }

  return (
    <div className="pl-page">
      <div className="pl-card">
        <main className="pl-main">
          <section className="pl-profile">
            <div className="pl-profile-left">
              <div className="pl-avatar-wrap">
                <img src={currentPet.image} alt={currentPet.name} className="pl-avatar-img" />
              </div>
              <div className="pl-profile-text">
                <div className="pl-pet-name-row">
                  <h2 className="pl-pet-name">{currentPet.name}</h2>
                  <Pencil size={16} color="#0b6b3a" />
                </div>
                <p className="pl-pet-meta">
                  {currentPet.breed} • {currentPet.gender} • {currentPet.age}
                </p>
                <div className="pl-health-row">
                  <span className="pl-health-icon">
                    <ShieldCheck size={16} color="#fff" />
                  </span>
                  <div>
                    <p className="pl-health-title">Good Health</p>
                    <p className="pl-health-sub">Keep up the good care!</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="pl-change-pet-btn" onClick={() => setShowPetModal(true)}>
              Change Pet
              <ChevronRight size={16} />
            </button>
          </section>

          <div className="pl-columns">
            <section>
              <h3 className="pl-section-title">Upload Medical Record</h3>
              <div className="pl-dropzone">
                <PawIcon />
                <div className="pl-dropzone-content">
                  <CloudUploadIcon />
                  <p className="pl-dropzone-title">Upload File</p>
                  <p className="pl-dropzone-sub">PDF, JPG, PNG supported</p>
                  <button className="pl-choose-btn" onClick={() => setShowUploadModal(true)}>
                    <Upload size={15} style={{ marginRight: 6 }} />
                    Choose File
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="pl-records-header">
                <h3 className="pl-section-title">Uploaded Records</h3>
                <button className="pl-view-all-btn" onClick={() => setShowAllRecords(true)}>
                  <Eye size={15} />
                  View All
                  {petRecords.length > 0 && <span className="pl-view-all-count">{petRecords.length}</span>}
                </button>
              </div>

              <ul className="pl-records-list">
                {petRecords.length === 0 && (
                  <li className="pl-empty-state">No records yet. Upload your first file!</li>
                )}

                {petRecords.slice(0, 4).map((r, i) => (
                  <li
                    key={r.name + i}
                    className={`pl-record-item ${r.isNew ? "pl-record-item--new" : ""}`}
                    onClick={() => handleFileClick(r)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="pl-record-left">
                      <FileBadge type={r.type} />
                    </div>

                    <div className="pl-record-info">
                      <p className="pl-record-name">{r.name}</p>
                      <p className="pl-record-meta">
                        <Clock size={11} style={{ marginRight: 4, verticalAlign: "middle", flexShrink: 0 }} />
                        <span>
                          {r.date} · {r.time}
                        </span>
                      </p>
                    </div>

                    <div className="pl-record-right">
                      {r.isNew && <span className="pl-new-badge">New</span>}
                      <MoreVertical size={18} color="#9aa39a" />
                    </div>
                  </li>
                ))}
              </ul>

              {petRecords.length > 4 && (
                <button className="pl-show-more-btn" onClick={() => setShowAllRecords(true)}>
                  +{petRecords.length - 4} more records
                </button>
              )}
            </section>
          </div>
        </main>

        {aiSection}

        {showPetModal && (
          <div className="pl-modal-overlay" onClick={() => setShowPetModal(false)}>
            <div className="pl-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pl-modal-header">
                <h2>Switch Pet</h2>
                <button className="pl-close-btn" onClick={() => setShowPetModal(false)} aria-label="Close">
                  <X color="#222" />
                </button>
              </div>

              {Object.entries(PETS).map(([key, pet]) => (
                <div
                  key={key}
                  className={`pl-pet-option ${selectedPet === key ? "active" : ""}`}
                  onClick={() => {
                    setSelectedPet(key);
                    setShowPetModal(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src={pet.image} alt={pet.name} width="50" />
                  <div>
                    <h4>{pet.name}</h4>
                    <span>{pet.breed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showUploadModal && (
          <UploadModal onClose={() => setShowUploadModal(false)} onFiles={handleFiles} />
        )}

        {viewingFile && <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />}
      </div>
    </div>
  );
}