import { PageBreadcrumb } from '@/components'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import dayjs, { locale, utc } from 'dayjs';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { ItemCardPgm } from './ItemCardPgm';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import config from '@/config';
dayjs.extend(utc);
locale('es')

export const ReporteSeguimiento = () => {
    const [selectHorario, setselectHorario] = useState([])
	const { reporteSeguimiento, obtenerReporteSeguimiento, obtenerReporteSeguimientoTODO, viewSeguimiento, agrupado_programas, loadinData } = useReporteStore();
    useEffect(() => {
      obtenerReporteSeguimiento(true, 598)
      obtenerReporteSeguimientoTODO(598, true)
    }, [])

    
    const generarResumen = (array, grupo, labelCaracter, index, objDeleting, objAumenta=[]) => {
        const isSortable = true
        const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0);
        let resumen = [
            { header: labelCaracter, isIndexado: true, items: grupo.items, value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL', order: 1 },
            { header: 'SOCIOS', items: grupo.items, value: grupo.items.length, tFood: sumaTotal, order: 3 },
        ]
        
            // 1️⃣ Filtrar los elementos de resumen que estén en objDeleting
            if (Array.isArray(objDeleting)) {
                const headersAEliminar = objDeleting.map(obj => obj.header);
                resumen = resumen.filter(item => !headersAEliminar.includes(item.header));
            }

            // 2️⃣ Crear un mapa de objAumenta para sobrescribir elementos de resumen
            const objAumentaMap = new Map(objAumenta.map(item => [item.header, item]));

            // 3️⃣ Fusionar los datos, dando prioridad a objAumenta
            resumen = resumen.filter(item => !objAumentaMap.has(item.header)); // Eliminar duplicados
            resumen = [...resumen, ...objAumentaMap.values()]; // Agregar objAumenta

            // 4️⃣ Ordenar por la propiedad order
            return resumen.sort((a, b) => a.order - b.order);
        };
    function agruparPorPrograma(data) {
        return Object.values(data.reduce((acc, item) => {
            const { id_pgm, name_pgm } = item.tb_ProgramaTraining;
    
            if (!acc[id_pgm]) {
                acc[id_pgm] = { id_pgm, name_pgm, items: [] };
            }
    
            acc[id_pgm].items.push(item);
            return acc;
        }, {}));
    }
    const dataAlter = agruparPorPrograma(viewSeguimiento).map((data)=>{
        
        const avatarPrograma = {
            urlImage: `${config.API_IMG.LOGO}${data?.items[0].tb_ProgramaTraining.tb_image.name_image}`,
            width: data?.items[0].tb_ProgramaTraining.tb_image.width,
            height: data?.items[0].tb_ProgramaTraining.tb_image.height
        }
        
        const aforo = data.id_pgm===2?18:data.id_pgm===3?10:data.id_pgm===4?14:''
        const aforo_turno = data.id_pgm===2?36:data.id_pgm===3?10:data.id_pgm===4?14:''
        const porcentajeAusentismo = 30;


        const agrupadoPorHorario = agruparPorHorarios(data.items).sort((a, b) => b.items.length - a.items.length).map((f) => {
            const cuposDispo = aforo - f.items.length;
            const cuposOcupado = f.items.length;
            return { ...f, cuposDispo, cuposOcupado };
          }).map((grupo, index, array) => {
                    const sumaTotal = array.reduce((total, item) => total + (item?.cuposOcupado || 0), 0);
                    const sumarCuposDispo = array.reduce((total, item) => total + item.cuposDispo, 0);
                    // Porcentajes globales (sumatoria total)
                    const sumaPorcentajeOcupados = ((sumaTotal / aforo) * 100).toFixed(2);
                    const sumaPorcentajeDispo = ((sumarCuposDispo / aforo) * 100).toFixed(2);
                    // Porcentajes individuales por grupo
                    const porcentajeOcupadoGrupo = ((grupo.cuposOcupado / aforo) * 100).toFixed(2);
                    const porcentajePendienteGrupo = ((grupo.cuposDispo / aforo) * 100).toFixed(2);
                    const ausentismo = Math.round(aforo * (porcentajeAusentismo / 100)); 
                    const numberCuposOcupados = parseInt(grupo.cuposOcupado) || 0;
                    const numberCuposDisponible = parseInt(grupo.cuposDispo) || 0;
                    const totalTentativo = (numberCuposOcupados + numberCuposDisponible + ausentismo);
                    const sumaAusentismo = array.length*ausentismo
                    const sumaCuposTentativo = sumarCuposDispo+sumaAusentismo
                    console.log(numberCuposOcupados, 'ausents');
                    
                    return [
                        // { header: "", isIndexado: true, isTime: true, value: '', items: grupo.items,  tFood: 'TOTAL' },
                        { header: "TURNO",  isTime: true, value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
                        { header: "SOCIOS ACTIVOS", isSummary: true, value: grupo.cuposOcupado, items: grupo.items, tFood: sumaTotal },
                        { header: "CUPOS POR TURNO", isSummary: true, value: grupo.cuposDispo, items: grupo.items, tFood: sumarCuposDispo },
                        { header: <>AUSENTISMO <br/> 30%</>, isSummary: true, value: ausentismo, items: grupo.items, tFood: '' },
                        { header: <>TOTAL CUPOS POR TURNO</>, isSummary: true, value:  <>{numberCuposDisponible+ausentismo}</>, tFood: sumaCuposTentativo },
                        // { header: "% OCUPADO", isSummary: true, value: <NumberFormatMoney amount={porcentajeOcupadoGrupo}/>, items: grupo.items, tFood: <NumberFormatMoney amount={sumaPorcentajeOcupados/array.length} /> },
                        // { header: "% PENDIENTE", isSummary: true, value: <NumberFormatMoney amount={porcentajePendienteGrupo}/>, tFood: <NumberFormatMoney amount={sumaPorcentajeDispo/array.length}/> },
                    ];
                  });
        return {
            avatarPrograma,
            aforo_turno,
            aforo,
            agrupadoPorHorario
        }
    })
    const data = [
        {            
                    isComparative: true,
                    title: 'SOCIOS PAGANTES POR HORARIO VS AFORO ',
                    id: 'COMPARATIVOPORHORARIOPORPROGRAMA',
                    HTML: dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                            <ItemCardPgm aforo={d.aforo} aforoTurno={d.aforo_turno} avatarPrograma={d.avatarPrograma} arrayEstadistico={d.agrupadoPorHorario} isViewSesiones={true} labelParam={'HORARIO'}/>
                        </Col>
                    )
                    }
                    )
        }
    ]
  return (
    <>
        <PageBreadcrumb subName={'T'} title={'REPORTE DE SEGUIMIENTO DE SOCIOS ACTIVOS'}/>
        {
            loadinData?(
                <>loading</>
            ):(
                <Row>
                    {data.map((section, index) => (
                                <Col xxl={12}>
                                <Row className='d-flex justify-content-center'>
                                    <br/>
                                        {section.HTML}
                                </Row>
                            </Col>
                            ))}
                </Row>
            )
        }
    </>
  )
}

    //AGRUPAR POR HORARIOS
    function agruparPorHorarios(data) {
        const resultado = [];
        
        data?.forEach((item) => {
          const { horario, tarifa_monto } = item;
          
          const formatHorario = dayjs.utc(horario).format('hh:mm A') 
        //   console.log(horario, formatHorario, "horarrrr");
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.propiedad === formatHorario);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: formatHorario, items: [], tarifa_monto };
            resultado.push(grupo);
          }
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
        
        return resultado.sort((a,b)=>b.items.length-a.items.length).sort((a,b)=>b.tarifa_monto-a.tarifa_monto);
    }
