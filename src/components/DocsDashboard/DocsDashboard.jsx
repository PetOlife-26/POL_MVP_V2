import React, { useState } from 'react';
import PetContextCard from '../PetContextCard/PetContextCard';
import './DocsDashboard.css';

// SVG Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ScanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V4h3" />
    <path d="M20 7V4h-3" />
    <path d="M4 17v3h3" />
    <path d="M20 17v3h-3" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Empty State Categories
const MOCK_CATEGORIES = [
  { id: 'vaccinations', label: 'Vaccinations', icon: '💉', count: 0, lastUpdated: '--' },
  { id: 'prescriptions', label: 'Prescriptions', icon: '💊', count: 0, lastUpdated: '--' },
  { id: 'lab_reports', label: 'Lab Reports', icon: '🧪', count: 0, lastUpdated: '--' },
  { id: 'medical_images', label: 'Medical Images', icon: '🩻', count: 0, lastUpdated: '--' },
  { id: 'vet_visits', label: 'Vet Visits', icon: '🏥', count: 0, lastUpdated: '--' },
  { id: 'surgeries', label: 'Surgeries', icon: '✂️', count: 0, lastUpdated: '--' },
];

export default function DocsDashboard({ activePetId, onTabChange }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVetVisitModal, setShowVetVisitModal] = useState(false);

  const handleTimelineClick = (e) => {
    e.preventDefault();
    if (onTabChange) {
      onTabChange("health");
    }
  };

  return (
    <div className="docs-dashboard">
      <PetContextCard />

      {/* Global Search */}
      <div className="docs-search-container">
        <div className="docs-search-icon">
          <SearchIcon />
        </div>
        <input 
          type="text" 
          className="docs-search-input" 
          placeholder="Search records, vaccines, reports..." 
        />
      </div>

      {/* Hero Section */}
      <div className="docs-hero">
        <div className="docs-hero-header">
          <div className="docs-hero-title-area">
            <h2 className="docs-hero-title">
              <span className="docs-hero-icon-wrapper">
                <ShieldIcon />
              </span>
              Medical Vault
            </h2>
            <p className="docs-hero-subtitle">0 Documents Stored</p>
          </div>
        </div>
        <div className="docs-hero-status healthy" style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}>
          Start building your pet's medical history
        </div>
        <div className="docs-hero-footer">
          <a href="#health" className="docs-hero-link" onClick={handleTimelineClick}>
            View Full Timeline <ArrowRightIcon />
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="docs-quick-actions">
        <div className="docs-action-card primary" onClick={() => setShowUploadModal(true)}>
          <div className="docs-action-icon">
            <PlusIcon />
          </div>
          <span className="docs-action-label">Upload<br/>Record</span>
        </div>
        <div className="docs-action-card">
          <div className="docs-action-icon">
            <ScanIcon />
          </div>
          <span className="docs-action-label">Scan<br/>Document</span>
        </div>
        <div className="docs-action-card" onClick={() => setShowVetVisitModal(true)}>
          <div className="docs-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 24, height: 24}}>
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="docs-action-label">Add Vet<br/>Visit</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="docs-section">
        <h3 className="docs-section-title">Categories</h3>
        <div className="docs-categories-grid">
          {MOCK_CATEGORIES.map(cat => (
            <div key={cat.id} className="docs-category-card">
              <div className="docs-category-icon-wrapper">
                {cat.icon}
              </div>
              <div className="docs-category-info">
                <span className="docs-category-name">{cat.label}</span>
                <span className="docs-category-meta">{cat.count} Records</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="docs-section">
        <h3 className="docs-section-title">Recent Records</h3>
        <div className="docs-empty-state">
          <div className="docs-empty-icon">📁</div>
          <p className="docs-empty-title">No records yet</p>
          <p className="docs-empty-desc">Add your first record now to keep your pet's medical history organized.</p>
          <button className="docs-empty-btn" onClick={() => setShowUploadModal(true)}>Upload Record</button>
        </div>
      </div>

      {/* Minimal Upload Popup Modal */}
      {showUploadModal && (
        <div className="docs-modal-overlay center" onClick={() => setShowUploadModal(false)}>
          <div className="docs-modal-popup" onClick={e => e.stopPropagation()}>
            <div className="docs-popup-header">
              <h3 className="docs-popup-title">Upload Record</h3>
              <button className="docs-popup-close" onClick={() => setShowUploadModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="docs-upload-grid">
              <button className="docs-upload-grid-btn" onClick={() => setShowUploadModal(false)}>
                <div className="docs-upload-icon-circle"><CameraIcon /></div>
                <span>Take Photo</span>
              </button>
              <button className="docs-upload-grid-btn" onClick={() => setShowUploadModal(false)}>
                <div className="docs-upload-icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span>Gallery</span>
              </button>
              <button className="docs-upload-grid-btn" onClick={() => setShowUploadModal(false)}>
                <div className="docs-upload-icon-circle"><FileIcon /></div>
                <span>PDF / File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vet Visit Modal */}
      {showVetVisitModal && (
        <div className="docs-modal-overlay center" onClick={() => setShowVetVisitModal(false)}>
          <div className="docs-modal-popup vet-visit-popup" onClick={e => e.stopPropagation()}>
            <div className="docs-popup-header">
              <h3 className="docs-popup-title">Add Vet Visit</h3>
              <button className="docs-popup-close" onClick={() => setShowVetVisitModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <form className="docs-form" onSubmit={e => { e.preventDefault(); setShowVetVisitModal(false); }}>
              <div className="docs-form-group">
                <label>Date of Visit</label>
                <input type="date" required />
              </div>
              <div className="docs-form-group">
                <label>Vet / Clinic Name</label>
                <input type="text" placeholder="e.g. Happy Paws Clinic" required />
              </div>
              <div className="docs-form-group">
                <label>Reason for Visit</label>
                <input type="text" placeholder="e.g. Annual Checkup, Vaccination" required />
              </div>
              
              <div className="docs-form-upload-box">
                <UploadIcon />
                <span>Upload prescriptions or bills</span>
              </div>

              <button type="submit" className="docs-form-submit">Save Visit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
