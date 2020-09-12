import Index from './components/index-page/Index.vue';
import IndexLogged from './components/index-logged-page/IndexLogged.vue';
import ResultLodging from './components/result-lodging/ResultLodging.vue';

export const routes = [
    { path: '', component: Index, name: 'index'},
    { path: '/logged', component: IndexLogged, name: 'indexLogged'},
    { path: '/lodging', component: ResultLodging, name: 'resultLodging'}
]