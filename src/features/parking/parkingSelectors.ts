import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/src/app/store";
import type { SpotStatus } from "@/src/types";

export const selectAllSpots = (state: RootState) => state.parking.spots;

export const selectParkingStats = createSelector([selectAllSpots], (spots) => {
  return spots.reduce(
    (acc, spot) => {
      const status = spot.status as SpotStatus;
      acc[status] = (acc[status] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { available: 0, occupied: 0, reserved: 0, total: 0 },
  );
});
