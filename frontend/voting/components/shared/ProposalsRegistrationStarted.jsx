'use client'

// shadcn
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// react
import { useState, useEffect } from "react";

// wagmi
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

// contract
import { contractAddress, contractAbi } from "@/constants";

// viem
import { parseAbiItem } from "viem";
import { publicClient } from "@/utils/client";

// Event
import Event from "./Event";

// context
import { useWorkflow } from "@/contexts/WorkflowContext";



const ProposalsRegistrationStarted = () => {

  const { status, userAddress } = useAccount();

  // context
  const { fetchWorkflowStatus } = useWorkflow();

  const [proposal, setProposal] = useState(null)
  const [events, setEvents] = useState([])
  
  const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
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

  return (
    <div className="flex flex-col w-full">
      <h2 className="mb-4 text-4xl">Proposal registration has started! Submit your proposals</h2>
      <div className="flex">
            <Input placeholder="Less gaz fees plz" onChange={(p) => setProposal(p.target.value)} />
            <Button variant="outline" disabled={setIsPending} onClick={addProposal}>
              {
                status === "disconnected" ? "Please connect your wallet" : setIsPending ? "Sending..." : "Send"
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
      <h2 className="mb-4 text-4xl">Finish Proposal Registration and head to endProposalsRegistering :</h2>
      <Button variant="outline" disabled={setIsPending} onClick={endProposalsRegistering}>
        {
          status === "disconnected" ? "Please connect your wallet" : setIsPending ? 'Loading...' : 'End Proposal Registering'
        }
      </Button>
    </div>
  )
}

export default ProposalsRegistrationStarted