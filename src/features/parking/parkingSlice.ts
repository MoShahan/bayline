import { createSlice } from "@reduxjs/toolkit";

import data from "../../data.json";

import type { SpotType } from "@/src/types";

const initialState = {
  spots: [...data.data] as SpotType[],
};

const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    addSpot: (state, action) => {
      state.spots.push({
        id: state.spots.length + 1,
        ...action.payload,
      });
    },

    updateSpot: (state, action) => {
      const index = state.spots.findIndex(
        (spot) => spot.id === action.payload.id,
      );
      if (index !== -1) {
        state.spots[index] = { ...state.spots[index], ...action.payload };
      }
    },

    removeSpot: (state, action) => {
      state.spots = state.spots.filter((spot) => spot.id !== action.payload);
    },
  },
});

export const { addSpot, updateSpot, removeSpot } = parkingSlice.actions;
export default parkingSlice.reducer;
