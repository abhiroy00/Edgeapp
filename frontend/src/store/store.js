import { configureStore } from "@reduxjs/toolkit";
import { divisionApi } from "../features/location/division/divisionApi";

const store = configureStore({
  reducer: {
    [divisionApi.reducerPath]: divisionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(divisionApi.middleware),
});

export default store;
