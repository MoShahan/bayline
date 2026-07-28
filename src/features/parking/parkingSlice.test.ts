import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";

import parkingReducer, {
  addSpot,
  removeSpot,
  updateSpot,
} from "@/src/features/parking/parkingSlice";

import type { SpotType } from "@/src/types";

const sampleSpots: SpotType[] = [
  { id: 1, status: "available", vehicle: "" },
  { id: 2, status: "occupied", vehicle: "Creta" },
  { id: 3, status: "reserved", vehicle: "Civic" },
];

const createStore = (spots: SpotType[] = sampleSpots) =>
  configureStore({
    reducer: { parking: parkingReducer },
    preloadedState: { parking: { spots } },
  });

describe("parkingSlice", () => {
  it("adds a spot with the next available id", () => {
    const store = createStore();

    store.dispatch(
      addSpot({ status: "available", vehicle: "", temporary: true }),
    );

    const spots = store.getState().parking.spots;
    expect(spots).toHaveLength(4);
    expect(spots[3]).toEqual({
      id: 4,
      status: "available",
      vehicle: "",
      temporary: true,
    });
  });

  it("assigns id 1 when adding to an empty list", () => {
    const store = createStore([]);

    store.dispatch(addSpot({ status: "available", vehicle: "" }));

    expect(store.getState().parking.spots[0]?.id).toBe(1);
  });

  it("updates an occupied spot with a vehicle", () => {
    const store = createStore();

    store.dispatch(
      updateSpot({ id: 1, status: "occupied", vehicle: "  Swift  " }),
    );

    expect(store.getState().parking.spots[0]).toMatchObject({
      id: 1,
      status: "occupied",
      vehicle: "Swift",
    });
  });

  it("clears the vehicle when marking a spot available", () => {
    const store = createStore();

    store.dispatch(updateSpot({ id: 2, status: "available", vehicle: "Creta" }));

    expect(store.getState().parking.spots[1]).toMatchObject({
      id: 2,
      status: "available",
      vehicle: "",
    });
  });

  it("ignores occupied updates with an empty vehicle", () => {
    const store = createStore();

    store.dispatch(updateSpot({ id: 2, status: "occupied", vehicle: "   " }));

    expect(store.getState().parking.spots[1]).toMatchObject({
      id: 2,
      status: "occupied",
      vehicle: "Creta",
    });
  });

  it("does nothing when updating a missing spot id", () => {
    const store = createStore();
    const before = store.getState().parking.spots;

    store.dispatch(
      updateSpot({ id: 99, status: "occupied", vehicle: "Ghost" }),
    );

    expect(store.getState().parking.spots).toEqual(before);
  });

  it("removes a spot by id", () => {
    const store = createStore();

    store.dispatch(removeSpot(2));

    expect(store.getState().parking.spots.map((spot) => spot.id)).toEqual([
      1, 3,
    ]);
  });
});
