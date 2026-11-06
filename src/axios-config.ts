import axios from 'axios';

export function normalizeApiBaseUrl(baseUrl = '/api/') {
    if (!baseUrl || typeof window === 'undefined') {
        return baseUrl || '/api/';
    }

    if (baseUrl.startsWith('//')) {
        return `${window.location.protocol}${baseUrl}`;
    }

    if (baseUrl.startsWith('http://') && window.location.protocol === 'https:') {
        return baseUrl.replace('http://', 'https://');
    }

    return baseUrl;
}

const instance = axios.create({
    baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL || '/api/'),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
