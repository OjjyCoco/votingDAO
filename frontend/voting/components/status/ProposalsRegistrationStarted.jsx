'use client'

// shadcn
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// react
import { useState, useEffect } from "react";

// wagmi
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

// contract
import { contractAddress, contractAbi } from "@/constants";

// viem
import { parseAbiItem } from "viem";
import { publicClient } from "@/utils/client";

// Event
import Event from "../shared/Event";

// context
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useOwner } from "@/contexts/OwnerContext";



const ProposalsRegistrationStarted = () => {

  const { status, address : userAddress } = useAccount();

  // context
  const { fetchWorkflowStatus } = useWorkflow();
  const { ownerAddress } = useOwner();

  const [proposal, setProposal] = useState(null)
  const [proposalIdToGet, setProposalIdToGet] = useState(null)
  const [events, setEvents] = useState([])
  
  const { data: hash, error, isPending: writePending, writeContract } = useWriteContract({
    mutation: {
      // onSuccess: () => {

      // },
      // onError: (error) => {

      // }
    }
  })

  const addProposal = async() => {

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'addProposal',
      args: [proposal]
    })    
  }

  const endProposalsRegistering = async() => {

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'endProposalsRegistering'
    })    
  }

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({
    hash
  })

  const getEvents = async() => {
    // On peut changer le nom de la variable numberChangedLog je suppose
    const numberChangedLog = await publicClient.getLogs({
        address: contractAddress,
        event: parseAbiItem('event ProposalRegistered(uint proposalId)'),
        fromBlock: 0n,
    })
    // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
    setEvents(numberChangedLog.map(
        log => ({
          proposalId: log.args.proposalId.toString(),
          // ProposalDescription : log.args.ProposalDescription.toString()
        })
    ))
  }

  useEffect(() => {
    if(isSuccess) {
      getEvents();
    }
    if(errorConfirmation) {
      alert("Transaction failed");
    }
  }, [isSuccess, errorConfirmation])

  useEffect(() => {
    if (isSuccess) {
      fetchWorkflowStatus(); // Met à jour le workflowStatus après une transaction réussie
    }
  }, [isSuccess])
  
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


  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh] p-6">
      <Card className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-2xl">
        <div className="flex flex-col items-center w-full text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800">Proposal registration has started! Submit your proposals</h2>
          <div className="flex w-full gap-4">
            <Input
              className="flex-grow"
              placeholder="Less gaz fees plz"
              onChange={(p) => setProposal(p.target.value)}
            />
            <Button variant="outline" disabled={writePending} onClick={addProposal}>
              {status === "disconnected" ? "Please connect your wallet" : writePending ? "Sending..." : "Send"}
            </Button>
          </div>

          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800">Events</h2>
          <div className="flex flex-col w-full gap-2">
            {events.length > 0 ? (
              events.map((event) => <Event event={event} key={crypto.randomUUID()} />)
            ) : (
              <p className="text-gray-500">No events available.</p>
            )}
          </div>

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
                <p>{getOneProposal?.description || "No description available"}</p>
              )}
            </div>
          )}

          {ownerAddress === userAddress && (
            <>
              <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800">Finish Proposal Registration and head to endProposalsRegistering</h2>
              <Button variant="outline" disabled={writePending} onClick={endProposalsRegistering}>
                {status === "disconnected" ? "Please connect your wallet" : writePending ? 'Loading...' : 'End Proposal Registering'}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ProposalsRegistrationStarted