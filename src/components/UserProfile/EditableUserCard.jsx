import React, { useState, useEffect } from "react";
import { FiUser, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import fetchWithAuth from "../../utils/fetchWithAuth";
import "./EditableUserCard.css";

const EditableUserCard = ({ user }) => {
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    avatar_url: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetchWithAuth(`/api/user-profile/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          email: data.email || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Optimistic UI
    const objectUrl = URL.createObjectURL(file);
    setProfile(prev => ({ ...prev, avatar_url: objectUrl }));
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetchWithAuth(`/api/user-profile/${user.id}/avatar`, {
        method: "POST",
        body: formData,
        headers: {} 
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({ ...prev, avatar_url: data.avatar_url }));
      } else {
        alert("Failed to upload avatar.");
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updatePayload = {
        full_name: profile.full_name,
        phone: profile.phone,
        email: profile.email,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode
      };
      
      const res = await fetchWithAuth(`/api/user-profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatePayload)
      });
      
      if (res.ok) {
        setIsEditing(false);
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    fetchProfile(); // Reset to original data
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return <div className="editable-card loading-skeleton">Loading...</div>;
  }

  return (
    <div className="editable-card user-card">
      <div className="card-header">
        <h3>User Profile</h3>
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
          <div className="avatar-wrapper">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="avatar-image" />
            ) : (
              <FiUser className="avatar-placeholder" />
            )}
          </div>
          {isEditing && (
            <>
              <label htmlFor="user-avatar-upload" className="avatar-upload-label">
                Change Photo
              </label>
              <input 
                id="user-avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden-input" 
                onChange={handleAvatarChange}
              />
            </>
          )}
        </div>

        <div className="details-section">
          <div className="detail-row">
            <span className="label">Name</span>
            {isEditing ? (
              <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} />
            ) : (
              <span className="value">{profile.full_name || "Not provided"}</span>
            )}
          </div>
          <div className="detail-row">
            <span className="label">Phone</span>
            {isEditing ? (
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
            ) : (
              <span className="value">{profile.phone || "Not provided"}</span>
            )}
          </div>
          <div className="detail-row">
            <span className="label">Email</span>
            {isEditing ? (
              <input type="email" name="email" value={profile.email} onChange={handleChange} />
            ) : (
              <span className="value">{profile.email || "Not provided"}</span>
            )}
          </div>
          <div className="detail-row">
            <span className="label">City</span>
            {isEditing ? (
              <input type="text" name="city" value={profile.city} onChange={handleChange} />
            ) : (
              <span className="value">{profile.city || "Not provided"}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableUserCard;
