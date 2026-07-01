import React, { useState, useEffect } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import fetchWithAuth from "../../utils/fetchWithAuth";
import "./EditablePetCard.css";

import calendarIcon from "../Home/ProfileCard/calendar-icon.png";
import maleIcon from "../Home/ProfileCard/male-icon.png";
import femaleIcon from "../Home/ProfileCard/female-icon.png";
import pawIcon from "../Home/ProfileCard/paw-icon.png";

const EditablePetCard = ({ pet, onUpdate }) => {
  const [profile, setProfile] = useState({
    pet_name: "",
    breed: "",
    gender: "",
    birth_date: "",
    weight: "",
    color: "",
    blood_group: "",
    pet_photo_url: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pet) {
      setProfile({
        pet_name: pet.pet_name || pet.name || "",
        breed: pet.breed || "",
        gender: pet.gender || "",
        birth_date: pet.birth_date || "",
        weight: pet.weight || "",
        color: pet.color || "",
        blood_group: pet.blood_group || "",
        pet_photo_url: pet.pet_photo_url || pet.image || ""
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !pet?.id) return;
    
    // Optimistic UI
    const objectUrl = URL.createObjectURL(file);
    setProfile(prev => ({ ...prev, pet_photo_url: objectUrl }));
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetchWithAuth(`/api/pet-profile/${pet.id}/photo`, {
        method: "POST",
        body: formData,
        headers: {} 
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({ ...prev, pet_photo_url: data.pet_photo_url }));
        if (onUpdate) onUpdate();
      } else {
        alert("Failed to upload pet photo.");
      }
    } catch (err) {
      console.error("Error uploading pet photo:", err);
    }
  };

  const handleSave = async () => {
    if (!pet?.id) return;
    setSaving(true);
    setError(null);
    try {
      const updatePayload = {
        pet_name: profile.pet_name,
        breed: profile.breed,
        gender: profile.gender,
        birth_date: profile.birth_date,
        weight: profile.weight ? parseFloat(profile.weight) : null,
        color: profile.color,
        blood_group: profile.blood_group
      };
      
      const res = await fetchWithAuth(`/api/pet-profile/${pet.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatePayload)
      });
      
      if (res.ok) {
        setIsEditing(false);
        if (onUpdate) onUpdate(); // Refresh parent data
      } else {
        setError("Failed to update pet profile.");
      }
    } catch (err) {
      console.error("Error updating pet profile:", err);
      setError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (pet) {
      setProfile({
        pet_name: pet.pet_name || pet.name || "",
        breed: pet.breed || "",
        gender: pet.gender || "",
        birth_date: pet.birth_date || "",
        weight: pet.weight || "",
        color: pet.color || "",
        blood_group: pet.blood_group || "",
        pet_photo_url: pet.pet_photo_url || pet.image || ""
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (!pet) return null;

  const genderIcon = profile.gender?.toLowerCase() === "female" ? femaleIcon : maleIcon;

  return (
    <div className="editable-card pet-card">
      <div className="card-header">
        <h3>Pet Profile</h3>
        {!isEditing ? (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <FiEdit2 size={16} /> Edit
          </button>
        ) : (
          <div className="edit-actions">
            <button className="cancel-btn" onClick={cancelEdit} disabled={saving}>
              <FiX size={18} />
            </button>
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : <><FiCheck size={18} /> Save</>}
            </button>
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="card-content">
        <div className="avatar-section">
          <div className="avatar-wrapper pet-avatar">
            <img src={profile.pet_photo_url || pawIcon} alt="Pet" className="avatar-image" />
          </div>
            {isEditing && (
              <>
                <label htmlFor="pet-avatar-upload" className="pet-edit-icon">
                  <FiEdit2 size={14} />
                </label>

                <input
                  id="pet-avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden-input"
                  onChange={handlePhotoChange}
                />
              </>
            )}
        </div>

        <div className="details-section">
          <div className="detail-row">
            <span className="label">Name</span>
            {isEditing ? (
              <input type="text" name="pet_name" value={profile.pet_name} onChange={handleChange} />
            ) : (
              <span className="value">{profile.pet_name || "Not provided"}</span>
            )}
          </div>
          
          <div className="detail-row">
            <span className="label">Breed</span>
            {isEditing ? (
              <input type="text" name="breed" value={profile.breed} onChange={handleChange} />
            ) : (
              <span className="value">{profile.breed || "Not provided"}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="label">Gender</span>
            {isEditing ? (
              <select name="gender" value={profile.gender} onChange={handleChange} className="edit-select">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <span className="value icon-value">
                <img src={genderIcon} alt="gender" className="inline-icon" /> 
                {profile.gender || "Not provided"}
              </span>
            )}
          </div>

          <div className="detail-row">
            <span className="label">Date of Birth</span>
            {isEditing ? (
              <input type="date" name="birth_date" value={profile.birth_date} onChange={handleChange} />
            ) : (
              <span className="value icon-value">
                <img src={calendarIcon} alt="calendar" className="inline-icon" /> 
                {profile.birth_date || "Not provided"}
              </span>
            )}
          </div>

          <div className="detail-row">
            <span className="label">Weight (kg)</span>
            {isEditing ? (
              <input type="number" step="0.1" name="weight" value={profile.weight} onChange={handleChange} />
            ) : (
              <span className="value">{profile.weight ? `${profile.weight} kg` : "Not provided"}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="label">Color</span>
            {isEditing ? (
              <input type="text" name="color" value={profile.color} onChange={handleChange} />
            ) : (
              <span className="value">{profile.color || "Not provided"}</span>
            )}
          </div>

          <div className="detail-row">
            <span className="label">Blood Group</span>
            {isEditing ? (
              <input type="text" name="blood_group" value={profile.blood_group} onChange={handleChange} />
            ) : (
              <span className="value">{profile.blood_group || "Not provided"}</span>
            )}
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default EditablePetCard;
