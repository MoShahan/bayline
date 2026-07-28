import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SpotCard from "@/src/SpotCard";

import type { SpotType } from "@/src/types";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const baseSpot: SpotType = {
  id: 1,
  status: "available",
  vehicle: "",
};

describe("SpotCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders spot details for an available spot", () => {
    render(
      <SpotCard spot={baseSpot} onEdit={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(screen.getByText("Spot 1")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
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

  it("allows editing available spots and explains reserved locks", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    const { rerender } = render(
      <SpotCard spot={baseSpot} onEdit={onEdit} onRemove={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(1);

    onEdit.mockClear();

    rerender(
      <SpotCard
        spot={{ ...baseSpot, status: "reserved", vehicle: "Civic" }}
        onEdit={onEdit}
        onRemove={vi.fn()}
      />,
    );

    const editButton = screen.getByRole("button", { name: "Edit" });
    expect(editButton).toBeEnabled();
    expect(editButton).toHaveAttribute("aria-disabled", "true");

    await user.click(editButton);

    expect(onEdit).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Can't edit this bay",
      expect.objectContaining({
        description: expect.stringContaining("Reserved"),
      }),
    );
  });

  it("explains why non-temporary spots can't be removed", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    const { rerender } = render(
      <SpotCard spot={baseSpot} onEdit={vi.fn()} onRemove={onRemove} />,
    );

    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toBeEnabled();
    expect(removeButton).toHaveAttribute("aria-disabled", "true");

    await user.click(removeButton);

    expect(onRemove).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Spot can't be removed",
      expect.objectContaining({
        description: expect.stringContaining("temporary"),
      }),
    );

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
