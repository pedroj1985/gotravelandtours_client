import HTTP from "../api/client";

export { HTTP };
export {
  authCheck,
  getUser,
  authGetUser,
  authLogin,
  authRegister,
  authLog,
  closeSession,
  updateHeader,
  getVoucher,
  authSearchCountries
} from "../api/auth";
export {
  authSearchLodging,
  authGetLodging,
  authGetLodgings,
  authGetLodgingsAll,
  authGetRoomPrice,
  authSearchRoomsByLodging,
  authGetRoomTypes,
  authGetLodgingEatingPlan,
  authGetLodgingEatingPlanOne,
  authGetHotelList,
  authSearchRegions,
  authSearchPuntosInteres,
  getPackages
} from "../api/lodging";
export {
  authSearchCars,
  authUpdateCar,
  authGetCar,
  authDeleteCarOrder,
  authSearchMarcas,
  authSearchMarca,
  authSearchProvider
} from "../api/rent";
export {
  authReserve,
  authUpdateStatus,
  authPutReserve,
  authGetOrders,
  authGetOrdersCount,
  authGetOrder,
  voucher
} from "../api/orders";
export {
  getTropiPayToken,
  generatePaymentPage,
  updateIsPagadoAlojamiento,
  updateIsPagadoVehiculo
} from "../api/payment";
export {
  hotetecOpenSession,
  hotetecStateSession,
  hotetecBlockProduct,
  hotetecCloseReserve,
  hotetecCancelReserve,
  hotetecUpdateDataOnGtt
} from "../api/hotetec";
export { authGetImage, authGetImages } from "../api/images";
export {
  authCreateQbEstimated,
  authUpdateQbEstimated,
  authUpdOnlyInDbQbEstimated
} from "../api/qb";
export { subscribe, authGetAirlines } from "../api/general";
