import Index from './components/index-page/Index.vue';
import IndexLogged from './components/index-logged-page/IndexLogged.vue';

export const routes = [
    { path: '', component: Index, name: 'index'},
    { path: '/logged', component: IndexLogged, name: 'indexLogged'}
]