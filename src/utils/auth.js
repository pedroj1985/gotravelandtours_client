import axios from 'axios'

let headers = {
    'Content-Type': 'application/json',
}
export const HTTP = axios.create({
    baseURL: "http://gotravelandtours.com/publicEliecer/api"
})

export function authLogin(user){
    return HTTP.post('/Login',user,headers)
}

export function authRegister(user, head){
    console.log(headers)
    return HTTP.post('/Usuarios',user,{headers:head})
}

export function authSearchLodging(searchItem){
    let token = localStorage.getItem('token')
    return HTTP.post('/Alojamientoes/BuscarOrden', searchItem, {
        headers: {Authorization: `Bearer ${token}`}
    })
}

export function authSearchRegions(){
    let token = localStorage.getItem('token')
    return HTTP.get('/Regions?col=-1', null, {
        headers: {Authorization: `Bearer ${token}`}
    })
}

export function authSearchPuntosInteres(){
    let token = localStorage.getItem('token')
    return HTTP.get('/PuntoInteres?col=-1', null, {
        headers: {Authorization: `Bearer ${token}`}
    })
}

export function authSearchMarcas(){
    let token = localStorage.getItem('token')
    return HTTP.get('/Marcas?col=-1', null, {
        headers: {Authorization: `Bearer ${token}`}
    })
}
export function authSearchCars(searchItem){
    let token = localStorage.getItem('token')
    return HTTP.post('/Vehiculoes/BuscarOrden', searchItem, {
        headers: {Authorization: `Bearer ${token}`}
    })
}

export function authGetImage(id){
    let token = localStorage.getItem('token')
    return HTTP.post('/AlmacenImagenes/getmain', null, {
        params: {idProducto: id},
        headers: {Authorization: `Bearer ${token}`}
    })
}

export function authSearchCountries(){
    return axios.get('https://restcountries.eu/rest/v2/all?fields=name')
}

export function updateHeader(token){
    headers = {...headers,...{
        'Authorization': `Bearer ${token}`
    }}
}

export function closeSession(vueInstance){
    localStorage.removeItem('token')
    vueInstance.$router.push({name:'index'})
}