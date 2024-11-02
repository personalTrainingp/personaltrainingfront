import { PTApi } from '@/common/api/';
import { useState } from 'react';
export const useTerminologiaStore = () =>{

    const [dataTerminologiaPorEntidad , SetData] = useState({});
    const terminologiaPorEntidad = async ()=>{
        try {
            const response = await PTApi.get('/terminologia/terminologiaPorEntidad');
            
            //console.log(response.data.response);
            SetData(response.data.response);

        } catch (error) {
            console.log(error.message);
        }

    }; 

    return {
        terminologiaPorEntidad, dataTerminologiaPorEntidad
    };
};