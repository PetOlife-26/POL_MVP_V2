import React from "react";
import "./TopNav.css";
import polLogo from "../../../assets/POL_logo.svg";
import { Sparkles } from "lucide-react";

/**
 * Shared TopNav — used by HomeScreen, ChecklistPage, and other in-app pages.
 * Displays the official PetOLife logo asset and a notification icon.
 */
const TopNav = () => {
  return (
    <nav className="topnav">
      <div className="topnav__left">
        <div className="topnav__brand">
          <img src={polLogo} alt="PetOLife" className="topnav__logo-img" />
        </div>
      </div>
      <div className="topnav__right">
        <button className="topnav__icon-btn" aria-label="Sparkles">
          <Sparkles size={20} color="#ffb703" />
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
