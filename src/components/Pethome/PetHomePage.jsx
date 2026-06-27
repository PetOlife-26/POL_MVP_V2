import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PetHome from "./PetHome";

export default function PetHomePage() {
  const location = useLocation();

  const incomingPet = location.state?.newPet || null;

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    if (incomingPet) {
      setPets([incomingPet]);
      setSelectedPet(incomingPet);
    }
  }, [incomingPet]);

  const handleAddPet = () => {
    // your add pet logic
  };

  return (
    <PetHome
      pets={pets}
      selectedPet={selectedPet}
      setSelectedPet={setSelectedPet}
      onAddPet={handleAddPet}
    />
  );
}