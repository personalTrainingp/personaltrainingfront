import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { ANALYTICS_URL } = getEnvVariables();

const AnalyticsApi = axios.create({
	baseURL: ANALYTICS_URL,
	timeout: 60000,
});

AnalyticsApi.interceptors.request.use((config) => {
	config.headers = {
		...config.headers,
		'x-token': localStorage.getItem('token'),
	};
	return config;
});

export default AnalyticsApi;
