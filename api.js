import axios from 'axios'; //Axios = function + prototype methods (get, post, interceptors, etc.)

const API_URL = 'http://localhost:8080/api/v1';

const api = axios.create({ //One central axios object
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json', // it means : “Hey Spring Boot, I am sending JSON data”
    },
});

// THIS CREATED A NEW OBJECT , AND CONTAIN 1. DEFAULT 2. INTERCEPTOR, 3. CONFIG 





























// Add auth token to requests : interceptor is code that runs automatically BEFORE every HTTP request.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // FROM BROWSER 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);    

{/*Automatically attach JWT to every request
    
    1. IT READ THE TOKEN FROM BROWSER 
    2. ADD HEADER TO EVERY API AND THIS IS HAPPEND BEFORE EVERY API REQUEST 
    3. headers: { Authorization: ... } // WE HAVE TO NEVER WRITE LIKE I DO IN POST MAN 
  -----------------------------------------------------------------------------------------
    
    
    INITIALLY : 
    1 .headers = {
  "Content-Type": "application/json"
}

THEN WHEN CREATED WHEN STORE TOKEN --> headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1..."
} // HERE IT STORE MORE DATA AND TOKEN IN IT 
  
    
    
    
    */}













// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;


{/* 
    It automatically attaches the JWT token to every API request, 
    handles login state across refreshes, and force-logs the user out if the token becomes invalid.

    if i not write this code , we have to make it manually send each api with this HEADER
    
    
    -----------------------------------------------------------------------------
    App loads
↓
api.js executes once
↓
Axios instance created
↓
Interceptors registered
↓
No API call yet
↓
Component calls api.get()
↓
Request interceptor modifies config
↓
Request sent
↓
Backend responds
↓
Response interceptor checks status

    
    
    
    
    
    
    
    
    */}