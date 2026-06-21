import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, MapPin, User, Phone, Mail, PawPrint } from 'lucide-react';
import './petcard.css';

export default function PetCard({ petData: propPetData }) {
  const [fullProfile, setFullProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async (petolifeId) => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE}/api/pet-profile/by-petolife-id/${encodeURIComponent(petolifeId)}`);
        if (res.ok) {
          const data = await res.json();
          setFullProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch full pet profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (propPetData?.petolife_id) {
      fetchFullProfile(propPetData.petolife_id);
    } else {
      try {
        const localUser = localStorage.getItem('user');
        const userId = localUser ? JSON.parse(localUser).id : 'guest';
        const storedPets = JSON.parse(localStorage.getItem(`pets_${userId}`)) || [];
        const activeId = localStorage.getItem(`active_pet_id_${userId}`);
        const active = storedPets.find((p) => p.id === activeId) || storedPets[0];
        
        if (active?.petolife_id) {
          fetchFullProfile(active.petolife_id);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error('PetCard: failed to read pets from storage', e);
        setLoading(false);
      }
    }
  }, [propPetData]);

  if (loading) return <div className="petcard-id-wrapper loading">Loading pet ID...</div>;
  if (!fullProfile) return <div className="petcard-id-wrapper empty">No pet profile available.</div>;

  const qrUrl = fullProfile.petolife_id
    ? `${window.location.origin}/api/pet-profile/by-petolife-id/${encodeURIComponent(fullProfile.petolife_id)}`
    : '';

  return (
    <div className="petcard-landscape-wrapper">
      <div className="petcard-landscape">
        {/* Top Header */}
        <header className="pl-header">
          <div className="pl-logo">pet<span className="pl-logo-icon"><PawPrint size={18}/></span>life</div>
          <div className="pl-title-center">
            <div className="pl-shield-title">
              <span className="pl-shield-icon"><ShieldCheck size={24} /></span>
              <h2>PET ID CARD</h2>
            </div>
            <p>A lifetime of love, care & responsibility.</p>
          </div>
          <div className="pl-qr-container">
            <QRCodeSVG value={qrUrl} size={64} bgColor="transparent" fgColor="#0c6b3a" level="M" />
            <div className="pl-qr-text">Scan to return<br/>to my parents</div>
          </div>
        </header>

        {/* Main Body */}
        <div className="pl-body">
          {/* Left: Photo */}
          <div className="pl-photo-col">
            <div className="pl-photo-container">
              {fullProfile.pet_photo_url ? (
                <img className="pl-photo" src={fullProfile.pet_photo_url} alt={fullProfile.pet_name} />
              ) : (
                <div className="pl-photo-placeholder"><PawPrint size={64} color="#0c6b3a" /></div>
              )}
              <div className="pl-photo-shield"><PawPrint size={16} /></div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="pl-details-col">
            <div className="pl-pet-id-badge">
              <span className="pl-pet-id-label">PETOLIFE ID</span>
              <span className="pl-pet-id-value">{fullProfile.petolife_id || 'Pending'}</span>
            </div>
            
            <div className="pl-name-row">
              <h1 className="pl-pet-name">{fullProfile.pet_name}</h1>
              <PawPrint size={24} color="#0c6b3a" className="pl-name-icon" />
            </div>
            
            {fullProfile.breed && (
              <div className="pl-breed-pill">{fullProfile.breed}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
