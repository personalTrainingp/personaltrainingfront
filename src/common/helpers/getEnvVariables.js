const getEnvVariables = () => {
	// import.meta.env;

	// return {
	// 	...import.meta.env,
	// };
	const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  return {
    API_URL,
    API_KEY,
  };
};
export default getEnvVariables;
