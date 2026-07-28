import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { STATUSES } from "./constants";

import type { EditModalProps } from "./types";

const EditModal = ({
  selectedStatus,
  setSelectedStatus,
  handleSave,
  vehicleName,
  setVehicleName,
}: EditModalProps) => {
  return (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

      <DialogContent className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none dark:bg-slate-900 dark:text-white">
        <DialogTitle className="text-lg font-semibold">Edit</DialogTitle>

        <DialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Make changes here. Click save when you're done.
        </DialogDescription>

        <div className="mt-4">
          <Select
            items={STATUSES}
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {selectedStatus !== "available" && (
          <div className="mt-4">
            <Input
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <DialogClose className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300 dark:bg-slate-800 dark:text-gray-200">
            Cancel
          </DialogClose>
          <DialogClose
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Changes
          </DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  );
};

export default EditModal;
