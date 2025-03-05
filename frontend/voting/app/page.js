// 'use client'

// export default function Home() {
//   return (
//     <div>
//       Ok !
//     </div>
//   );
// }

"use client";
// On va utiliser Viem pour read le WorkflowStatus car avec wagmi :
// useReadContract requires an active connection to an Ethereum provider.
// By default, Wagmi uses the connected wallet to read data, so if you're not connected, it fails.
// import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { contractAddress, contractAbi } from "@/constants";
import RegisteringVoters from "@/components/shared/RegisteringVoters";
import ProposalsRegistrationStarted from "@/components/shared/ProposalsRegistrationStarted";
import { publicClient } from "@/utils/client";
// import ProposalsRegistrationEnded from "../components/ProposalsRegistrationEnded";
// import VotingSessionStarted from "../components/VotingSessionStarted";
// import VotingSessionEnded from "../components/VotingSessionEnded";
// import VotesTallied from "../components/VotesTallied";
import { hardhat } from "wagmi/chains";
import { http, createPublicClient } from "viem";

// // Create a local Hardhat public client
// const publicClient = createPublicClient({
//   chain: hardhat, // Change chain accordingly
//   transport: http("http://127.0.0.1:8545"), // Change RPC accordingly
// });

export default function Home() {
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWorkflowStatus() {
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
    }
    fetchWorkflowStatus();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading workflow status</p>;

  const renderComponent = () => {
    switch (workflowStatus) {
      case 0:
        return <RegisteringVoters />;
      case 1:
        return <ProposalsRegistrationStarted />;
      // case 2:
      //   return <ProposalsRegistrationEnded />;
      // case 3:
      //   return <VotingSessionStarted />;
      // case 4:
      //   return <VotingSessionEnded />;
      // case 5:
      //   return <VotesTallied />;
      default:
        return <p>Unknown status</p>;
    }
  };

  return <div>{renderComponent()}</div>;
}

