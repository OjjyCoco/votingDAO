// react
"use client";
import { createContext, useContext, useState, useEffect } from "react";

// viem
import { publicClient } from "@/utils/client";

// contract
import { contractAddress, contractAbi } from "@/constants";

// Création du contexte
const OwnerContext = createContext();

// Provider du contexte
export const OwnerProvider = ({ children }) => {
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer l'Owner depuis le smart contract
  const fetchOwnerAddress = async () => {
    try {
      const addr = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "owner",
      });
      setOwnerAddress(addr);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Appel initial au chargement (montage du comp)
  useEffect(() => {
    fetchOwnerAddress();
  }, []);

  return (
    <OwnerContext.Provider value={{ ownerAddress, fetchOwnerAddress, loading, error }}>
      {children}
    </OwnerContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte
export const useOwner = () => {
  return useContext(OwnerContext);
};
