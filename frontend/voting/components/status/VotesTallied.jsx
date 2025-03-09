'use client'

// shadcn
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// react
import { useState, useEffect } from "react";

// wagmi
import { useReadContract, useAccount } from "wagmi";

// contract
import { contractAddress, contractAbi } from "@/constants";

// viem
import { publicClient } from "@/utils/client";


const VotesTallied = () => {

  const { status, address : userAddress } = useAccount();

  const [proposalIdToGet, setProposalIdToGet] = useState(null)
  const [winningId, setWinningId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { data: getOneProposal, error: getProposalError, isPending: getProposalPending, refetch : proposalRefetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getOneProposal',
    args : proposalIdToGet ? [proposalIdToGet] : undefined,
  })

  const getProposal = () => {
    if (!proposalIdToGet) return;
    proposalRefetch();
  };

    // Fonction pour récupérer le workflowStatus depuis le smart contract
    const fetchWinningId = async () => {
        try {
        const id = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: "winningProposalID",
        });
        setWinningId(id);
        } catch (err) {
        setError(err);
        } finally {
        setLoading(false);
        }
    };
    // Appel initial au chargement (montage du comp)
    useEffect(() => {
        fetchWinningId();
    }, []);


  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh] p-6">
      <Card className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-2xl">
        <div className="flex flex-col items-center w-full text-center">

          <h2 className="mb-4 text-3xl text-gray-800">Winning proposal ID</h2>
          <p className="mb-4 text-3xl font-bold text-gray-800">
            {loading ? "Loading..." : winningId.toString() ?? "No Winning ID Found"}
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800">Find a proposal by ID</h2>
          <div className="flex w-full gap-4">
            <Input
              className="flex-grow"
              placeholder="Enter proposal ID"
              type="number"
              min="0"
              step="1"
              onChange={(id) => setProposalIdToGet(id.target.value)}
            />
            <Button variant="outline" disabled={getProposalPending} onClick={getProposal}>
              {status === "disconnected" ? "Please connect your wallet" : getProposalPending ? "Fetching..." : "Find"}
            </Button>
          </div>
          {proposalIdToGet && (
            <div className="mt-4">
              {getProposalPending ? (
                <div>Fetching...</div>
              ) : getProposalError ? (
                <p className="text-gray-500">There is no proposal with this ID</p>
              ) : (
                <p>
                    {getOneProposal?.description && getOneProposal?.voteCount !== undefined 
                        ? `Description : ${getOneProposal.description} - Votes: ${getOneProposal.voteCount}` 
                        : "No description available"}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default VotesTallied