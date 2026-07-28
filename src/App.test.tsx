import { configureStore } from "@reduxjs/toolkit";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/src/App";
import { MAX_SPOTS } from "@/src/constants";
import parkingReducer from "@/src/features/parking/parkingSlice";

import type { SpotType } from "@/src/types";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const sampleSpots: SpotType[] = [
  { id: 1, status: "available", vehicle: "" },
  { id: 2, status: "reserved", vehicle: "Verna" },
  { id: 5, status: "occupied", vehicle: "Creta" },
];

const renderApp = (spots: SpotType[] = sampleSpots) => {
  const store = configureStore({
    reducer: { parking: parkingReducer },
    preloadedState: { parking: { spots } },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <App />
      </Provider>,
    ),
  };
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows parking stats for the current spots", () => {
    renderApp();

    expect(screen.getByText("Available: 1")).toBeInTheDocument();
    expect(screen.getByText("Occupied: 1")).toBeInTheDocument();
    expect(screen.getByText("Reserved: 1")).toBeInTheDocument();
    expect(screen.getByText("Total: 3")).toBeInTheDocument();
  });

  it("adds a temporary available spot", async () => {
    const user = userEvent.setup();
    const { store } = renderApp();

    await user.click(screen.getByRole("button", { name: "Add" }));

    const spots = store.getState().parking.spots;
    expect(spots).toHaveLength(4);
    expect(spots[3]).toMatchObject({
      id: 6,
      status: "available",
      temporary: true,
    });
    expect(screen.getByText("Spot 6")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith(
      "Spot added",
      expect.objectContaining({
        description: "A temporary available bay was created.",
      }),
    );
  });

  it("shows an error toast when adding past the spot limit", async () => {
    const user = userEvent.setup();
    const fullSpots = Array.from({ length: MAX_SPOTS }, (_, index) => ({
      id: index + 1,
      status: "available" as const,
      vehicle: "",
    }));

    const { store } = renderApp(fullSpots);

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(store.getState().parking.spots).toHaveLength(MAX_SPOTS);
    expect(toast.error).toHaveBeenCalledWith(
      "Parking deck is full",
      expect.objectContaining({
        description: expect.stringContaining(String(MAX_SPOTS)),
      }),
    );
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("removes a temporary spot", async () => {
    const user = userEvent.setup();
    const { store } = renderApp([
      ...sampleSpots,
      { id: 8, status: "available", vehicle: "", temporary: true },
    ]);

    const card = screen.getByText("Spot 8").closest('[data-slot="card"]');
    expect(card).toBeTruthy();

    await user.click(
      within(card as HTMLElement).getByRole("button", { name: "Remove" }),
    );

    expect(store.getState().parking.spots.map((spot) => spot.id)).not.toContain(
      8,
    );
    expect(screen.queryByText("Spot 8")).not.toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith(
      "Spot 8 removed",
      expect.objectContaining({
        description: "The temporary bay was cleared from the deck.",
      }),
    );
  });

  it("opens the edit modal and saves changes", async () => {
    const user = userEvent.setup();
    const { store } = renderApp();

    const availableCard = screen
      .getByText("Spot 1")
      .closest('[data-slot="card"]');

    await user.click(
      within(availableCard as HTMLElement).getByRole("button", {
        name: "Edit",
      }),
    );

    expect(screen.getByText("Edit spot 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(store.getState().parking.spots[0]).toMatchObject({
      id: 1,
      status: "available",
      vehicle: "",
    });
    expect(toast.success).toHaveBeenCalledWith(
      "Spot 1 updated",
      expect.objectContaining({
        description: "Bay marked available and vehicle cleared.",
      }),
    );
  });
});
