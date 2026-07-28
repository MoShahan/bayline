import {
  CarFront,
  CircleDot,
  CircleParking,
  Lock,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
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
import { STATUS_LABELS, STATUS_STYLES } from "@/src/statusStyles";

import type { SpotStatus } from "@/src/types";

const STAT_META: {
  key: "available" | "occupied" | "reserved" | "total";
  label: string;
  hint: string;
  icon: typeof CircleParking;
}[] = [
  {
    key: "available",
    label: STATUS_LABELS.available,
    hint: "Ready to park",
    icon: CircleParking,
  },
  {
    key: "occupied",
    label: STATUS_LABELS.occupied,
    hint: "Vehicles on site",
    icon: CarFront,
  },
  {
    key: "reserved",
    label: STATUS_LABELS.reserved,
    hint: "Held for guests",
    icon: Lock,
  },
  {
    key: "total",
    label: "Total",
    hint: "All managed bays",
    icon: CircleDot,
  },
];

function App() {
  const [editingSpotId, setEditingSpotId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const spots = useAppSelector(selectAllSpots);
  const stats = useAppSelector(selectParkingStats);

  const editingSpot =
    editingSpotId === null
      ? null
      : (spots.find((spot) => spot.id === editingSpotId) ?? null);

  const atCapacity = spots.length >= MAX_SPOTS;
  const occupancyRate =
    stats.total === 0
      ? 0
      : Math.round(((stats.occupied + stats.reserved) / stats.total) * 100);

  const handleAddSpot = () => {
    if (atCapacity) {
      toast.error("Parking deck is full", {
        description: `You can manage up to ${MAX_SPOTS} spots. Remove a temporary bay to add another.`,
      });
      return;
    }

    dispatch(addSpot({ status: "available", vehicle: "", temporary: true }));
    toast.success("Spot added", {
      description: "A temporary available bay was created.",
    });
  };

  const handleEdit = (id: number) => {
    setEditingSpotId(id);
  };

  const handleRemove = (id: number) => {
    const spot = spots.find((item) => item.id === id);

    if (!spot?.temporary) {
      toast.error("Spot can't be removed", {
        description: "Only temporary bays can be deleted from the board.",
      });
      return;
    }

    dispatch(removeSpot(id));
    toast.success(`Spot ${id} removed`, {
      description: "The temporary bay was cleared from the deck.",
    });
  };

  const handleSave = (payload: {
    id: number;
    status: SpotStatus;
    vehicle: string;
  }) => {
    dispatch(updateSpot(payload));
    setEditingSpotId(null);

    const statusLabel = STATUS_LABELS[payload.status];
    toast.success(`Spot ${payload.id} updated`, {
      description:
        payload.status === "available"
          ? "Bay marked available and vehicle cleared."
          : `Now ${statusLabel.toLowerCase()}${payload.vehicle ? ` · ${payload.vehicle}` : ""}.`,
    });
  };

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.94_0.03_200),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_oklch(0.95_0.04_145),_transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,oklch(0.7_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.7_0_0/0.06)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">
              Bayline
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Parking deck control
            </h1>
            <p className="text-base text-muted-foreground text-pretty">
              Monitor bay availability, update vehicle assignments, and keep temporary spots tidy - all from one live board.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <Button
              size="lg"
              onClick={handleAddSpot}
              aria-disabled={atCapacity}
              className="bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              <Plus className="size-4" />
              Add
            </Button>
            <p className="text-xs text-muted-foreground">
              {atCapacity
                ? `Capacity reached (${MAX_SPOTS} spots)`
                : `${spots.length} of ${MAX_SPOTS} spots in use · ${occupancyRate}% held`}
            </p>
          </div>
        </header>

        <section aria-label="Parking statistics" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_META.map(({ key, label, hint, icon: Icon }) => {
            const value = stats[key];
            const statusStyle =
              key === "total" ? null : STATUS_STYLES[key as SpotStatus];

            return (
              <div
                key={key}
                className={cn(
                  "rounded-2xl border p-4 shadow-xs",
                  statusStyle?.metric ??
                    "border-border/80 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-card",
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {label}
                  </span>
                  <Icon
                    className={cn(
                      "size-4",
                      statusStyle?.icon ?? "text-slate-500",
                    )}
                  />
                </div>
                <p
                  className={cn(
                    "text-3xl font-semibold tracking-tight",
                    statusStyle?.metricValue ?? "text-foreground",
                  )}
                >
                  {value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
                <span className="sr-only">
                  {label}: {value}
                </span>
              </div>
            );
          })}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Live bay map
              </h2>
              <p className="text-sm text-muted-foreground">
                Color-coded by status. Reserved bays stay locked; temporary bays
                can be removed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {(["available", "occupied", "reserved"] as const).map(
                (status) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        status === "available" && "bg-emerald-500",
                        status === "occupied" && "bg-amber-500",
                        status === "reserved" && "bg-sky-500",
                      )}
                    />
                    {STATUS_LABELS[status]}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {spots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onEdit={handleEdit}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </section>
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
