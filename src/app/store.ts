import { configureStore } from "@reduxjs/toolkit";

import parkingReducer from "../features/parking/parkingSlice";

export const store = configureStore({
  reducer: {
    parking: parkingReducer,
  },
});

// Export RootState and AppDispatch types for full TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
