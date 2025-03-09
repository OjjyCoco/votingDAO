'use client'

// shadcn
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
import Event from "../shared/Event";

// context
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useOwner } from "@/contexts/OwnerContext";



const RegisteringVoters = () => {

  const { status, address : userAddress } = useAccount();

  // context
  const { fetchWorkflowStatus } = useWorkflow();
  const { ownerAddress } = useOwner();

  const [address, setAddress] = useState(null)
  const [events, setEvents] = useState([])

  const { data: hash, error, isPending: writeIsPending, writeContract } = useWriteContract({
    mutation: {
      // onSuccess: () => {

      // },
      // onError: (error) => {

      // }
    }
  })

  const addVoter = async() => {

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'addVoter',
      args: [address]
    })    
  }

  const startProposalsRegistering = async() => {

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'startProposalsRegistering'
    })    
  }

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({
    hash
  })

  const getEvents = async() => {
    // On récupère tous les events VoterRegistered
    const numberChangedLog = await publicClient.getLogs({
        address: contractAddress,
        event: parseAbiItem('event VoterRegistered(address voterAddress)'),
        fromBlock: 0n,
    })
    // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
    setEvents(numberChangedLog.map(
        log => ({
          voterAddress: log.args.voterAddress.toString()
        })
    ))
  }

  useEffect(() => {
    if(isSuccess) {
      // toast({
      //   title: "Félicitations",
      //   description: "Votre nombre a été inscrit dans la Blockchain",
      //   className: "bg-lime-200"
      // })
      getEvents();
    }
    if(errorConfirmation) {
      // toast({
      //     title: errorConfirmation.message,
      //     status: "error",
      //     duration: 3000,
      //     isClosable: true,
      // });
      alert("Transaction failed");
    }
  }, [isSuccess, errorConfirmation])

  // Mettre à jour le context du WorkflowStatus pour savoir si on change de composant ou pas
  useEffect(() => {
    if (isSuccess) {
      fetchWorkflowStatus();
    }
  }, [isSuccess]);
  // useEffect(() => {
  //   if (isSuccess) {
  //     fetchOwnerAddress();
  //   }
  // }, [status]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh] p-6">
      <Card className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-2xl">
        {ownerAddress === userAddress ? (
          <div className="flex flex-col items-center w-full text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">Voter Registration is Open</h2>
            <div className="flex w-full gap-4">
              <Input 
                className="flex-grow"
                placeholder="Enter voter address"
                onChange={(e) => setAddress(e.target.value)}
              />
              <Button variant="outline" disabled={writeIsPending} onClick={addVoter}>
                {status === "disconnected" ? "Please connect your wallet" : writeIsPending ? "Adding..." : "Add"}
              </Button>
            </div>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800">Events</h2>
            <div className="flex flex-col w-full gap-2">
              {events.length > 0 ? (
                events.map((event) => <Event event={event} key={crypto.randomUUID()} />)
              ) : (
                <p className="text-gray-500">Events are arriving when a voter is registered.</p>
              )}
            </div>

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800">Finalize Registration</h2>
            <Button variant="outline" disabled={writeIsPending} onClick={startProposalsRegistering}>
              {status === "disconnected" ? "Please connect your wallet" : writeIsPending ? "Loading..." : "Start Proposal Registering"}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Admin is registering voters</h2>
            <p className="text-gray-600">Please wait until registration is completed.</p>
            <h2 className="mt-6 text-xl font-semibold text-gray-800">Registered Voters</h2>
            <div className="flex flex-col w-full gap-2 mt-4">
              {events.length > 0 ? (
                events.map((event) => <Event event={event} key={crypto.randomUUID()} />)
              ) : (
                <p className="text-gray-500">Events are arriving when a voter is registered.</p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default RegisteringVoters