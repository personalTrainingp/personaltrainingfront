import { PTApi } from '@/common';
import { useState } from 'react';

export const useImageStore = () => {
	const [images, setImages] = useState();
	// clasificacion_image: '',
	// createdAt: '',
	// extension_image: '',
	// flag: true,
	// id: 0,
	// name_image: '',
	// size_image: 0,
	// uid: '',
	// uid_location: '',
	// updatedAt: '',
	const obtenerImages = async (UID) => {
		try {
			const { data: dataImg } = await PTApi.get(`/upload/get-upload/${UID}`);
			console.log(dataImg);
			setImages(dataImg);
			// setprogramaPT(data)
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerImages,
		images,
	};
};
