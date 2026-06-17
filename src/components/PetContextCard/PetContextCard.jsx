import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateQR } from "../../services/QRService";
import "./PetContextCard.css";

/* ICONS */
function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function DefaultPetAvatar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c-1.5 0-2.8-.5-3.8-1.3-.5-.4-.8-1-1-1.6-.6-1.7.2-3.5 1.4-4.7.8-.8 1.5-1.7 2-2.7.2-.5.8-.7 1.4-.7s1.1.2 1.4.7c.5 1 1.2 1.9 2 2.7 1.2 1.2 2 3 1.4 4.7-.2.6-.5 1.2-1 1.6-1 .8-2.3 1.3-3.8 1.3zM4.5 12C3.1 12 2 10.9 2 9.5S3.1 7 4.5 7 7 8.1 7 9.5 5.9 12 4.5 12zM9 7.5C7.6 7.5 6.5 6.4 6.5 5S7.6 2.5 9 2.5s2.5 1.1 2.5 2.5S10.4 7.5 9 7.5zM15 7.5c-1.4 0-2.5-1.1-2.5-2.5S13.6 2.5 15 2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zM19.5 12c-1.4 0-2.5-1.1-2.5-2.5S18.1 7 19.5 7 22 8.1 22 9.5 20.9 12 19.5 12z" />
    </svg>
  );
}

/* UTILITIES */
function calculateAge(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff); 
  const y = Math.abs(ageDate.getUTCFullYear() - 1970);
  const m = ageDate.getUTCMonth();
  if (y === 0 && m === 0) return "0m";
  if (y === 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
}

