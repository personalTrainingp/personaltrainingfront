const getEnvVariables = () => {
	// import.meta.env;

	// return {
	// 	...import.meta.env,
	// };
	const API_URL = import.meta.env.VITE_API_URL;
	console.log('', API_URL);
	return {
		API_URL,
	};
};
export default getEnvVariables;
