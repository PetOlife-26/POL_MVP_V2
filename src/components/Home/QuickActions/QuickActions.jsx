import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

import checklistIcon from "./checklist-icon.png";
import medicalRecordsIcon from "./medical-records-icon.png";

export default function QuickActions({ onNavigateTab }) {
  const navigate = useNavigate();

  const handleTimeline = () => {
    if (typeof onNavigateTab === "function") {
      onNavigateTab("timeline");
    } else {
      navigate("/home", { state: { tab: "timeline" } });
    }
  };

  const handleRecords = () => {
    if (typeof onNavigateTab === "function") {
      onNavigateTab("medicalrecords");
    } else {
      navigate("/home", { state: { tab: "medicalrecords" } });
    }
  };

  return (
    <section className="quick-actions-section">
      <div className="section-header">
        <h3 className="section-title">Quick Actions</h3>
        <span className="section-sparkle">✦</span>
      </div>

      <div className="quick-actions-grid">
        <div
          className="action-card action-card--green"
          style={{ cursor: "pointer" }}
          onClick={handleTimeline}
        >
          <div className="action-card-icon">
            <img src={checklistIcon} alt="" />
          </div>
          <div className="action-card-content">
            <h4 className="action-card-title action-card-title--green">
              Health Timeline
            </h4>
            <p className="action-card-desc">
              Track care, tasks & important reminders
            </p>
          </div>
          <button
            type="button"
            className="action-card-btn action-card-btn--green"
            onClick={(e) => {
              e.stopPropagation();
              handleTimeline();
            }}
          >
            →
          </button>
        </div>

        <div
          className="action-card action-card--purple"
          style={{ cursor: "pointer" }}
          onClick={handleRecords}
        >
          <div className="action-card-icon">
            <img src={medicalRecordsIcon} alt="" />
          </div>
          <div className="action-card-content">
            <h4 className="action-card-title action-card-title--purple">
              Medical Records
            </h4>
            <p className="action-card-desc">
              Upload & store pet medical documents
            </p>
          </div>
          <button
            type="button"
            className="action-card-btn action-card-btn--purple"
            onClick={(e) => {
              e.stopPropagation();
              handleRecords();
            }}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}