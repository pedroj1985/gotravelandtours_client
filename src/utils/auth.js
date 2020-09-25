import axios from 'axios'

export const HTTP = axios.create({
    baseURL: "http://gotravelandtours.com/publicEliecer/api"
})

export function authLogin(user){
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'accept': 'application/json'
    }
    return HTTP.post('/Login',user,headers)
}