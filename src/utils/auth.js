import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'accept': 'application/json'
}
export const HTTP = axios.create({
    baseURL: "http://gotravelandtours.com/publicEliecer/api"
})

export function authLogin(user){
    return HTTP.post('/Login',user,headers)
}

export function authRegister(user){
    return HTTP.post('/Usuarios',user,headers)
}