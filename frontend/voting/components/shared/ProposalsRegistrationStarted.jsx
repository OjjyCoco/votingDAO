  'use client'
  
  // shadcn
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
  
  // react
  import { useState, useEffect } from "react";
  
  // wagmi
  import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
  
  // contract
  import { contractAddress, contractAbi } from "@/constants";
  
  // viem
  import { parseAbiItem } from "viem";
  import { publicClient } from "@/utils/client";
  
  // Event
  // import Event from "./Event";
  import { Card } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  
  
  
  const ProposalsRegistrationStarted = () => {
  
    const [proposal, setProposal] = useState(null)
    const [events, setEvents] = useState([])

    const Event = ({ event }) => {
      return (
        <Card className="p-4 mb-2">
            <div className="flex items-center">
                <Badge className="bg-lime-500">Proposal registered</Badge>
                <p className="ml-2">Proposal : <span className="font-bold">{event.proposalId}</span></p>
            </div>
        </Card>
      )
    }
    
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
            proposalId: log.args.proposalId.toString()
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
  
    return (
      <div className="flex flex-col w-full">
        <h2 className="mb-4 text-4xl">Proposal registration has started! Submit your proposals</h2>
        <div className="flex">
              <Input placeholder="Less gaz fees plz" onChange={(p) => setProposal(p.target.value)} />
              <Button variant="outline" disabled={setIsPending} onClick={addProposal}>{setIsPending ? 'Sending...' : 'Sent'}</Button>
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
        <Button variant="outline" disabled={setIsPending} onClick={endProposalsRegistering}>{setIsPending ? 'Loading...' : 'Next step : endProposalsRegistering'}</Button>
      </div>
    )
  }
  
  export default ProposalsRegistrationStarted