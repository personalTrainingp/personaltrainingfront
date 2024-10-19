import { useEffect, useState } from 'react';
import { GraficoBarras } from './GraficoBarras';
import { GraficoLinea } from './GraficoLinea';
import { GraficoPie } from './GraficoPie';
import { useRecursosHumanoReporteStore } from '@/hooks/hookApi/useRecursosHumanoReporteStore';
import { Toast } from 'primereact/toast'
import { PageBreadcrumb } from '@/components'
import { Calendar } from 'primereact/calendar'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'

export const Reportes = () => {


    //const { data2 } = useRecursosHumanoReporteStore();
    const { obtenerGastosPorCargo  , data: dataPorDepartamento } = useRecursosHumanoReporteStore();

    useEffect(() => {
        obtenerGastosPorCargo('2024-01-05', '2030-01-06');

    } , [obtenerGastosPorCargo]);


    // let data = [];

    let rangoFechas = [new Date(new Date().getFullYear(), 0, 1), new Date()];

    console.log(dataPorDepartamento);
    const data2 = {
        labels: ["Hombre", "Mujer"],
        datasets: [
            {
                label: "Gastos de Nomina por Genero 2024",
                data: [10000, 20000],
                fill: true,
                backgroundColor: "rgb(255 162 43)",
                borderColor: "rgba(75,192,192,1)"
            }
        ]
    };


    let labelsForPie = [];


    const options = {
        responsive: true,
        plugins: {
            position: 'top',
            align: 'center',

        },
        title: {
            display: true,
            text: 'Gastos de Nomina 2024',
        },
    };


    //antiguedad



    return (

        <div className="container mt-5">
            <h1 className='text-center'>Reportes</h1>

            <div className='flex-auto mb-2'>
                <label htmlFor="buttondisplay" className="font-bold block mb-2 tw-bold">
                    RANGO DE FECHAS:
                </label>
                <div className=''>
                    <Calendar value={rangoFechas} onChange={(e) => setrangoFechas(e.value)} locale='es' showIcon selectionMode="range" readOnlyInput hideOnRangeSelection />
                    <FormatRangoFecha rangoFechas={rangoFechas} />
                    {/* <BtnExportExcelFlujoCaja data={reporte_FlujoCaja}/> */}
                </div>

            </div>


            <div className=''>
                <h3 className='text-center'>Reporte Anuales</h3>
                <div className='row'>
                    <GraficoBarras data={data2} options={options} />
                    <GraficoLinea />
                    <GraficoPie dirtData = {dataPorDepartamento} />
                    <div className='col-md-7 text-center'>
                        <div className='card-body text-secondary card border-secondary box-shadow'>
                            <table className='table '>
                                <thead>
                                    <tr>
                                        <th>Años de Antiguedad</th>
                                        <th>Cargo</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Genero</th>
                                        <th>Horas Trabajadas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Gerente</td>
                                        <td>Carlos</td>
                                        <td>Sanchez</td>
                                        <td>M</td>
                                        <td>8</td>

                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Gerente</td>
                                        <td>Pedro</td>
                                        <td>Bolivares</td>
                                        <td>M</td>
                                        <td>8</td>

                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Gerente</td>
                                        <td>Brayan</td>
                                        <td>Hernandez</td>
                                        <td>M</td>
                                        <td>8</td>

                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Gerente</td>
                                        <td>Paolo</td>
                                        <td>Suarez</td>
                                        <td>M</td>
                                        <td>8</td>

                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Gerente</td>
                                        <td>Roberto</td>
                                        <td>Herrera</td>
                                        <td>M</td>
                                        <td>8</td>

                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Gerente</td>
                                        <td>Marcelo</td>
                                        <td>Gonzalo</td>
                                        <td>M</td>
                                        <td>8</td>

                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Gerente</td>
                                        <td>Enrique</td>
                                        <td>Rodrigo</td>
                                        <td>M</td>
                                        <td>8</td>

                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Gerente</td>
                                        <td>Carlos</td>
                                        <td>Romero</td>
                                        <td>M</td>
                                        <td>8</td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
            <div>
                {/* <h3 className='text-center'>Reporte Mensuales</h3>
                <div className='row'>
                    <GraficoBarras data={data} options={options} />
                    <GraficoLinea />
                    <GraficoPie />
                </div> */}
            </div>
            <div>
                <h2 className='text-center'></h2>
                {/* <div className='row'>
                    <GraficoBarras />
                    <GraficoLinea />
                    <GraficoPie />
                </div> */}
            </div>
        </div>

    );

}

