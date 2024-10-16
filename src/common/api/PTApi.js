import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { API_URL } = getEnvVariables();

const PTApi = axios.create({
	baseURL: API_URL,
});
console.log('api para usarse', API_URL);
// Todo: configurar interceptores
PTApi.interceptors.request.use((config) => {
	config.headers = {
		...config.headers,
		'x-token': localStorage.getItem('token'),
	};
	return config;
});

export default PTApi;
