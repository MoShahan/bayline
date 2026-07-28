import { STATUS_LABELS } from "@/src/statusStyles";

import type { SpotStatus } from "@/src/types";

const EDITABLE_STATUSES = ["available", "occupied"] as const satisfies readonly SpotStatus[];

export const STATUSES = EDITABLE_STATUSES.map((value) => ({
  label: STATUS_LABELS[value],
  value,
}));

export const MAX_SPOTS = 20;
