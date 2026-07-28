import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/src/app/hooks";
import { MAX_SPOTS } from "@/src/constants";
import EditModal from "@/src/EditModal";
import {
  selectAllSpots,
  selectParkingStats,
} from "@/src/features/parking/parkingSelectors";
import {
  addSpot,
  removeSpot,
  updateSpot,
} from "@/src/features/parking/parkingSlice";
import SpotCard from "@/src/SpotCard";

import type { SpotStatus } from "@/src/types";

function App() {
  const [editingSpotId, setEditingSpotId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const spots = useAppSelector(selectAllSpots);
  const stats = useAppSelector(selectParkingStats);

  const editingSpot =
    editingSpotId === null
      ? null
      : (spots.find((spot) => spot.id === editingSpotId) ?? null);

  const handleAddSpot = () => {
    if (spots.length >= MAX_SPOTS) return;
    dispatch(
      addSpot({ status: "available", vehicle: "", temporary: true }),
    );
  };

  const handleEdit = (id: number) => {
    setEditingSpotId(id);
  };

  const handleRemove = (id: number) => {
    dispatch(removeSpot(id));
  };

  const handleSave = (payload: {
    id: number;
    status: SpotStatus;
    vehicle: string;
  }) => {
    dispatch(updateSpot(payload));
    setEditingSpotId(null);
  };

  return (
    <div className="p-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <p>Available: {stats.available}</p>
          <p>Occupied: {stats.occupied}</p>
          <p>Reserved: {stats.reserved}</p>
          <p>Total: {stats.total}</p>
        </div>
        <Button onClick={handleAddSpot} disabled={spots.length >= MAX_SPOTS}>
          Add
        </Button>
      </header>

      <div className="flex flex-wrap text-center">
        {spots.map((spot) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <Dialog
        open={editingSpotId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingSpotId(null);
        }}
      >
        <EditModal
          open={editingSpotId !== null}
          spot={editingSpot}
          onOpenChange={(open) => {
            if (!open) setEditingSpotId(null);
          }}
          onSave={handleSave}
        />
      </Dialog>
    </div>
  );
}

export default App;
