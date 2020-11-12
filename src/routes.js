import Index from './components/index-page/Index.vue';
import IndexLogged from './components/index-logged-page/IndexLogged.vue';
import ResultLodging from './components/result-lodging/ResultLodging.vue';
import ResultRent from './components/result-rent/ResultRent';
import CartView from './components/reservation/CartView'
import MyAdminPanel from './components/shared/MyAdminPanel'
import MyReservations from './components/admin-panel/MyReservations'
import MyDashboard from './components/admin-panel/MyReservations'
import RentRouteHolder from './components/result-rent/RentRouteHolder'
import RentDetail from './components/result-rent/RentDetail'
import ReservationDetail from './components/reservation/ReservationDetail'

export const routes = [
    { path: '', component: Index, name: 'index', meta:{guest: true}},
    { path: '/logged', component: IndexLogged, name: 'indexLogged', meta:{requiresAuth: true}},
    { path: '/lodging', component: ResultLodging, name: 'resultLodging', meta:{requiresAuth: true}, props: true},
    { path: '/cars', 
                name: 'resultRent', 
                component: ResultRent, 
                meta:{requiresAuth: true}, 
                props: true,
            },
    { path: '/rent-detail/:id', 
                name: 'rent-detail', 
                component: RentDetail, 
                meta:{requiresAuth: true}, 
                props: true,
            },
    { path: '/rh', component: RentRouteHolder, name: 'rentResultHolder', meta:{requiresAuth: true}, props: true},
    { path: '/to-reserve', component: CartView, name: 'reservation', meta:{requiresAuth: true}, props: true},
    { path: '/reservation/detail/:id',
                 component: ReservationDetail,
                 name: 'reservation-detail', 
                 meta:{requiresAuth: true}, 
                 props: true},
    { path: '/admin-panel',
                         component: MyAdminPanel, meta:{requiresAuth: true}, props: true,
                         children: [
                            {
                                path: 'my-reservations',
                                component: MyReservations,
                                name: 'myreservations'
                            },
                            {
                                path: '',
                                component: MyDashboard,
                                name: 'mydashboard'
                            }
                         ]
                        }
]