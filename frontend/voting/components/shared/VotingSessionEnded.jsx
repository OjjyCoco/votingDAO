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



const VotingSessionEnded = () => {

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

  const tallyVotes = async() => {

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'tallyVotes'
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
                <h2 className="mb-4 text-4xl">Voting session has ended. Click to tally votes :</h2>
                <Button variant="outline" disabled={writePending} onClick={tallyVotes}>
                    {
                    status === "disconnected" ? "Please connect your wallet" : writePending ? 'Loading...' : 'Tally'
                    }
                </Button>
            </div> ) : (
            <h2 className="mt-6 mb-4 text-4xl">Voting session has ended. Wait for the admin to start vote tallying function.</h2>
          )
        }
    </div>
  )
}

export default VotingSessionEnded