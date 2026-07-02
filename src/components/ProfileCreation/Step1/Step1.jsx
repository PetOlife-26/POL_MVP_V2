import React, { useState, useEffect } from "react";
import StepProgress from "../StepProgress/StepProgress";
import StepHeaderBar from "../StepHeaderBar/StepHeaderBar";
import { FiCamera, FiSkipForward, FiArrowRight } from "../icons";
import { PAW_IMG } from "../constants";
import { PetAvatar } from "../../common/PetAvatar";
import "./Step1.css";


function Step1({ goNext, onNavigateBack, petData }) {

  const [image, setImage] = useState(null);

  useEffect(() => {

    if (petData?.petPhotoPreview) {

      setImage(petData.petPhotoPreview);
      setPhotoFile(petData.petPhotoFile);
      setPhotoUploaded(true);
    }

  }, [petData]);

  const [photoFile, setPhotoFile] = useState(
    petData?.petPhotoFile || null
  );

  const [photoUploaded, setPhotoUploaded] = useState(
    !!petData?.petPhotoPreview
  );
  const progress = photoUploaded ? 25 : 0;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const preview = URL.createObjectURL(file);

      setImage(preview);
      setPhotoFile(file);
      setPhotoUploaded(true);
    }
};


  return (
    <div className="petphoto-container step-animate-in">
      <StepHeaderBar  onBack={onNavigateBack} />
      <StepProgress progress={progress} stepNumber={1} />

      <div className="hero-section">
        <img src={PAW_IMG} alt="" className="paw-img paw-left" />
        <img src={PAW_IMG} alt="" className="paw-img paw-right" />

<div className="pet-photo-ring">
  <PetAvatar src={image} petType={petData?.petType} alt="pet" size={48} />

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

      <button
        type="button"
        className="skip-btn"
        onClick={() =>
          goNext({
            petPhotoFile: null,
            petPhotoPreview: null,
          })
        }
      >
        <FiSkipForward />
        Skip for Now
      </button>

      <button
        className="next-btn next-btn--animated"
        onClick={() =>
          goNext({
            petPhotoFile: photoFile,
            petPhotoPreview: image,
          })
        }
      >
        Next
        <FiArrowRight />
      </button>
    </div>
  );
}

export default Step1;
