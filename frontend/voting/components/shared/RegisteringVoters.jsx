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
import { useOwner } from "@/contexts/OwnerContext";



const RegisteringVoters = () => {

  const { status, address : userAddress } = useAccount();

  // context
  const { fetchWorkflowStatus } = useWorkflow();
  const { ownerAddress, fetchOwnerAddress } = useOwner();

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

  // Mettre à jour le context du WorkflowStatus pour savoir si on change de composant ou pas
  useEffect(() => {
    if (isSuccess) {
      fetchWorkflowStatus();
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isSuccess) {
      fetchOwnerAddress();
    }
  }, [status]);

  return (
    <div>
      {
        ownerAddress === userAddress ? (
          <div className="flex flex-col w-full">
          <h2 className="mb-4 text-4xl">Voter registration is currently open.</h2>
          <div className="flex">
                <Input placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" onChange={(_addr) => setAddress(_addr.target.value)} />
                <Button variant="outline" disabled={setIsPending} onClick={addVoter}>
                  {
                    status === "disconnected" ? "Please connect your wallet" : setIsPending ? "Adding" : "Add"
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
          <h2 className="mb-4 text-4xl">Finish Voter Registration and head to Add Proposal step :</h2>
          <Button variant="outline" disabled={setIsPending} onClick={startProposalsRegistering}>
            {
              status === "disconnected" ? "Please connect your wallet" : setIsPending ? 'Loading...' : 'Start Proposal Registering'
            }
          </Button>
        </div> ) : (
        <div>
          <h2 className="mt-6 mb-4 text-4xl">Admin is currently registering voters, please wait until he has finished.</h2>
          <h2 className="mt-6 mb-4 text-4xl">You can still see the registered voters below :</h2>
          <div className="flex flex-col w-full">
          {events.length > 0 && events.map((event) => {
            return (
              <Event event={event} key={crypto.randomUUID()} />
            )
          })}
          </div>
        </div>)
      }
    </div>
    // <div className="flex flex-col w-full">
    //   <p>Your current address : {userAddress}</p>
    //   <p>Owner address : {ownerAddress}</p>
    //   <h2 className="mb-4 text-4xl">Voter registration is currently open.</h2>
    //   <div className="flex">
    //         <Input placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" onChange={(_addr) => setAddress(_addr.target.value)} />
    //         <Button variant="outline" disabled={setIsPending} onClick={addVoter}>
    //           {
    //             status === "disconnected" ? "Please connect your wallet" : setIsPending ? "Adding" : "Add"
    //           }
    //         </Button>
    //   </div>
    //   <h2 className="mt-6 mb-4 text-4xl">Events</h2>
    //   <div className="flex flex-col w-full">
    //     {events.length > 0 && events.map((event) => {
    //       return (
    //         <Event event={event} key={crypto.randomUUID()} />
    //       )
    //     })}
    //   </div>
    //   <h2 className="mb-4 text-4xl">Finish Voter Registration and head to Add Proposal step :</h2>
    //   <Button variant="outline" disabled={setIsPending} onClick={startProposalsRegistering}>
    //     {
    //       status === "disconnected" ? "Please connect your wallet" : setIsPending ? 'Loading...' : 'Start Proposal Registering'
    //     }
    //   </Button>
    // </div>
  )
}

export default RegisteringVoters