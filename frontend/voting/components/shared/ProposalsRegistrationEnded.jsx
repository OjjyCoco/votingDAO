'use client'

// shadcn
import { Button } from "@/components/ui/button"

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
    <div>
        {
        ownerAddress === userAddress ? (
            <div className="flex flex-col w-full">
                <h2 className="mb-4 text-4xl">Proposal Registration has ended. Click to start the voting session :</h2>
                <Button variant="outline" disabled={writePending} onClick={StartVotingSession}>
                    {
                    status === "disconnected" ? "Please connect your wallet" : writePending ? 'Loading...' : 'Start Voting Session'
                    }
                </Button>
            </div> ) : (
            <h2 className="mt-6 mb-4 text-4xl">Proposal registration has ended. Wait for the admin to start the voting session.</h2>
          )
        }
    </div>
  )
}

export default ProposalsRegistrationEnded