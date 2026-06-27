import React from "react";
import healthShield from "./health-shield.png";

export default function HealthBanner() {
  return (
    <div className="health-banner">
      <div className="health-banner-text">
        <p className="health-title">Your pet's health will be Good!</p>
        <p className="health-subtitle">Keep up the good care.</p>
      </div>

      <div className="health-banner-icon">
        <img src={healthShield} alt="health shield" />
      </div>
    </div>
  );
}