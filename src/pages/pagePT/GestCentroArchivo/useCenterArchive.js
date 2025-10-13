import { PTApi } from '@/common';
import React from 'react';

export const useCenterArchive = () => {
	const onPostArchivCenter = async (formState, formFile) => {
		try {
			const { data } = await PTApi.post('/fils/interno/598', formState);
		} catch (error) {
			console.log(error);
		}
	};

	return {
		onPostArchivCenter,
	};
};
