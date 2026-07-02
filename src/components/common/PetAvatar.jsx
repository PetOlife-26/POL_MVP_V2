import React from "react";
import { PawPrint, Dog, Cat, Bird, Rabbit } from "lucide-react";

export function PetAvatar({ src, petType, className, size = 48, iconColor = "#9ca3af", alt = "pet" }) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }

  const getIcon = () => {
    switch (petType?.toLowerCase()) {
      case "dog":
        return <Dog size={size} color={iconColor} strokeWidth={1.5} />;
      case "cat":
        return <Cat size={size} color={iconColor} strokeWidth={1.5} />;
      case "bird":
        return <Bird size={size} color={iconColor} strokeWidth={1.5} />;
      case "rabbit":
        return <Rabbit size={size} color={iconColor} strokeWidth={1.5} />;
      default:
        return <PawPrint size={size} color={iconColor} strokeWidth={1.5} />;
    }
  };

  return (
    <div
      className={`default-pet-avatar ${className || ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
      }}
    >
      {getIcon()}
    </div>
  );
}
