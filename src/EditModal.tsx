import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { STATUSES } from "@/src/constants";
import { STATUS_DOT } from "@/src/statusStyles";

import type { EditModalProps, SpotStatus, SpotType } from "@/src/types";

type EditModalFormProps = {
  spot: SpotType;
  onOpenChange: (open: boolean) => void;
  onSave: EditModalProps["onSave"];
};

const editableStatus = (status: SpotStatus): SpotStatus =>
  status === "reserved" ? "available" : status;

const EditModalForm = ({ spot, onOpenChange, onSave }: EditModalFormProps) => {
  const [status, setStatus] = useState<SpotStatus>(() =>
    editableStatus(spot.status),
  );
  const [vehicleName, setVehicleName] = useState(spot.vehicle);

  const trimmedVehicle = vehicleName.trim();
  const canSave =
    status === "available" ||
    (status === "occupied" && trimmedVehicle.length > 0);

  const handleSave = () => {
    if (!canSave) return;

    onSave({
      id: spot.id,
      status,
      vehicle: status === "available" ? "" : trimmedVehicle,
    });
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit spot {spot.id}</DialogTitle>
        <DialogDescription>
          Update this bay&apos;s status and vehicle assignment. Available bays
          clear any vehicle name automatically.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="spot-status">
            Status
          </label>
          <Select
            items={STATUSES}
            value={status}
            onValueChange={(value) => {
              if (value === "available" || value === "occupied") {
                setStatus(value);
              }
            }}
          >
            <SelectTrigger id="spot-status" className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {STATUSES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          STATUS_DOT[item.value],
                        )}
                      />
                      {item.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {status !== "available" && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="vehicle-name">
              Vehicle name
            </label>
            <Input
              id="vehicle-name"
              placeholder="Vehicle name"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Required when the bay is marked occupied.
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button disabled={!canSave} onClick={handleSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const EditModal = ({ open, spot, onOpenChange, onSave }: EditModalProps) => {
  if (!open || !spot) {
    return null;
  }

  return (
    <EditModalForm
      key={spot.id}
      spot={spot}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  );
};

export default EditModal;
