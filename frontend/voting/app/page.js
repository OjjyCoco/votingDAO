// react
"use client";

import RegisteringVoters from "@/components/shared/RegisteringVoters";
import ProposalsRegistrationStarted from "@/components/shared/ProposalsRegistrationStarted";
import ProposalsRegistrationEnded from "@/components/shared/ProposalsRegistrationEnded";
import VotingSessionStarted from "@/components/shared/VotingSessionStarted";
import VotingSessionEnded from "@/components/shared/VotingSessionEnded";
// import VotesTallied from "../components/VotesTallied";

// context
import { useWorkflow } from "@/contexts/WorkflowContext";

export default function Home() {

  const { workflowStatus, loading, error } = useWorkflow();

  if (loading) return <p>Workflow Status is loading...</p>;
  if (error) return <p>Error loading workflow status</p>;

  const renderComponent = () => {
    switch (workflowStatus) {
      case 0:
        return <RegisteringVoters />;
      case 1:
        return <ProposalsRegistrationStarted />;
      case 2:
        return <ProposalsRegistrationEnded />;
      case 3:
        return <VotingSessionStarted />;
      case 4:
        return <VotingSessionEnded />;
      // case 5:
      //   return <VotesTallied />;
      default:
        return <p>Unknown status</p>;
    }
  };

  return <div>{renderComponent()}</div>;
}
