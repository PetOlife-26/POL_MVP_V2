import React, { useState } from "react";
import "./HealthBanner.css";

const HealthBanner = () => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="healthbanner">
      {/* Shield icon */}
      <div className="healthbanner__icon" aria-hidden="true">
        <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
          <path
            d="M24 4L8 12v14c0 10 7 18 16 20 9-2 16-10 16-20V12L24 4z"
            fill="#138a36"
          />
          {/* Paw cutout in white */}
          <ellipse cx="24" cy="31" rx="5" ry="4" fill="#fff"/>
          <circle cx="18.5" cy="24.5" r="2" fill="#fff"/>
          <circle cx="29.5" cy="24.5" r="2" fill="#fff"/>
          <circle cx="20.5" cy="20" r="1.6" fill="#fff"/>
          <circle cx="27.5" cy="20" r="1.6" fill="#fff"/>
        </svg>
      </div>

      {/* Text block */}
      <div className="healthbanner__text">
        <p className="healthbanner__title">Your pet&apos;s health is our priority</p>
        <p className="healthbanner__subtitle">Care today for a happier tomorrow</p>
      </div>

      {/* Heart toggle */}
      <button
        className={`healthbanner__heart ${liked ? "healthbanner__heart--liked" : ""}`}
        aria-label={liked ? "Unlike" : "Like"}
        onClick={() => setLiked((v) => !v)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? "#e74c3c" : "none"} stroke={liked ? "#e74c3c" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
};

export default HealthBanner;
