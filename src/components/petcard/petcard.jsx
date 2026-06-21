import React, { useEffect, useState } from 'react';
import './petcard.css';

// Simple component that fetches pet data from an endpoint and renders a card
export default function PetCard() {
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual backend endpoint
    fetch('/api/petcard')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setPetData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch pet data:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="petcard">Loading pet information…</div>;
  if (error) return <div className="petcard error">Error loading pet data.</div>;

  const {
    photo,
    petName,
    breed,
    age,
    gender,
    weight,
    color,
    petId,
    microchip,
    registered,
    owner,
    location,
  } = petData;

  return (
    <div className="petcard">
      <img className="pet-photo" src={photo} alt={`${petName}`} loading="lazy" />
      <h2 className="pet-name">{petName}</h2>
      <ul className="pet-details">
        <li><strong>Breed:</strong> {breed}</li>
        <li><strong>Age:</strong> {age}</li>
        <li><strong>Gender:</strong> {gender}</li>
        <li><strong>Weight:</strong> {weight}</li>
        <li><strong>Color:</strong> {color}</li>
        <li><strong>Pet ID:</strong> {petId}</li>
        <li><strong>Microchip:</strong> {microchip}</li>
        <li><strong>Registered:</strong> {registered}</li>
        <li><strong>Owner Phone:</strong> {owner?.phone}</li>
        <li><strong>Owner Email:</strong> {owner?.email}</li>
        <li><strong>Location:</strong> {location}</li>
      </ul>
    </div>
  );
}
