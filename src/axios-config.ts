import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://141.5.99.53/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance
