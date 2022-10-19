import axios from 'axios';

const instance = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    search(query: string, offset: number = 0, limit: number = 10, facets:string) {
        return instance.get(`/search${facets?`?${facets}`:''}`, {
            params: {
                searchterm: query,
                limit,
                offset,
            }
        });
    },

    getSearchDetailsById(id: string) {
        return instance.get('/search', {
            params: {
                id: id
            }
        });
    },

    getArchiveInfo(id: string, limit: number, offset: number) {
        return instance.get(`/search-archive`, {
            params: {
                id,
                withFile: true,
                limit,
                offset
            }
        });
    },

    getVersionInfo(pid: string) {
        return instance.get(`/search-archive-info?id=${pid}`);
    },

    downloadFiles(archiveId: string, files: []) {
        let url = `${this.getBaseUrl()}download`;
        let data = {
            archiveId,
            files
        };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    },

    exportArchive(pid: string) {
        let url = `${this.getBaseUrl()}export?id=${pid}&isInternal=false`
        return fetch(url, {
            method: 'GET'
        });
    },

    getBaseUrl() {
        let baseURL = instance.defaults.baseURL ? instance.defaults.baseURL : '/api/';
        baseURL += baseURL.endsWith("/") ? "" : "/";
        return baseURL;
    }
};
