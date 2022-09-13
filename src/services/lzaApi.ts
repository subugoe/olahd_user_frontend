import axios from 'axios';

const instance = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    search(query: string, from: number=0, size: number=10) {
        return instance.get('/search-es/query-all', {
            params: {
                q: query,
                from,
                size
            }
        });
    },

    getMetaLogById(id: string, collection: string) {
        return instance.get(`/search-es/meta.${collection}/${id}`);
    },

    getArchiveInfo(id: string, limit: number, offset: number) {
        return instance.get(`/search-archive/${id}`, {
            params: {
                withFile: true,
                limit,
                offset
            }
        });
    },

    getVersionInfo(id: string) {
        return instance.get(`/search-archive-info/${id}`);
    },

    downloadFiles(archiveId: string, files: []) {
        let url = 'http://141.5.99.53/api/download';
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

    exportArchive(archiveId: string) {
        let url = `http://141.5.99.53/api/export?id=${archiveId}&isInternal=true`;
        return fetch(url, {
            method: 'GET'
        });
    }
};
