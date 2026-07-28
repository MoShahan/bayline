import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SpotCard from "@/src/SpotCard";

import type { SpotType } from "@/src/types";

const baseSpot: SpotType = {
  id: 1,
  status: "available",
  vehicle: "",
};

describe("SpotCard", () => {
  it("renders spot details for an available spot", () => {
    render(
      <SpotCard spot={baseSpot} onEdit={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(screen.getByText("Spot 1")).toBeInTheDocument();
    expect(screen.getByText("available")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders the vehicle name for occupied spots", () => {
    render(
      <SpotCard
        spot={{ ...baseSpot, status: "occupied", vehicle: "Creta" }}
        onEdit={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Creta")).toBeInTheDocument();
  });

  it("allows editing available and occupied spots", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    const { rerender } = render(
      <SpotCard spot={baseSpot} onEdit={onEdit} onRemove={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(1);

    rerender(
      <SpotCard
        spot={{ ...baseSpot, status: "reserved", vehicle: "Civic" }}
        onEdit={onEdit}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled();
  });

  it("only allows removing temporary spots", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    const { rerender } = render(
      <SpotCard spot={baseSpot} onEdit={vi.fn()} onRemove={onRemove} />,
    );

    expect(screen.getByRole("button", { name: "Remove" })).toBeDisabled();

    rerender(
      <SpotCard
        spot={{ ...baseSpot, temporary: true }}
        onEdit={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
