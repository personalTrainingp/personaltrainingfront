export async function urlToBlob(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error('No se pudo obtener la imagen');

		const blob = await response.blob();
		return blob;
	} catch (error) {
		console.error('Error al convertir la URL en Blob:', error);
		return null;
	}
}

export async function urlToFile(url, filename = 'imagen.jpg') {
	const blob = await urlToBlob(url);
	if (!blob) return null;
  
	return new File([blob], filename, { type: blob.type });
  }