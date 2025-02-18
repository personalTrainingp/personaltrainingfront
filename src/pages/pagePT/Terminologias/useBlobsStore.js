import { PTApi } from '@/common/api/';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useBlobsStore = () => {
	let dispatch = useDispatch();
	const [terminologiaPorId, setTerminologiaPorId] = useState({});
	const [dataTerminologiaPorEntidad, SetData] = useState({});
	const [dataT, setdataT] = useState([]);
	const registrarBlobs = async (arrayFiles, uidArt) => {
		try {
			arrayFiles.map(async (obj) => {
				const formData = new FormData();
				formData.append('file', obj);
				await PTApi.post(
					`/storage/blob/create/${uidArt}?container=articulos-lugares`,
					formData
				);
			});
		} catch (error) {
			console.log(error.message);
		}
	};
	return {
		registrarBlobs,
	};
};
