'use client'

// shadcn
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// react
import { useEffect } from "react";

// wagmi
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

// contract
import { contractAddress, contractAbi } from "@/constants";

// context
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useOwner } from "@/contexts/OwnerContext";



const ProposalsRegistrationEnded = () => {

  const { status, address : userAddress } = useAccount();

  // context
  const { fetchWorkflowStatus } = useWorkflow();
  const { ownerAddress } = useOwner();

  const { data: hash, error, isPending: writePending, writeContract } = useWriteContract({
    mutation: {
      // onSuccess: () => {

      // },
      // onError: (error) => {

      // }
    }
  })

  const StartVotingSession = async() => {

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'startVotingSession'
    })    
  }

  const { isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  // Mettre à jour le context du WorkflowStatus pour savoir si on change de composant ou pas
  useEffect(() => {
    if (isSuccess) {
      fetchWorkflowStatus();
    }
  }, [isSuccess]);
//   useEffect(() => {
//     if (isSuccess) {
//       fetchOwnerAddress();
//     }
//   }, [status]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh] p-6">
      {ownerAddress === userAddress ? (
        <Card className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-2xl">
          <div className="flex flex-col items-center w-full text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">Proposal Registration has ended. Click to start the voting session:</h2>
            <Button variant="outline" disabled={writePending} onClick={StartVotingSession}>
              {status === "disconnected" ? "Please connect your wallet" : writePending ? 'Loading...' : 'Start Voting Session'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Proposal registration has ended. Wait for the admin to start the voting session.</h2>
        </div>
      )}
    </div>
  )
}

export default ProposalsRegistrationEnded