export default function PetContextCard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [activePetId, setActivePetId] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const canvasRef = useRef(null);

  // Swipe logic
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    try {
      const localUser = localStorage.getItem("user");
      const userId = localUser ? JSON.parse(localUser).id : "guest";
      const storedPets = JSON.parse(localStorage.getItem(`pets_${userId}`)) || [];
      setPets(storedPets);

      if (storedPets.length > 0) {
        const savedActiveId = localStorage.getItem(`active_pet_id_${userId}`);
        if (savedActiveId && storedPets.find((p) => p.id === savedActiveId)) {
          setActivePetId(savedActiveId);
        } else {
          setActivePetId(storedPets[0].id);
          localStorage.setItem(`active_pet_id_${userId}`, storedPets[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load pets from storage", e);
    }
  }, []);

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  useEffect(() => {
    if (isExpanded && canvasRef.current && activePet) {
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
      const qrUrl = `${frontendUrl}/pet/${activePet.petolife_id}`;
      generateQR(canvasRef.current, qrUrl).catch(console.error);
    }
  }, [isExpanded, activePet]);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const distance = endY - startY;

    if (!isExpanded && distance > 50) {
      // Pull down to expand
      setIsExpanded(true);
    } else if (isExpanded && distance < -50) {
      // Pull up to collapse
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const switchPet = (petId) => {
    const localUser = localStorage.getItem("user");
    const userId = localUser ? JSON.parse(localUser).id : "guest";
    setActivePetId(petId);
    localStorage.setItem(`active_pet_id_${userId}`, petId);
    setIsExpanded(false);
  };

  const handleShare = async () => {
    if (!activePet) return;
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const qrUrl = `${frontendUrl}/pet/${activePet.petolife_id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activePet.pet_name}'s Profile`,
          text: `Check out ${activePet.pet_name}'s digital profile on PetOLife!`,
          url: qrUrl,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      alert("Native sharing is not supported on this device.");
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !activePet) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${activePet.pet_name}_PetOLife_QR.png`;
    link.click();
  };

  if (!activePet) return null;

  const ageStr = calculateAge(activePet.birth_date);
  // Example metadata: "Dog • Shih Tzu"
  const typeStr = activePet.pet_type || "Pet";
  const breedStr = activePet.breed ? ` • ${activePet.breed}` : "";
  const genderStr = activePet.gender ? `${activePet.gender}` : "";
  const fullMetaStr = [genderStr, ageStr].filter(Boolean).join(" • ");

  return (
    <>
      {/* Overlay to dim background when expanded */}
      <div 
        className={`pcc-overlay ${isExpanded ? "active" : ""}`} 
        onClick={() => setIsExpanded(false)}
      />

      <div 
        className={`pet-context-card ${isExpanded ? "expanded" : "collapsed"}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* DRAG HANDLE */}
        <div className="drag-handle-area" onClick={toggleExpand}>
          <div className="drag-pill"></div>
        </div>

        {/* HEADER AREA */}
        <div className="pcc-header" onClick={toggleExpand}>
          <div className="pcc-branding">
            <span className="pcc-brand-name">petolife</span>
            <span className="pcc-brand-slogan">CARE • TRUST • FAMILY</span>
          </div>

          <div className="pcc-avatar-container">
            {activePet.pet_photo_url ? (
              <img src={activePet.pet_photo_url} alt={activePet.pet_name} className="pcc-avatar" />
            ) : (
              <div className="pcc-avatar placeholder">
                <DefaultPetAvatar />
              </div>
            )}
          </div>

          <div className="pcc-name-row">
            <h2 className="pcc-pet-name">{activePet.pet_name}</h2>
            {!isExpanded && (
              <div className="pcc-expand-icon">
                <ChevronDownIcon />
              </div>
            )}
          </div>

          <div className="pcc-pet-meta">
            <span>{typeStr}{breedStr}</span>
            {fullMetaStr && <span className="meta-dot">•</span>}
            {fullMetaStr && <span>{fullMetaStr}</span>}
          </div>
        </div>

        {/* EXPANDED CONTENT (DRAWER) */}
        <div className="pcc-drawer-content">
          
          {/* DIGITAL ID CARD */}
          <div className="pcc-digital-id">
            <div className="pcc-id-header">
              <span className="pcc-id-label">Pet ID</span>
              <span className="pcc-id-value">{activePet.petolife_id || "PENDING"}</span>
            </div>
            
            <div className="pcc-qr-box">
              <canvas ref={canvasRef} className="pcc-qr-canvas" />
            </div>

            <div className="pcc-actions">
              <button className="pcc-action-btn" onClick={handleShare}>
                <ShareIcon />
                <span>Share</span>
              </button>
              <button className="pcc-action-btn" onClick={handleDownload}>
                <DownloadIcon />
                <span>Download</span>
              </button>
              <button className="pcc-action-btn" onClick={() => navigate("/create-pet-profile")}>
                <EditIcon />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="pcc-section">
            <h3 className="pcc-section-title">Pet Details</h3>
            <div className="pcc-details-grid">
              <div className="pcc-detail-card">
                <span className="pcc-detail-label">Pet ID</span>
                <span className="pcc-detail-val">{activePet.petolife_id || "N/A"}</span>
              </div>
              <div className="pcc-detail-card">
                <span className="pcc-detail-label">DOB</span>
                <span className="pcc-detail-val">{activePet.birth_date || "N/A"}</span>
              </div>
              <div className="pcc-detail-card">
                <span className="pcc-detail-label">Weight</span>
                <span className="pcc-detail-val">{activePet.weight ? `${activePet.weight} kg` : "N/A"}</span>
              </div>
              <div className="pcc-detail-card">
                <span className="pcc-detail-label">Blood Group</span>
                <span className="pcc-detail-val">{activePet.blood_group || "N/A"}</span>
              </div>
              <div className="pcc-detail-card">
                <span className="pcc-detail-label">Gender</span>
                <span className="pcc-detail-val">{activePet.gender || "N/A"}</span>
              </div>
              <div className="pcc-detail-card">
                <span className="pcc-detail-label">Breed</span>
                <span className="pcc-detail-val">{activePet.breed || "N/A"}</span>
              </div>
              <div className="pcc-detail-card">
                <span className="pcc-detail-label">Color</span>
                <span className="pcc-detail-val">{activePet.color || "N/A"}</span>
              </div>
              <div className="pcc-detail-card">
                <span className="pcc-detail-label">Microchip</span>
                {/* Find first valid ID if any, else N/A. The IDs are fetched dynamically in backend but currently not saved in local storage. Let's just put N/A for MVP or if we saved it we show it. */}
                <span className="pcc-detail-val">N/A</span>
              </div>
            </div>
          </div>

          {/* PET SWITCHER */}
          <div className="pcc-section">
            <h3 className="pcc-section-title">Your Pets</h3>
            <div className="pcc-switcher-list">
              {pets.map((p) => (
                <div 
                  key={p.id} 
                  className={`pcc-switcher-item ${p.id === activePet.id ? "active" : ""}`}
                  onClick={() => switchPet(p.id)}
                >
                  <div className="pcc-switcher-avatar">
                    {p.pet_photo_url ? (
                      <img src={p.pet_photo_url} alt={p.pet_name} />
                    ) : (
                      <DefaultPetAvatar />
                    )}
                  </div>
                  <div className="pcc-switcher-info">
                    <span className="pcc-switcher-name">{p.pet_name} {p.id === activePet.id && "✓"}</span>
                    <span className="pcc-switcher-meta">{p.pet_type} {p.breed ? `• ${p.breed}` : ""}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="pcc-add-pet-btn" onClick={() => navigate("/create-pet-profile")}>
              <PlusIcon />
              <span>Add New Pet</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
