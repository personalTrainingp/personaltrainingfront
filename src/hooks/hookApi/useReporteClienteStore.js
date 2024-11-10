import { PTApi } from '@/common/api/';
import { useState } from 'react';

export const useReporteClienteStore = () =>{

    const [dataAsistencia, setDataAsistencia] = useState([]);
    const reportePorMarcacion = async ()=>{
        try {
            const response = await PTApi.get('marcacion/obtener-asistencia-clientes-por-cliente');
            
            setDataAsistencia(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    return {reportePorMarcacion , dataAsistencia};
};

