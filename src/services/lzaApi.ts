import axios from '../axios-config';

export default {
    search(params: Record<string, any> = {}, facets: string) {
        return axios.get(`/search${facets ? `?${facets}` : ''}`, {
            params,
        });
    },

    getSearchDetailsById(id: string) {
        return axios.get('/search', {
            params: {
                id,
            },
        });
    },

    getArchiveInfo(id: string, limit: number, offset: number, withFile: boolean) {
        return axios.get(`/search-archive`, {
            params: {
                id,
                withFile,
                limit,
                offset,
            },
        });
    },

    getVersionInfo(pid: string) {
        return axios.get(`/search-archive-info?id=${pid}`);
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

    exportFullArchive(pid: string) {
        const url = `${this.getBaseUrl()}export-full?id=${pid}&isInternal=false`;
        return fetch(url, {
            method: 'GET',
        });
    },

    exportRequest(pid: string) {
        return axios.get(`/export-request`, {
            params: {
                id: pid,
            },
        });
    },

    getBaseUrl() {
        let baseURL = axios.defaults.baseURL ? axios.defaults.baseURL : '/api/';
        baseURL += baseURL.endsWith('/') ? '' : '/';
        return baseURL;
    },

    getLatestPidForOcrdidentifier(ocrdidentifier: string) {
        return axios.get(`/search-ocrdid`, {
            params: {
                id: ocrdidentifier,
            },
        });
    },

    runOperandiWorkflow(pid: string) {
        return axios.post(`/operandi/run-workflow`, {}, {
            params: {
                id: pid,
            },
        });
    },

    areOperandiJobsRunning(pid: string) {
        return axios.get(`/operandi/unfinished-jobs`, {
            params: {
                id: pid,
            },
        });
    },
};
