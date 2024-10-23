import {  ReportePorMarcacion } from './reportePorMarcacion';
import { useReporteClienteStore } from "@/hooks/hookApi/useReporteClienteStore";
import { use } from 'i18next';
import { useEffect , useState } from "react";

export const Reportes = () => {
    const { reportePorMarcacion , dataAsistencia } = useReporteClienteStore();
    const [isLogged, setIsLogged] = useState(false);
    
    useEffect(() => {
        reportePorMarcacion();

    }, []);

    useEffect(()=>{
        if (!isLogged && dataAsistencia?.FechaMasRecienteAsistencia) {
            console.log(dataAsistencia);
            setIsLogged(true); // Solo lo hará una vez
        }
    }, [dataAsistencia, isLogged]);
    //console.log(dataAsistencia.FechaMasRecienteAsistencia.clientes[0].dni);


    return(
        <div className="container mt-5">
            {
                dataAsistencia ? (
                    <ReportePorMarcacion dataAsistencia = {dataAsistencia.FechaMasRecienteAsistencia} />

                ):(<p>Cargando...</p>)
            }
        </div>
    );
};
