import axios from 'axios';

const instance = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    search(params: Record<string, any> = {}, facets: string) {
        return instance.get(`/search${facets ? `?${facets}` : ''}`, {
            params,
        });
    },

    getSearchDetailsById(id: string) {
        return instance.get('/search', {
            params: {
                id,
            },
        });
    },

    getArchiveInfo(id: string, limit: number, offset: number) {
        return instance.get(`/search-archive`, {
            params: {
                id,
                withFile: true,
                limit,
                offset,
            },
        });
    },

    getVersionInfo(pid: string) {
        return instance.get(`/search-archive-info?id=${pid}`);
    },

    downloadFiles(archiveId: string, files: []) {
        const url = `${this.getBaseUrl()}download`;
        const data = {
            archiveId,
            files,
        };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    },

    exportArchive(pid: string) {
        const url = `${this.getBaseUrl()}export?id=${pid}&isInternal=false`;
        return fetch(url, {
            method: 'GET',
        });
    },

    getBaseUrl() {
        let baseURL = instance.defaults.baseURL ? instance.defaults.baseURL : '/api/';
        baseURL += baseURL.endsWith('/') ? '' : '/';
        return baseURL;
    },
};
