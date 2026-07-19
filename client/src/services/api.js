import axios from "axios";

const API = axios.create({
    baseURL : import.meta.VITE_API_URL || "http://localhost:3000"
})

export default API

