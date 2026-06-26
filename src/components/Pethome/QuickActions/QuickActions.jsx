import React from "react";

import checklistIcon from "./checklist-icon.png";
import medicalRecordsIcon from "./medical-records-icon.png";

export default function QuickActions() {
  return (
    <section className="quick-actions-section">
      <div className="section-header">
        <h3 className="section-title">Quick Actions</h3>
        <span className="section-sparkle">✦</span>
      </div>

      <div className="quick-actions-grid">
        <div className="action-card action-card--green">
          <div className="action-card-icon">
            <img src={checklistIcon} alt="" />
          </div>
          <div className="action-card-content">
            <h4 className="action-card-title action-card-title--green">
              Health Checklist
            </h4>
            <p className="action-card-desc">
              Track care, tasks & important reminders
            </p>
          </div>
          <button className="action-card-btn action-card-btn--green">
            →
          </button>
        </div>

        <div className="action-card action-card--purple">
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
          <button className="action-card-btn action-card-btn--purple">
            →
          </button>
        </div>
      </div>
    </section>
  );
}