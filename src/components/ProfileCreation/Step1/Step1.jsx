import React, { useState } from "react";
import StepProgress from "../StepProgress/StepProgress";
import StepHeaderBar from "../StepHeaderBar/StepHeaderBar";
import { FiCamera, FiSkipForward, FiArrowRight } from "../icons";
import { PAW_IMG } from "../constants";
import "./Step1.css";

function Step1({ goNext, onNavigateBack }) {
  const [image, setImage] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const progress = photoUploaded ? 25 : 0;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setPhotoFile(file);
      setPhotoUploaded(true);
    }
  };

  return (
    <div className="petphoto-container step-animate-in">
      <StepHeaderBar onBack={onNavigateBack} />
      <StepProgress progress={progress} stepNumber={1} />

      <div className="hero-section">
        <img src={PAW_IMG} alt="" className="paw-img paw-left" />
        <img src={PAW_IMG} alt="" className="paw-img paw-right" />

        <div className="pet-photo-ring">
          <div className="pet-avatar">
            {image ? <img src={image} alt="pet" /> : <span>🐶</span>}
          </div>
          <label className="pet-camera-badge">
            <FiCamera />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <h1>Add Your Pet's Photo</h1>
        <p className="subtitle">
          Help veterinarians and caregivers identify your furry friend quickly.
        </p>
      </div>

      <label className="upload-card">
        {image ? (
          <img src={image} alt="preview" />
        ) : (
          <>
            <div className="upload-icon">
              <FiCamera />
            </div>
            <h3>Upload Pet Photo</h3>
            <p>JPG, PNG up to 10MB</p>
          </>
        )}
        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
      </label>

      <button
        type="button"
        className="skip-btn"
        onClick={() => goNext({ petPhotoFile: null })}
      >
        <FiSkipForward />
        Skip for Now
      </button>

      <button
        className="next-btn next-btn--animated"
        onClick={() => goNext({ petPhotoFile: photoFile })}
      >
        Next
        <FiArrowRight />
      </button>
    </div>
  );
}

export default Step1;
