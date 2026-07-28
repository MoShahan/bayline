import { Car, CircleParking, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { STATUS_LABELS, STATUS_STYLES } from "@/src/statusStyles";

import type { SpotCardProps, SpotStatus } from "@/src/types";

const isEditable = (status: SpotStatus) =>
  status === "available" || status === "occupied";

const SpotCard = ({ spot, onEdit, onRemove }: SpotCardProps) => {
  const styles = STATUS_STYLES[spot.status];
  const canEdit = isEditable(spot.status);
  const canRemove = Boolean(spot.temporary);
  const vehicleLabel =
    spot.status === "available" ? "Open bay" : spot.vehicle || "Unassigned";

  const handleEdit = () => {
    if (!canEdit) {
      toast.error("Can't edit this bay", {
        description:
          "Reserved spots are locked. Check in or cancel the reservation first.",
      });
      return;
    }
    onEdit(spot.id);
  };

  const handleRemove = () => {
    if (!canRemove) {
      toast.error("Spot can't be removed", {
        description: "Only temporary bays can be deleted from the board.",
      });
      return;
    }
    onRemove(spot.id);
  };

  return (
    <Card
      size="sm"
      className={cn(
        "relative w-full overflow-hidden border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        styles.card,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
          styles.accent,
        )}
      />

      <CardHeader className="relative gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-lg",
                styles.glow,
              )}
            >
              {spot.status === "available" ? (
                <CircleParking className={cn("size-4", styles.icon)} />
              ) : (
                <Car className={cn("size-4", styles.icon)} />
              )}
            </span>
            <CardTitle className="text-base tracking-tight">
              Spot {spot.id}
            </CardTitle>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              styles.badge,
            )}
          >
            {STATUS_LABELS[spot.status]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Vehicle
        </p>
        <p
          className={cn(
            "truncate text-sm font-medium",
            spot.status === "available"
              ? "text-muted-foreground"
              : "text-foreground",
          )}
        >
          {spot.status === "available" ? "-" : vehicleLabel}
        </p>
        {spot.temporary && (
          <p className="pt-1 text-xs text-muted-foreground">Temporary bay</p>
        )}
      </CardContent>

      <CardFooter className="relative justify-stretch gap-2">
        <Button
          size="sm"
          variant="outline"
          className={cn("flex-1", !canEdit && "opacity-60")}
          aria-disabled={!canEdit}
          onClick={handleEdit}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className={cn("flex-1", !canRemove && "opacity-60")}
          aria-disabled={!canRemove}
          onClick={handleRemove}
        >
          <Trash2 className="size-3.5" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpotCard;
