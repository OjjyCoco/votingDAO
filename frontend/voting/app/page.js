// react
"use client";

import RegisteringVoters from "@/components/status/RegisteringVoters";
import ProposalsRegistrationStarted from "@/components/status/ProposalsRegistrationStarted";
import ProposalsRegistrationEnded from "@/components/status/ProposalsRegistrationEnded";
import VotingSessionStarted from "@/components/status/VotingSessionStarted";
import VotingSessionEnded from "@/components/status/VotingSessionEnded";
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
