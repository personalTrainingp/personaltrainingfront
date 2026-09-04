const getEnvVariables = () => {
	// import.meta.env;

	// return {
	// 	...import.meta.env,
	// };
	const API_URL = import.meta.env.VITE_API_URL;
	const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL || 'https://asistente-change.azurewebsites.net';
	console.log('', API_URL);
	return {
		API_URL,
		ANALYTICS_URL,
	};
};
export default getEnvVariables;
