import React from "react";
import "./HeroSection.css";
import heroimg from "./hero-pets copy 2.png";

/**
 * USAGE:
 * Pass your dog+cat image via the heroSrc prop.
 * Example: <HeroSection heroSrc={require("../../assets/hero-pets.png")} />
 */
const HeroSection = () => {
  return (
    <section className="hero">
      {/* Scattered decorative elements */}
      <span className="hero__deco hero__deco--heart1" aria-hidden="true">🤍</span>
      <span className="hero__deco hero__deco--heart2" aria-hidden="true">🤍</span>
      <span className="hero__deco hero__deco--paw1" aria-hidden="true">🐾</span>
      <span className="hero__deco hero__deco--paw2" aria-hidden="true">🐾</span>

      {/* Green oval backdrop behind pets */}
      <div className="hero__oval" aria-hidden="true" />

      <img src={heroimg} alt="Happy dog and cat" className="hero__pets-img" />

      <h1 className="hero__title">
        Welcome to <span className="hero__brand">PetOlife</span>
      </h1>
      <p className="hero__subtitle">
        Your pet&apos;s health journey<br />starts here! 💚
      </p>
    </section>
  );
};

export default HeroSection;
