import Index from "./components/index-page/Index.vue";
import IndexLogged from "./components/index-logged-page/IndexLogged.vue";

const ResultLodging = () =>
  import("./components/result-lodging/ResultLodging.vue");
const ResultRent = () => import("./components/result-rent/ResultRent");
const CartView = () => import("./components/reservation/CartView");
const MyAdminPanel = () => import("./components/shared/MyAdminPanel");
const MyReservations = () => import("./components/admin-panel/MyReservations");
const MyDashboard = () => import("./components/admin-panel/MyDashboard.vue");
const RentRouteHolder = () =>
  import("./components/result-rent/RentRouteHolder");
const LodgingRouteHolder = () =>
  import("./components/result-lodging/LodgingRouteHolder");
const RentDetail = () => import("./components/result-rent/RentDetail");
const ReservationDetail = () =>
  import("./components/reservation/ReservationDetail");
const RentEditList = () => import("./components/reservation/RentEditList");
const LodgingDetail = () => import("./components/result-lodging/LodgingDetail");
const CookiesPolicy = () =>
  import("@/components/cookies-policy/CookiesPolicy.vue");
const LegalInformation = () =>
  import("@/components/legal-information/LegalInformation.vue");
const BookingConditions = () =>
  import("@/components/booking-conditions/BookingConditions.vue");
const PrivacyPolicy = () =>
  import("@/components/privacy-policy/PrivacyPolicy.vue");

export const routes = [
  { path: "", component: Index, name: "index", meta: { guest: true } },
  {
    path: "/logged",
    component: IndexLogged,
    name: "indexLogged",
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: "/lodgings",
    component: ResultLodging,
    name: "resultLodging",
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: "/cars",
    name: "resultRent",
    component: ResultRent,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: "/rent-detail/:id",
    name: "rent-detail",
    component: RentDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: "/lodgings/:id",
    name: "lodging-detail",
    component: LodgingDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: "/rh",
    component: RentRouteHolder,
    name: "rentResultHolder",
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: "/lh",
    component: LodgingRouteHolder,
    name: "lodgingResultHolder",
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: "/to-reserve",
    meta: { requiresAuth: true },
    props: true,
    name: "reservation",
    component: CartView
  },
  {
    path: "/rent-edit",
    meta: { requiresAuth: true },
    props: true,
    name: "rent-edit",
    component: RentEditList
  },
  {
    path: "/cookies-policy",
    props: true,
    name: "cookies-policy",
    component: CookiesPolicy
  },
  {
    path: "/legal-information",
    props: true,
    name: "legal-information",
    component: LegalInformation
  },
  {
    path: "/booking-conditions",
    props: true,
    name: "booking-conditions",
    component: BookingConditions
  },
  {
    path: "/privacy-policy",
    props: true,
    name: "privacy-policy",
    component: PrivacyPolicy
  },
  {
    path: "/admin-panel",
    component: MyAdminPanel,
    meta: { requiresAuth: true },
    props: true,
    children: [
      {
        path: "my-reservations",
        component: MyReservations,
        name: "myreservations"
      },
      {
        path: "",
        component: MyDashboard,
        name: "mydashboard"
      },
      {
        path: "reservation/detail/:id",
        component: ReservationDetail,
        name: "reservation-detail",
        props: true
      }
    ]
  }
];
