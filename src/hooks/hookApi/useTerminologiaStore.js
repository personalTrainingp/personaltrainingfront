import { PTApi } from '@/common/api/';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTerminologiaStore = () =>{
    let dispatch = useDispatch();

    const [dataTerminologiaPorEntidad , SetData] = useState({});
    const terminologiaPorEntidad = async ()=>{
        try {
            const response = await PTApi.get('/terminologia/terminologiaPorEntidad');

            dispatch(onSetDataView(response.data.response));
 
            //SetData(response.data.response);

        } catch (error) {
            console.log(error.message);
        }

    }; 


    const registrarTerminologia = async (parametro)=>{
        try {
            
            const response = await PTApi.post('/parametros/postRegistrar', parametro);
            terminologiaPorEntidad();
            console.log(response);
        } catch (error) {
            console.log(error.message);
        };
    };

    return {
        terminologiaPorEntidad, dataTerminologiaPorEntidad , registrarTerminologia
    };
};