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

export function updateHeader(token){
    headers = {...headers,...{
        'Authorization': `Bearer ${token}`
    }}
}

export function closeSession(vueInstance){
    localStorage.removeItem('token')
    vueInstance.$router.push({name:'index'})
}