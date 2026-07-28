import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { SpotCardProps, SpotStatus } from "@/src/types";

const isEditable = (status: SpotStatus) =>
  status === "available" || status === "occupied";

const SpotCard = ({ spot, onEdit, onRemove }: SpotCardProps) => {
  return (
    <Card size="sm" className="m-2 w-40 text-center">
      <CardHeader>
        <CardTitle>Spot {spot.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="capitalize">{spot.status}</p>
        <p>{spot.status === "available" ? "-" : spot.vehicle}</p>
      </CardContent>
      <CardFooter className="justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!isEditable(spot.status)}
          onClick={() => onEdit(spot.id)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={!spot.temporary}
          onClick={() => onRemove(spot.id)}
        >
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpotCard;
