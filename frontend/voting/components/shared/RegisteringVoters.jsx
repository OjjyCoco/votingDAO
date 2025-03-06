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
import Event from "./Event";



const RegisteringVoters = () => {

  const [address, setAddress] = useState(null)
  const [events, setEvents] = useState([])

  const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
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

  return (
    <div className="flex flex-col w-full">
      <h2 className="mb-4 text-4xl">Voter registration is currently open.</h2>
      <div className="flex">
            <Input placeholder="0x000000" onChange={(_addr) => setAddress(_addr.target.value)} />
            <Button variant="outline" disabled={setIsPending} onClick={addVoter}>{setIsPending ? 'Adding...' : 'Added'}</Button>
      </div>
      <h2 className="mt-6 mb-4 text-4xl">Events</h2>
      <div className="flex flex-col w-full">
        {events.length > 0 && events.map((event) => {
          return (
            <Event event={event} key={crypto.randomUUID()} />
          )
        })}
      </div>
      <h2 className="mb-4 text-4xl">Finish Voter Registration and head to Add Proposal step :</h2>
      <Button variant="outline" disabled={setIsPending} onClick={startProposalsRegistering}>{setIsPending ? 'Loading...' : 'Next step : Proposal Registration'}</Button>
    </div>
  )
}

export default RegisteringVoters