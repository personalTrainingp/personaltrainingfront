import { PTApi } from '@/common/api/';

export const useRecursosHumanoReporteStore = () => {

    const data = [];

    const obtenerGastosPorCargo = async (fechaDesde , fechaHasta) => {
    
        try {
            PTApi.get('/recursos-humanos/gastos-por-cargo');
            const { data } = await PTApi.get('/recursos-humanos/gastos-por-cargo' , {
                
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta,
            });
            console.log(data);
            //data = data;
            return data;
        
        } catch (error) {
            console.log(error);
        }
    };
    return {obtenerGastosPorCargo};
};
