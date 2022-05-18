import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://ola-hd.sub.uni-goettingen.de/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance
