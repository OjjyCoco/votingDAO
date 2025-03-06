// context
import { useWorkflow } from "@/contexts/WorkflowContext";

// shadcn
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Event = ({ event }) => {

  const { workflowStatus } = useWorkflow();

  const renderComponent = () => {
    switch (workflowStatus) {
      case 0:
        return (
          <Card className="p-4 mb-2">
            <div className="flex items-center">
              <Badge className="bg-lime-500">Voter added</Badge>
              <p className="ml-2">Address : <span className="font-bold">{event.voterAddress}</span></p>
            </div>
          </Card>
        )
      case 1:
        return (
          <Card className="p-4 mb-2">
            <div className="flex items-center">
              <Badge className="bg-lime-500">Proposal registered</Badge>
              <p className="ml-2">Proposal : <span className="font-bold">{event.proposalId}</span></p>
            </div>
          </Card>
        )
      default:
        return <p>Can't fetch events related to this WF status.</p>;
    }
  };

  return <div>{renderComponent()}</div>;
}

export default Event