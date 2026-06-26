import React from "react";
import { TOTAL_STEPS } from "../constants";
import "./StepProgress.css";

function StepProgress({ progress, stepNumber }) {
  return (
    <div className="pet-progress-container">
      <div className="progress-labels">
        <span>Photo</span>
        <span>Pet Health ID</span>
      </div>

      <div className="pet-progress-track">
        <div
          className="pet-progress-fill"
          style={{ width: `${progress}%` }}
        />
        <div
          className="running-pet"
          style={{
            left: progress === 0 ? "10px" : `calc(${progress}% - 14px)`,
          }}
        >
          🐕
        </div>
      </div>

      <div className="step-text">
        Step {stepNumber} of {TOTAL_STEPS}
      </div>
    </div>
  );
}

export default StepProgress;
