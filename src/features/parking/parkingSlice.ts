import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import data from "@/src/data.json";

import type { SpotStatus, SpotType } from "@/src/types";

type AddSpotPayload = {
  status: SpotStatus;
  vehicle: string;
  temporary?: boolean;
};

type UpdateSpotPayload = {
  id: number;
  status: SpotStatus;
  vehicle: string;
};

const initialState = {
  spots: [...data.data] as SpotType[],
};

const nextSpotId = (spots: SpotType[]) =>
  Math.max(0, ...spots.map((spot) => spot.id)) + 1;

const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    addSpot: (state, action: PayloadAction<AddSpotPayload>) => {
      state.spots.push({
        id: nextSpotId(state.spots),
        ...action.payload,
      });
    },

    updateSpot: (state, action: PayloadAction<UpdateSpotPayload>) => {
      const { id, status } = action.payload;
      const vehicle =
        status === "available" ? "" : action.payload.vehicle.trim();

      if (status === "occupied" && vehicle === "") {
        return;
      }

      const index = state.spots.findIndex((spot) => spot.id === id);
      if (index !== -1) {
        state.spots[index] = {
          ...state.spots[index],
          status,
          vehicle,
        };
      }
    },

    removeSpot: (state, action: PayloadAction<number>) => {
      state.spots = state.spots.filter(
        (spot) => !(spot.id === action.payload && spot.temporary),
      );
    },
  },
});

export const { addSpot, updateSpot, removeSpot } = parkingSlice.actions;
export default parkingSlice.reducer;
