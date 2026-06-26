import React from "react";
import noRecordsIcon from "./no-records-icon.png";

export default function NoRecordsCard() {
  return (
    <div className="no-records-card">
      <div className="no-records-icon">
        <img src={noRecordsIcon} alt="No Records" />
      </div>

      <h4 className="no-records-title">No Medical Records Yet</h4>

      <p className="no-records-desc">
        Upload your pet's medical documents to keep everything safe and
        organized.
      </p>

      <button className="upload-btn">
        Upload Records <span className="upload-plus">+</span>
      </button>
    </div>
  );
}