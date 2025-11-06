import axios from 'axios';

let API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Normalize API_URL: ensure it ends with '/api' so client calls to '/auth' become '/api/auth'
try {
  if (!API_URL.endsWith('/api')) {
    API_URL = API_URL.replace(/\/+$|\s+$/g, ''); // trim trailing slashes/spaces
    API_URL = API_URL + '/api';
  }
} catch (e) {
  // fallback to default if anything goes wrong
  API_URL = 'http://localhost:5000/api';
}

// Log API base so we can tell what the built frontend is using (useful when deployed to Render)
console.log('api.js: API base =', API_URL);

const instance = axios.create({ baseURL: API_URL });

instance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
}, e=>Promise.reject(e));

export default instance;
