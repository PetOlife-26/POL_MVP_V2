import React from "react";
import "./TopNav.css";
import petolifeLogo from "./petolife-logo.png";

/**
 * Shared TopNav — used by HomeScreen, ChecklistPage, and other in-app pages.
 * Props:
 *   onNotification — callback when bell icon is clicked
 */
const TopNav = ({ onNotification }) => {
  return (
    <nav className="topnav">
      <div className="topnav__left">
        <div className="topnav__brand">
          <img src={petolifeLogo} alt="PetOlife" className="topnav__logo-img" />
        </div>
        <p className="topnav__tagline">Better Health, Happier Pets 💚</p>
      </div>

      <button className="topnav__bell" aria-label="Notifications" onClick={onNotification}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="topnav__dot" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default TopNav;
