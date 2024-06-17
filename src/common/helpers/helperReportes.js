
const helperReportes = () => {
	const obtenerMayorExtensionFin = (data) => {
		const extensiones = data.tb_extension_membresia;
		const mayorExtensionFin = extensiones.reduce((maxFecha, ext) => {
			return (maxFecha =
				maxFecha === null || new Date(ext.extension_fin) > new Date(maxFecha.extension_fin)
					? ext
					: maxFecha);
		}, null);
		return mayorExtensionFin.extension_fin;
	};
	return {
		obtenerMayorExtensionFin,
	};
};
