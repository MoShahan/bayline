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
import { STATUSES } from "@/src/constants";

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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit spot {spot.id}</DialogTitle>
        <DialogDescription>
          Make changes here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      <div>
        <Select
          items={STATUSES}
          value={status}
          onValueChange={(value) => {
            if (value === "available" || value === "occupied") {
              setStatus(value);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STATUSES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {status !== "available" && (
        <div>
          <Input
            placeholder="Vehicle name"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
        </div>
      )}

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
