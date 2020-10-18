import Index from './components/index-page/Index.vue';
import IndexLogged from './components/index-logged-page/IndexLogged.vue';
import ResultLodging from './components/result-lodging/ResultLodging.vue';
import ResultRent from './components/result-rent/ResultRent';

export const routes = [
    { path: '', component: Index, name: 'index', meta:{guest: true}},
    { path: '/logged', component: IndexLogged, name: 'indexLogged', meta:{requiresAuth: true}},
    { path: '/lodging', component: ResultLodging, name: 'resultLodging', meta:{requiresAuth: true}, props: true},
    { path: '/cars', component: ResultRent, name: 'resultRent', meta:{requiresAuth: true}, props: true}
]