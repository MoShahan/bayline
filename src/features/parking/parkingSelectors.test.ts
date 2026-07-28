import { describe, expect, it } from "vitest";

import {
  selectAllSpots,
  selectParkingStats,
} from "@/src/features/parking/parkingSelectors";

import type { RootState } from "@/src/app/store";
import type { SpotType } from "@/src/types";

const spots: SpotType[] = [
  { id: 1, status: "available", vehicle: "" },
  { id: 2, status: "occupied", vehicle: "Creta" },
  { id: 3, status: "reserved", vehicle: "Civic" },
  { id: 4, status: "available", vehicle: "" },
  { id: 5, status: "occupied", vehicle: "Swift" },
];

const state = {
  parking: { spots },
} as RootState;

describe("parkingSelectors", () => {
  it("selects all spots", () => {
    expect(selectAllSpots(state)).toEqual(spots);
  });

  it("aggregates parking stats by status", () => {
    expect(selectParkingStats(state)).toEqual({
      available: 2,
      occupied: 2,
      reserved: 1,
      total: 5,
    });
  });

  it("returns zeroed stats for an empty list", () => {
    const emptyState = {
      parking: { spots: [] },
    } as RootState;

    expect(selectParkingStats(emptyState)).toEqual({
      available: 0,
      occupied: 0,
      reserved: 0,
      total: 0,
    });
  });
});
