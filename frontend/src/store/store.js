import { configureStore } from "@reduxjs/toolkit";
import { divisionApi } from "../features/location/division/divisionApi";
import { stationApi } from "../features/location/station/stationApi"; 
import { entityApi } from "../features/location/entity/entityApi";
import { userTypeApi } from "../features/user/user_type/userTypeApi";
import { userRoleApi } from "../features/user/user_role/userRoleApi";

const store = configureStore({
  reducer: {
    [divisionApi.reducerPath]: divisionApi.reducer,
    [stationApi.reducerPath]: stationApi.reducer,
    [entityApi.reducerPath]: entityApi.reducer,
    [userTypeApi.reducerPath]: userTypeApi.reducer,
    [userRoleApi.reducerPath]:userRoleApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(divisionApi.middleware)
      .concat(stationApi.middleware)
      .concat(entityApi.middleware)
      .concat(userTypeApi.middleware)
      .concat(userRoleApi.middleware)
      , // ✅ added this
});

export default store;

