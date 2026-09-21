import axios from "axios";

const api = axios.create({
    baseURL: 'https://console.firebase.google.com/u/0/project/app-contatos-9d706/database',
    timeout: 10000,

}) ; 

export  default api;