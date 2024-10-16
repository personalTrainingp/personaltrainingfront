const config = {
	API_URL: process.env.REACT_APP_API_URL,
	API_IMG: {
		LOGO: 'https://archivosluroga.blob.core.windows.net/membresiaavatar/',
		FILE_DIETA: 'https://archivosluroga.blob.core.windows.net/nutricion-dietas/',
		FILE_HISTORIAL_CLINICO:
			'https://archivosluroga.blob.core.windows.net/nutricion-historialclinico/',
		FILE_CLI_DOC_ADJ: 'https://archivosluroga.blob.core.windows.net/files-adjuntos-clientes/',
		// LOGO: 'http://localhost:4000/api/file/logo/',
		AVATARES: 'http://localhost:4000/api/file/avatares/',
	},
};

export default config;
