import "./petcard.css";
import { Calendar, User, Shield, Cpu, Phone, Mail } from "lucide-react";

const PetCard = (props) => {
  const petData = props?.petData || {
    petName: "Bruno",
    breed: "Golden Retriever",
    age: "2 Years",
    gender: "Male",
    petId: "PETOL-000123",
    microchipId: "985141000123456",
    registeredDate: "10 May 2025",
    phone: "+91 9876543210",
    altPhone: "+91 9123456789",
    email: "owner@gmail.com",
    petImage: "https://via.placeholder.com/400x400?text=Pet+Image",
    qrCode: "https://via.placeholder.com/200x200?text=QR",
  };

  return (
    <div className="petcard-wrapper">
      <div className="petcard">
        {/* Header */}
        <div className="petcard-header">
          <div className="logo">
            <span className="logo-green">peto</span>
            <span className="logo-dark">life</span>
          </div>

          <div className="title-section">
            <h1>PET ID CARD</h1>
            <p>A lifetime of love, care & responsibility.</p>
          </div>
        </div>

        {/* Body */}
        <div className="petcard-body">
          {/* Left */}
          <div className="pet-image-section">
            <img
              src={
                petData.petImage ||
                "https://via.placeholder.com/400x400?text=Pet+Image"
              }
              alt={petData.petName || "Pet"}
              className="pet-image"
            />
          </div>

          {/* Center */}
          <div className="pet-details">
            <h2>{petData.petName}</h2>

            <div className="breed-tag">{petData.breed}</div>

            <div className="info-list">
              <div className="info-row">
                <Calendar size={18} />
                <span>Age</span>
                <strong>{petData.age}</strong>
              </div>

              <div className="info-row">
                <User size={18} />
                <span>Gender</span>
                <strong>{petData.gender}</strong>
              </div>

              <div className="info-row">
                <Shield size={18} />
                <span>Pet ID</span>
                <strong>{petData.petId}</strong>
              </div>

              <div className="info-row">
                <Cpu size={18} />
                <span>Microchip</span>
                <strong>{petData.microchipId}</strong>
              </div>

              <div className="info-row">
                <Calendar size={18} />
                <span>Registered</span>
                <strong>{petData.registeredDate}</strong>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="owner-section">
            <div className="owner-card">
              <h3>PET PARENT DETAILS</h3>

              <div className="owner-item">
                <Phone size={18} />
                <span>{petData.phone}</span>
              </div>

              <div className="owner-item">
                <Phone size={18} />
                <span>{petData.altPhone}</span>
              </div>

              <div className="owner-item">
                <Mail size={18} />
                <span>{petData.email}</span>
              </div>
            </div>

            <div className="qr-section">
              <img src={petData.qrCode} alt="QR Code" className="qr-image" />
              <p>Scan to return to my parents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
