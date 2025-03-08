'use client'

// shadcn
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
import Event from "./Event";

// context
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useOwner } from "@/contexts/OwnerContext";



const ProposalsRegistrationStarted = () => {

  const { status, address : userAddress } = useAccount();

  // context
  const { fetchWorkflowStatus } = useWorkflow();
  const { ownerAddress } = useOwner();

  const [votedId, setVotedId] = useState(null)
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

  const setVote = async() => {

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'setVote',
      args: [votedId]
    })    
  }

  const endVotingSession = async() => {

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'endVotingSession'
    })    
  }

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({
    hash
  })

  const getEvents = async() => {
    // On peut changer le nom de la variable numberChangedLog je suppose
    const numberChangedLog = await publicClient.getLogs({
        address: contractAddress,
        event: parseAbiItem('event Voted(address voter, uint proposalId)'),
        fromBlock: 0n,
    })
    // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
    setEvents(numberChangedLog.map(
        log => ({
            voter: log.args.voter.toString(),
            proposalId : log.args.proposalId.toString()
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
    <div className="flex flex-col w-full">
      <h2 className="mb-4 text-4xl">Submit the proposal's ID you want to vote for</h2>
      <div className="flex">
        <Input placeholder="666" onChange={(v) => setVotedId(v.target.value)} />
        <Button variant="outline" disabled={writePending} onClick={setVote}>
          {
            status === "disconnected" ? "Please connect your wallet" : writePending ? "Voting..." : "Vote"
          }
        </Button>
      </div>
      <h2 className="mt-6 mb-4 text-4xl">Events</h2>
      <div className="flex flex-col w-full">
        {events.length > 0 && events.map((event) => {
          return (
            <Event event={event} key={crypto.randomUUID()} />
          )
        })}
      </div>
      <h2 className="mb-4 text-4xl">Find a proposal by ID :</h2>
      <div className="flex">
        <Input placeholder="Enter proposal ID" type="number" min="0" step="1" onChange={(id) => setProposalIdToGet(id.target.value)} />
        <Button variant="outline" disabled={getProposalPending} onClick={getProposal}>
          {
            status === "disconnected" ? "Please connect your wallet" : getProposalPending ? "Fetching..." : "Find"
          }
        </Button>
      </div>
      {proposalIdToGet && (
        <div>
          {getProposalPending ? (
            <div>Fetching...</div>
          ) : getProposalError ? (
            <p>There is no proposal with this ID</p>
          ) : (
            <p>{getOneProposal?.description || "No description available"}</p>
          )}
        </div>
      )}
      { ownerAddress === userAddress && (
        <>
          <h2 className="mb-4 text-4xl">End Voting Session :</h2>
          <Button variant="outline" disabled={writePending} onClick={endVotingSession}>
            {
              status === "disconnected" ? "Please connect your wallet" : writePending ? 'Loading...' : 'End Voting Session'
            }
          </Button>
        </>
      )}
    </div>
    
  )
}

export default ProposalsRegistrationStarted