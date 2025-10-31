import { configureStore } from "@reduxjs/toolkit";
import { divisionApi } from "../features/location/division/divisionApi";
import { stationApi } from "../features/location/station/stationApi"; 
import { entityApi } from "../features/location/entity/entityApi";
import { userTypeApi } from "../features/user/user_type/userTypeApi";
import { userRoleApi } from "../features/user/user_role/userRoleApi";
import { userApi } from "../features/user/users/userApi";
import { zoneApi } from "../features/location/zone/zoneApi";
import { userLevelApi } from "../features/user/user_level/userLevelApi";
import { rackApi } from "../features/location/rack/rackApi";
import { unitOfMeasurementApi } from "../features/unit_of_measurement/unitofmesurementApi";
import {severityApi } from '../features/severity_master/SeveritymasterApi'
import { assetMasterApi } from "../features/asset/asset_master/assetmasterApi";
import { assetInventoryApi } from "../features/asset/asset_invetory/assetinventryApi";


const store = configureStore({
  reducer: {
    [divisionApi.reducerPath]: divisionApi.reducer,
    [stationApi.reducerPath]: stationApi.reducer,
    [entityApi.reducerPath]: entityApi.reducer,
    [userTypeApi.reducerPath]: userTypeApi.reducer,
    [userRoleApi.reducerPath]:userRoleApi.reducer,
    [userApi.reducerPath]:userApi.reducer,
    [zoneApi.reducerPath]:zoneApi.reducer,
    [userLevelApi.reducerPath]:userLevelApi.reducer,
    [rackApi.reducerPath]: rackApi.reducer,
    [unitOfMeasurementApi.reducerPath]:unitOfMeasurementApi.reducer,
    [severityApi.reducerPath]:severityApi.reducer,
    [assetMasterApi.reducerPath]:assetMasterApi.reducer,
    [assetInventoryApi.reducerPath]:assetInventoryApi.reducer
   

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(divisionApi.middleware)
      .concat(stationApi.middleware)
      .concat(entityApi.middleware)
      .concat(userTypeApi.middleware)
      .concat(userRoleApi.middleware)
      .concat(userApi.middleware)
      .concat(zoneApi.middleware)
      .concat(userLevelApi.middleware)
      .concat(rackApi.middleware)
      .concat(unitOfMeasurementApi.middleware)
      .concat(severityApi .middleware)
      .concat(assetMasterApi.middleware)
      .concat(assetInventoryApi.middleware)
      ,


      
});

export default store;

