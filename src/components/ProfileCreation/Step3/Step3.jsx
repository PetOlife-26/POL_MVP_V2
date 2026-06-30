import React, { useState } from "react";
import StepProgress from "../StepProgress/StepProgress";
import StepHeaderBar from "../StepHeaderBar/StepHeaderBar";
import { FiCalendar } from "../icons";
import "./Step3.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Step3({ goNext, goBack, petData }) {
  const [knowDOB, setKnowDOB] = useState(!!petData.birthDate);
  const [dob, setDob] = useState(petData.birthDate || "");

  const getApproxYears = () => {
    if (!petData.approxAge) return "";
    const match = petData.approxAge.match(/(\d+)y/);
    return match ? match[1] : "";
  };

  const getApproxMonths = () => {
    if (!petData.approxAge) return "";
    const match = petData.approxAge.match(/(\d+)m/);
    return match ? match[1] : "";
  };

  const [years, setYears] = useState(getApproxYears());
  const [months, setMonths] = useState(getApproxMonths());
  const progress = 75;

  return (
    <div className="pet-age-container">
      <StepHeaderBar onBack={goBack} />
      <StepProgress progress={progress} stepNumber={3} />

      <div className="pet-age-header">
        <h2>Pet Age Details</h2>
        <p className="subtitle">
          Do you know your pet's date of birth? We'll use it to personalize care
          reminders and maintain accurate health records.
        </p>
      </div>

      {/* DOB Card */}
      <div
        className={`age-card age-card--dob ${knowDOB ? "selected" : ""}`}
        onClick={() => setKnowDOB(true)}
      >
        <div className="age-card-top">
          <label className="radio-label">
            <input type="radio" checked={knowDOB} onChange={() => setKnowDOB(true)} />
            <div className="card-copy">
              <span className="card-title">Yes, I know the date of birth</span>
              <span className="card-subtext">
                Enter the exact date and we'll calculate the age automatically.
              </span>
            </div>
          </label>
          <div className="age-card-illustration age-card-illustration--calendar">
            <span className="age-emoji">📅</span>
          </div>
        </div>

        {knowDOB && (
          <div className="card-body">
            <div className="input-group">
              <label>Date of Birth</label>
              <div className="date-input">
  <DatePicker
    selected={dob ? new Date(dob) : null}
    onChange={(date) =>
      setDob(date ? date.toISOString().split("T")[0] : "")
    }
    dateFormat="dd/MM/yyyy"
    placeholderText="Select Date of Birth"
    showYearDropdown
    scrollableYearDropdown
    yearDropdownItemNumber={30}
    maxDate={new Date()}
  />
  <FiCalendar className="calendar-icon"
   />
</div>
            </div>
          </div>
        )}
      </div>

      {/* Approx Age Card */}
      <div
        className={`age-card age-card--approx ${!knowDOB ? "selected" : ""}`}
        onClick={() => setKnowDOB(false)}
      >
        <div className="age-card-top">
          <label className="radio-label">
            <input type="radio" checked={!knowDOB} onChange={() => setKnowDOB(false)} />
            <div className="card-copy">
              <span className="card-title">No, I know the approximate age</span>
              <span className="card-subtext">
                You can enter an estimated age in years and months.
              </span>
            </div>
          </label>
          <div className="age-card-illustration age-card-illustration--clock">
            <span className="age-emoji">🕒</span>
            <span className="age-paw">🐾</span>
          </div>
        </div>

        {!knowDOB && (
          <div className="card-body">
            <div className="age-row">
              <div className="age-field">
                <label>Years</label>
                <input
                  type="number"
                  placeholder="e.g. 3"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>
              <div className="age-field">
                <label>Months</label>
                <input
                  type="number"
                  placeholder="e.g. 6"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        className="next-btn"
        onClick={() =>
          goNext({
            knowDOB,
            birthDate: knowDOB ? dob : "",
            approxAge: !knowDOB ? `${years || 0}y ${months || 0}m` : "",
          })
        }
      >
        Next
      </button>
    </div>
  );
}

export default Step3;
