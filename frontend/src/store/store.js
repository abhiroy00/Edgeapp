import { configureStore } from "@reduxjs/toolkit";
import { divisionApi } from "../features/location/division/divisionApi";
import { stationApi } from "../features/location/station/stationApi"; 
import { entityApi } from "../features/location/entity/entityApi";

const store = configureStore({
  reducer: {
    [divisionApi.reducerPath]: divisionApi.reducer,
    [stationApi.reducerPath]: stationApi.reducer,
    [entityApi.reducerPath]: entityApi.reducer,  // ✅ fixed here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(divisionApi.middleware)
      .concat(stationApi.middleware)
      .concat(entityApi.middleware),
});

export default store;
