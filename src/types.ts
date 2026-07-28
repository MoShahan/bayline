export type SpotStatus = "available" | "occupied" | "reserved";

export type SpotType = {
  id: number;
  status: SpotStatus;
  vehicle: string;
  temporary?: boolean;
};

export type EditModalProps = {
  open: boolean;
  spot: SpotType | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: {
    id: number;
    status: SpotStatus;
    vehicle: string;
  }) => void;
};

export type SpotCardProps = {
  spot: SpotType;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
};
