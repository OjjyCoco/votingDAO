// react
"use client";
import { createContext, useContext, useState, useEffect } from "react";

// viem
// On va utiliser Viem pour read le WorkflowStatus car avec wagmi :
// useReadContract requires an active connection to an Ethereum provider.
// By default, Wagmi uses the connected wallet to read data, so if you're not connected, it fails.
// import { useReadContract } from "wagmi";
import { publicClient } from "@/utils/client";

// contract
import { contractAddress, contractAbi } from "@/constants";

// Création du contexte
const WorkflowContext = createContext();

// Provider du contexte
export const WorkflowProvider = ({ children }) => {
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer le workflowStatus depuis le smart contract
  const fetchWorkflowStatus = async () => {
    try {
      const status = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "workflowStatus",
      });
      setWorkflowStatus(status);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Appel initial au chargement (montage du comp)
  useEffect(() => {
    fetchWorkflowStatus();
  }, []);

  return (
    <WorkflowContext.Provider value={{ workflowStatus, fetchWorkflowStatus, loading, error }}>
      {children}
    </WorkflowContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte
export const useWorkflow = () => {
  return useContext(WorkflowContext);
};
