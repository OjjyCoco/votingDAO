import {
    Card
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Event = ({ event }) => {
  return (
    <Card className="p-4 mb-2">
        <div className="flex items-center">
            <Badge className="bg-lime-500">Voter added</Badge>
            <p className="ml-2">Address : <span className="font-bold">{event.voterAddress}</span></p>
        </div>
    </Card>
  )
}

export default Event