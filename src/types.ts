import type { Dispatch } from "react";

export type SpotStatus = "available" | "occupied" | "reserved";

export type SpotType = {
  id: number;
  status: SpotStatus;
  vehicle: string;
  temporary?: boolean;
};

export type EditModalProps = {
  selectedStatus: string | null;
  setSelectedStatus: Dispatch<React.SetStateAction<string | null>>;
  handleSave: () => void;
  vehicleName: string;
  setVehicleName: Dispatch<React.SetStateAction<string>>;
};