// {
//     ordenarPorDistrito(reporteSeguimiento).map(f=>(
//                 <th>{f.distrito}</th>
//     ))
// }
/*

            {
                ordenarPorDistrito(reporteSeguimiento).map(h=>(
                    <tr key={h.horario}>
                        <th>{h.horario}</th>
                        {
                            h.items.map(f=>(
                                <td>{f.tb_ventum.tb_cliente.tb_distrito?.distrito}</td>
                            ))
                        }
                    </tr>
                ))
            }
*/
function agruparPorHorarioYDistrito(datos) {
    const resultado = [];

    datos.forEach(item => {
        const horario =  new Date(item.horario).toISOString().split("T")[1];
        const distrito = item.tb_ventum.tb_cliente.tb_distrito?.distrito;

        // Busca si ya existe un grupo para este horario y distrito
        let grupo = resultado.find(g => g.horario === horario && g.distrito === distrito);

        // Si no existe, lo crea
        if (!grupo) {
            grupo = { horario, distrito, items: [] };
            resultado.push(grupo);
        }

        // Agrega el item al grupo correspondiente
        grupo.items.push(item);
    });

    return resultado;
}
function ordenarPorDistrito(data) {
    // Creamos un objeto para agrupar los datos por distrito
    const agrupadoPorDistrito = {};

    data?.forEach(item => {
        // Obtenemos el nombre del distrito
        const distrito = item.tb_ventum.tb_cliente?.tb_distrito?.distrito;

        // Si el distrito no está en el objeto, lo inicializamos con un array vacío
        if (!agrupadoPorDistrito[distrito]) {
            agrupadoPorDistrito[distrito] = {
                distrito: distrito,
                items: []
            };
        }
        // Agregamos el item al array correspondiente al distrito
        agrupadoPorDistrito[distrito].items.push(item);
    });

    // Convertimos el objeto a un array de objetos
    return Object.values(agrupadoPorDistrito);
}
function ordenarPorHorario(data) {
    // Creamos un objeto para agrupar los datos por distrito
    const agrupadoPorDistrito = {};

    data.forEach(item => {
        // Obtenemos el nombre del distrito
        const horario = dayjs(new Date(item.horario).toISOString().split("T")[1].split('.00')[0], 'hh:mm:ss').format('hh:mm A');

        // Si el distrito no está en el objeto, lo inicializamos con un array vacío
        if (!agrupadoPorDistrito[horario]) {
            agrupadoPorDistrito[horario] = {
                horario: horario,
                items: []

            };
        }

        // Agregamos el item al array correspondiente al distrito
        agrupadoPorDistrito[horario].items.push(item);
    });

    // Convertimos el objeto a un array de objetos
    return Object.values(agrupadoPorDistrito);
}