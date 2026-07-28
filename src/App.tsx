import { useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { MAX_SPOTS } from "./constants";
import EditModal from "./EditModal";
import {
  selectAllSpots,
  selectParkingStats,
} from "./features/parking/parkingSelectors";

import type { AppDispatch } from "./app/store";
import type { SpotStatus, SpotType } from "./types";

function App() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [vehicleName, setVehicleName] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const spots = useSelector(selectAllSpots);
  const stats = useSelector(selectParkingStats);

  const handleAddSpot = () => {
    if (spots.length >= MAX_SPOTS) return;
    dispatch({
      type: "parking/addSpot",
      payload: { status: "available", vehicle: "", temporary: true },
    });
  };

  const isEditable = (status: SpotStatus) =>
    status === "available" || status === "occupied";

  const handleEdit = (id: number) => () => {
    dispatch({
      type: "parking/updateSpot",
      payload: { id, status: selectedStatus, vehicle: vehicleName },
    });

    setSelectedStatus(null);
    setVehicleName("");
  };

  const handleRemove = (id: number) => () => {
    dispatch({ type: "parking/removeSpot", payload: id });
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
