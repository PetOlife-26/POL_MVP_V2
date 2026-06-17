import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CareTeam.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const CareTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve state or fallback to localStorage
  const stateData = location.state || {};
  const petProfileId = stateData.petProfileId || localStorage.getItem("petProfileId");
  const petolifeId = stateData.petolifeId || localStorage.getItem("petolifeId");
  const petName = stateData.petName || localStorage.getItem("petName");

  // Save details to localStorage on mount so refresh doesn't wipe them
  useEffect(() => {
    if (stateData.petProfileId) localStorage.setItem("petProfileId", stateData.petProfileId);
    if (stateData.petolifeId) localStorage.setItem("petolifeId", stateData.petolifeId);
    if (stateData.petName) localStorage.setItem("petName", stateData.petName);
  }, [stateData]);

  // Form states
  const [clinicName, setClinicName] = useState("");
  const [vetName, setVetName] = useState("");
  const [vetContact, setVetContact] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch existing Care Team details if petProfileId exists
  useEffect(() => {
    if (!petProfileId) return;

    const fetchCareTeam = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/care-team/${petProfileId}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setClinicName(data.clinic_name || "");
            setVetName(data.vet_name || "");
            setVetContact(data.vet_contact || "");
            setEmergencyContactName(data.emergency_contact_name || "");
            setEmergencyRelationship(data.emergency_relationship || "");
            setEmergencyContactNumber(data.emergency_contact_number || "");
          }
        }
      } catch (err) {
        console.error("Error fetching care team:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareTeam();
  }, [petProfileId]);

  const handleSave = async () => {
    if (!petProfileId) {
      setErrorMsg("No active pet profile found. Please go back and create a profile first.");
      return;
    }

    if (!emergencyContactName.trim() || !emergencyContactNumber.trim()) {
      setErrorMsg("Emergency Contact Name and Contact Number are required.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_BASE}/api/care-team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pet_profile_id: petProfileId,
          clinic_name: clinicName.trim() || null,
          vet_name: vetName.trim() || null,
          vet_contact: vetContact.trim() || null,
          emergency_contact_name: emergencyContactName.trim(),
          emergency_relationship: emergencyRelationship.trim() || null,
          emergency_contact_number: emergencyContactNumber.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save care team details.");
      }

      setSuccessMsg("Care team details saved successfully!");
    } catch (err) {
      console.error("Save care team error:", err);
      setErrorMsg(err.message || "Failed to save details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (petolifeId) {
      navigate("/qr-success", {
        state: { petolifeId, petProfileId, petName }
      });
    } else {
      navigate("/pet-profile");
    }
  };

  return (
    <section className="care-team-page">
      <div className="care-team-container">
        <div className="care-team-header">
          <h2>Care Team & Contacts</h2>
          <p>Add veterinary and emergency contact information</p>
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6f7b71" }}>
            Loading care team details...
          </div>
        ) : (
          <>
            {/* SECTION 1 */}
            <div className="care-section">
              <div className="section-title-row">
                <h3>Primary Veterinarian</h3>
                <span className="optional-tag">Optional</span>
              </div>

              <div className="form-group">
                <label>Clinic Name</label>
                <input
                  type="text"
                  placeholder="Enter clinic name"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Clinic Veterinarian</label>
                <input
                  type="text"
                  placeholder="Enter veterinarian name"
                  value={vetName}
                  onChange={(e) => setVetName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  value={vetContact}
                  onChange={(e) => setVetContact(e.target.value)}
                />
              </div>
            </div>

            {/* SECTION 2 */}
            <div className="care-section">
              <div className="section-title-row">
                <h3>Emergency Contact</h3>
                <span className="required-tag">Required</span>
              </div>

              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  placeholder="Enter contact name"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Relationship</label>
                <input
                  type="text"
                  placeholder="Ex. Friend, Family"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={emergencyContactNumber}
                  onChange={(e) => setEmergencyContactNumber(e.target.value)}
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="care-actions">
              <button
                className="save-continue-btn"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="btn-spinner"></span>
                    Saving Details...
                  </>
                ) : (
                  "Save Details"
                )}
              </button>

              <button className="cancel-link" onClick={handleBack}>
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CareTeam;
