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
import { assetAttributeApi } from "../features/asset/asset_attributes/assetattributeApi";
import { alarmSetupApi } from "../features/asset/alarm_setup/alarmsetupApi";
import { alarmCreationApi } from "../features/asset/alarm_creation/alarmcreationApi";
import { taskmasterApi } from "../features/task_master/taskmasterApi";
import { typemasterApi } from "../features/type_master/typemasterApi";
import { statusmasterApi } from "../features/status_master/statusmasterApi";
import { schedulecreationApi } from "../features/schedulecreation/schedulecreationApi";
import { taskAssignmentApi } from "../features/task_assign/taskAssignmentApi";
import { taskListApi } from "../features/task_list/taskListApi";
import { taskCompletionApi } from "../features/task_closer/taskCompletionApi";


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
    [assetInventoryApi.reducerPath]:assetInventoryApi.reducer,
    [assetAttributeApi.reducerPath]:assetAttributeApi.reducer,
    [alarmSetupApi.reducerPath]:alarmSetupApi.reducer,
    [alarmCreationApi.reducerPath]:alarmCreationApi.reducer,
    [taskmasterApi.reducerPath]:taskmasterApi.reducer,
    [typemasterApi.reducerPath]:typemasterApi.reducer,
    [statusmasterApi.reducerPath]:statusmasterApi.reducer,
    [schedulecreationApi.reducerPath]:schedulecreationApi.reducer,
    [taskAssignmentApi.reducerPath]:taskAssignmentApi.reducer,
    [taskListApi.reducerPath]:taskListApi.reducer,
    [taskCompletionApi.reducerPath]:taskCompletionApi.reducer

   

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
      .concat(assetAttributeApi.middleware)
      .concat(alarmSetupApi.middleware)
      .concat(alarmCreationApi.middleware)
      .concat(taskmasterApi.middleware)
      .concat(typemasterApi.middleware)
      .concat(statusmasterApi.middleware)
      .concat(schedulecreationApi.middleware)
      .concat(taskAssignmentApi.middleware)
      .concat(taskListApi.middleware)
      .concat(taskCompletionApi.middleware)
      ,


      
});

export default store;

