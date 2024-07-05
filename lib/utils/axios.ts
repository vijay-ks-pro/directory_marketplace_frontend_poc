import { API_BASE_URL } from '../app/app_constants';
import axios from 'axios'
import { getCookie } from './utill_methods';

const baseURL = API_BASE_URL;
const isServer = typeof window === 'undefined';

const axiosClient = axios.create({ baseURL })

axiosClient.interceptors.request.use(async config => {
    const isOwnerAPI = config.url?.startsWith('/owner') ?? false;
    let tokenKey = isOwnerAPI ? 'owner_auth_token' : 'auth_token';
    const alreadyHasToken = (config.headers['authorization'] != null && config.headers['authorization'] != '') || config.headers['Authorization'] != null && config.headers['Authorization'] != '';
    let token = null as string | null;

    if (isServer) {
        const { cookies } = (await import('next/headers'))
        token = cookies().get(tokenKey)?.value ?? null;
    } else {
        token = getCookie(document.cookie, tokenKey);
    }

    if (token && alreadyHasToken == false) {
        config.headers['authorization'] = token
    }

    return config
})

export default axiosClient;
