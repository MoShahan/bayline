import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "@/components/ui/dialog";
import EditModal from "@/src/EditModal";

import type { EditModalProps, SpotType } from "@/src/types";

const availableSpot: SpotType = {
  id: 4,
  status: "available",
  vehicle: "",
};

const occupiedSpot: SpotType = {
  id: 5,
  status: "occupied",
  vehicle: "Creta",
};

const reservedSpot: SpotType = {
  id: 2,
  status: "reserved",
  vehicle: "Verna",
};

const renderEditModal = (props: Partial<EditModalProps> & { spot: SpotType | null }) => {
  const onOpenChange = props.onOpenChange ?? vi.fn();
  const onSave = props.onSave ?? vi.fn();
  const open = props.open ?? true;

  return render(
    <Dialog open={open} onOpenChange={onOpenChange}>
      <EditModal
        open={open}
        spot={props.spot}
        onOpenChange={onOpenChange}
        onSave={onSave}
      />
    </Dialog>,
  );
};

describe("EditModal", () => {
  it("renders nothing when closed or without a spot", () => {
    const { container, rerender } = render(
      <Dialog open={false} onOpenChange={vi.fn()}>
        <EditModal
          open={false}
          spot={availableSpot}
          onOpenChange={vi.fn()}
          onSave={vi.fn()}
        />
      </Dialog>,
    );

    expect(container.querySelector('[data-slot="dialog-content"]')).toBeNull();

    rerender(
      <Dialog open={true} onOpenChange={vi.fn()}>
        <EditModal
          open={true}
          spot={null}
          onOpenChange={vi.fn()}
          onSave={vi.fn()}
        />
      </Dialog>,
    );

    expect(container.querySelector('[data-slot="dialog-content"]')).toBeNull();
  });

  it("shows the spot title and hides the vehicle field when available", () => {
    renderEditModal({ spot: availableSpot });

    expect(screen.getByText("Edit spot 4")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Vehicle name"),
    ).not.toBeInTheDocument();
  });

  it("shows the vehicle field for occupied spots", () => {
    renderEditModal({ spot: occupiedSpot });

    expect(screen.getByPlaceholderText("Vehicle name")).toHaveValue("Creta");
  });

  it("treats reserved spots as available in the form", () => {
    renderEditModal({ spot: reservedSpot });

    expect(
      screen.queryByPlaceholderText("Vehicle name"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeEnabled();
  });

  it("disables save for occupied status without a vehicle name", async () => {
    const user = userEvent.setup();

    renderEditModal({ spot: occupiedSpot });

    await user.clear(screen.getByPlaceholderText("Vehicle name"));

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
  });

  it("saves trimmed vehicle data and closes the modal", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onOpenChange = vi.fn();

    renderEditModal({
      spot: occupiedSpot,
      onOpenChange,
      onSave,
    });

    const input = screen.getByPlaceholderText("Vehicle name");
    await user.clear(input);
    await user.type(input, "  Swift  ");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(onSave).toHaveBeenCalledWith({
      id: 5,
      status: "occupied",
      vehicle: "Swift",
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("clears the vehicle when saving as available", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    renderEditModal({ spot: availableSpot, onSave });

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(onSave).toHaveBeenCalledWith({
      id: 4,
      status: "available",
      vehicle: "",
    });
  });

  it("closes when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderEditModal({ spot: availableSpot, onOpenChange });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
