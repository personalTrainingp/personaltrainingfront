import { PTApi } from '@/common/api/';
import { useState } from 'react';

export const useRecursosHumanoReporteStore = () => {

    const [dataPorDepartamento , setData] = useState({}) ;

    const obtenerGastosPorCargo = async (fechaDesdeStr , fechaHastaStr) => {
    
        try {
            //PTApi.get('/recursosHumanos/gastos-por-cargo');
            //setstatus('loading');
            const response  = await PTApi.get('/recursosHumanos/gasto-por-cargo' , {
                
                params: {
                    fechaDesdeStr: fechaDesdeStr,
                    fechaHastaStr: fechaHastaStr,
                }

            });
			//setstatus('success');

            setData(response.data.response);
            //return response.data.response;
        
        } catch (error) {
            console.log(error);
        }
    };
    return {obtenerGastosPorCargo , data: dataPorDepartamento};
};
