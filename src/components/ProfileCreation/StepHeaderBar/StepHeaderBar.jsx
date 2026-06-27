import React from "react";
import { FiArrowLeft } from "../icons";
import "./StepHeaderBar.css";

function StepHeaderBar({ onBack }) {
  return (
    <div className="step-header-bar">
      <button type="button" className="step-back-btn" onClick={onBack}>
        <FiArrowLeft />
        <span>Back</span>
      </button>
    </div>
  );
}

export default StepHeaderBar;
