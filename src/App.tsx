import { useMemo, useState } from "react";

import "./App.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { MAX_SPOTS } from "./constants";
import data from "./data.json";
import EditModal from "./EditModal";

import type { SpotStatus, SpotType } from "./types";

function App() {
  const [spots, setSpots] = useState<SpotType[]>(data.data as SpotType[]);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [vehicleName, setVehicleName] = useState<string>("");

  const stats = useMemo(() => {
    return spots.reduce(
      (acc, spot) => {
        acc[spot.status] = (acc[spot.status] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { available: 0, occupied: 0, reserved: 0, total: 0 },
    );
  }, [spots]);

  const handleAddSpot = () => {
    if (spots.length >= MAX_SPOTS) return;

    setSpots([
      ...spots,
      {
        id: spots.length + 1,
        status: "available",
        vehicle: "",
        temporary: true,
      },
    ]);
  };

  const isEditable = (status: SpotStatus) =>
    status === "available" || status === "occupied";

  const handleEdit = (id: number) => () => {
    setSpots(
      spots.map((spot) =>
        spot.id === id
          ? {
              ...spot,
              status: (selectedStatus || "available") as SpotStatus,
              vehicle: vehicleName,
            }
          : spot,
      ),
    );
    setSelectedStatus(null);
    setVehicleName("");
  };

  const handleRemove = (id: number) => () => {
    setSpots(spots.filter((spot) => spot.id !== id));
  };

  return (
    <div>
      <header>
        <div>
          <p>Available: {stats.available}</p>
          <p>Occupied: {stats.occupied}</p>
          <p>Reserved: {stats.reserved}</p>
          <p>Total: {stats.total}</p>
        </div>
        <Button onClick={handleAddSpot} disabled={spots.length >= MAX_SPOTS}>
          Add
        </Button>
      </header>
      <div className="flex text-center flex-wrap">
        {spots.map((spot: SpotType, i: number) => (
          <div key={i} style={{ border: "1px solid red" }} className="p-2 m-2">
            <p>{i + 1}</p>
            <p className="capitalize">{spot.status}</p>
            <p>{spot.status === "available" ? "-" : spot.vehicle}</p>

            <Dialog>
              <DialogTrigger
                disabled={!isEditable(spot.status)}
                onClick={() => {
                  setVehicleName(spot.vehicle);
                  setSelectedStatus(spot.status);
                }}
              >
                Edit
              </DialogTrigger>

              <EditModal
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                handleSave={handleEdit(spot.id)}
                vehicleName={vehicleName}
                setVehicleName={setVehicleName}
              ></EditModal>
            </Dialog>

            <Button disabled={!spot.temporary} onClick={handleRemove(spot.id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
