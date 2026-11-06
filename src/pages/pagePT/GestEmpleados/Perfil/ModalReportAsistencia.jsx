import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Table, Row } from 'react-bootstrap';
import { usePlanillaStore } from './usePlanillaStore';
import dayjs from 'dayjs';
import { TabPanel, TabView } from 'primereact/tabview';
import { ordenarYtransformar, useJornadaStore } from '@/hooks/hookApi/useJornadaStore';
import { Image } from 'primereact/image';
// import customParseFormat from 'dayjs/plugin/customParseFormat'
// dayjs.extend(customParseFormat); // Activar la extensión

function restarTiempo(horaInicio, horaFin) {

    // Crear objetos dayjs para las dos horas
    horaInicio = dayjs(horaInicio, 'hh:mm A'); // 6:00 AM
    horaFin = dayjs(horaFin, 'hh:mm A'); // 2:00 PM
    // Calcular la diferencia en horas y minutos
const diferenciaEnMinutos = horaFin.diff(horaInicio, 'minute');
const horas = Math.floor(diferenciaEnMinutos / 60); // Obtener horas completas
const minutos = diferenciaEnMinutos % 60; // Obtener minutos restantes
// console.log(horaInicio, horaFin);
    
return `${horas} HRS ${minutos!==0?`Y ${minutos} MIN`:''}`
}
function calcularMinutosDesdeHoraCero(hora) {
    // Parsear la hora ingresada
    const horaIngresada = dayjs(hora, "h:mm A"); // Formato: 6:00 AM
  
    // Crear una hora base (00:00)
    const horaCero = dayjs("00:00", "HH:mm");
  
    // Calcular la diferencia en minutos
    const minutosDesdeHoraCero = horaIngresada.diff(horaCero, "minute");
  
    return minutosDesdeHoraCero;
}

function restarMinutos(horaInicio, horaFin) {
    return calcularMinutosDesdeHoraCero(horaFin)-calcularMinutosDesdeHoraCero(horaInicio)
}
// function restarMinutos(horaInicio, horaFin) {

//     // Crear objetos dayjs para las dos horas
//     horaInicio = dayjs(horaInicio, 'hh:mm A'); // 6:00 AM
//     horaFin = dayjs(horaFin, 'hh:mm A'); // 2:00 PM
//     // Calcular la diferencia en horas y minutos
//     const diferencia = horaFin.diff(horaInicio, 'minute'); // Restar en minutos 
    
// return `${diferencia}`

// }
// mes y anio (opcionales): muestra solo ese mes, del día 1 al último (dentro de las fechas del contrato)
// permisos (opcional): [{desde, hasta, conGoceSueldo}] en YYYY-MM-DD; en su rango la tardanza es 0
// tardanzasRegistradas (opcional): [{fecha, minutos, conGoceSueldo}]; sin goce reemplaza los minutos del día y con goce los resta
export const ModalReportAsistencia = ({show, onHide, uid_empl, id_planilla, avatarImage, mes, anio, permisos = [], tardanzasRegistradas = []}) => {
    const { postPlanillaxEMPL, obtenerAsistenciasxEmpl, obtenerPlanillaxID, obtenerJornadaxPlanilla, dataPlanilla, asistenciaxEmplxPlanilla } = usePlanillaStore()
    const { dataJornadaxEmpl, obtenerJornadaxEmpleado } = useJornadaStore()
    // Horario del contrato (editar jornada); si no tiene, se usa la jornada del colaborador
    const [jornadaPlanilla, setjornadaPlanilla] = useState(null)
    const jornadas = jornadaPlanilla ?? dataJornadaxEmpl
    // sin fecha_hasta el periodo llega hasta hoy
    const fechaHasta = dataPlanilla.fecha_hasta ? dayjs.utc(dataPlanilla.fecha_hasta) : dayjs()
    const conMes = Boolean(mes && anio)
    const finMes = conMes ? dayjs(`${anio}-${String(mes).padStart(2, '0')}-01`).endOf('month') : null
    // con mes: hasta el último día del mes, salvo que el contrato termine antes
    const contratoTerminaAntes = conMes && dataPlanilla.fecha_hasta && fechaHasta.format('YYYY-MM-DD') < finMes.format('YYYY-MM-DD')
    const fechaFinal = conMes && !contratoTerminaAntes ? finMes : fechaHasta
    // Se genera desde el inicio del contrato para no alterar el ciclo de semanas, y luego se recorta al mes
    const semanasDelContrato = obtenerDiasPorRango(dayjs.utc(dataPlanilla.fecha_desde).format('DD/MM/YYYY'), fechaFinal.format('DD/MM/YYYY'), asistenciaxEmplxPlanilla, jornadas)
    const arrayDeDiasxSemana = conMes ? filtrarSemanasDelMes(semanasDelContrato, mes, anio) : semanasDelContrato
    const diasVisibles = arrayDeDiasxSemana.flatMap(s=>s.items)
    const periodoDesde = conMes ? (diasVisibles[0]?.fecha ?? '-') : dayjs.utc(dataPlanilla.fecha_desde).format('DD/MM/YYYY')
    const periodoHasta = conMes ? (diasVisibles[diasVisibles.length - 1]?.fecha ?? '-') : fechaHasta.format('DD/MM/YYYY')
    const hoy = dayjs().format('YYYY-MM-DD')
    useEffect(() => {
        if(id_planilla==0 || !show) return;
        setjornadaPlanilla(null)
        obtenerJornadaxPlanilla(id_planilla).then(j=>setjornadaPlanilla(j?.semanas?.length?ordenarYtransformar(j.semanas):null))
        obtenerPlanillaxID(id_planilla)
        obtenerAsistenciasxEmpl(uid_empl, id_planilla)
        obtenerJornadaxEmpleado(uid_empl)
    }, [id_planilla, show])
  return (
    <Dialog
        visible={show}
        onHide={onHide}
        position='top'
        style={{width: '120rem'}}
        header='REPORTE DE ASISTENCIA'
        >
            <div className='d-flex justify-content-center'>
                <Image src={avatarImage} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="250" />
            </div>
          <h4>PERIODO DESDE: {periodoDesde} </h4>
          <h4>PERIODO HASTA: {periodoHasta} </h4>
          <div>
            <Row>
              <Col xxl={12}>
              {
                arrayDeDiasxSemana.map(s=>(
                    <>
                    <h3>SEMANA {s.semana}</h3>
                    <div style={{width: '1300px'}} className='d-flex justify-content-center'>
                    <Table
                                className="table-centered table-striped table-normal mb-0"
                            >
                                <thead className="bg-primary">
                                    <tr>
                                        <th className='text-white text-center p-1' rowSpan={2} colSpan={1} style={{width: '130px'}}>DIA Y FECHA</th>
                                        <th className='text-white text-center p-1' colSpan={2}>HORARIO </th>
                                        <th className='text-white text-center p-1' colSpan={2}>ASISTENCIA</th>
                                        <th className='text-white text-center p-1' colSpan={2}>RESUMEN</th>
                                        <th className='text-white text-center p-1' colSpan={2}>PERMISOS</th>
                                        <th className='text-white text-center p-1' rowSpan={2} colSpan={1} style={{width: '100px'}}>HORAS <br/> EXTRAS</th>
                                    </tr>
                                    <tr>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '110px'}}>ENTRADA</th>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '110px'}}>SALIDA</th>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '110px'}}>ENTRADA</th>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '110px'}}>SALIDA</th>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '80px'}}>HORAS</th>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '80px'}}><div className='p-0' >TARDANZAS</div></th>
                                        <th className='text-white text-center m-0 p-0' colSpan={1} style={{width: '130px'}}><div className='p-0'>AUTORIZADO</div></th>
                                        <th className='text-white text-center m-0 p-0' colSpan={1} style={{width: '130px'}}><div className='p-0'>NO <br/> AUTORIZADO</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                {
                                    s.items.map(i=>{
                                        const jornadaEntrada = dayjs.utc(i.jornadaEntrada, 'hh:mm').format('hh:mm A')
                                        const jornadaSalida = dayjs.utc(i.jornadaSalida, 'hh:mm').format('hh:mm A')
                                        const marcacionInicio = dayjs.utc(i.marcacionInicio).format('hh:mm A')
                                        const marcacionFin = dayjs.utc(i.marcacionFin).format('hh:mm A')
                                        const minutosMarcados = (!isNaN(restarMinutos( jornadaEntrada, marcacionInicio))&&restarMinutos( jornadaEntrada, marcacionInicio)>0)? restarMinutos( jornadaEntrada, marcacionInicio) : 0
                                        const salidasTempranas = (!isNaN(restarMinutos( jornadaSalida, marcacionFin))&&restarMinutos( jornadaSalida, marcacionFin)<0)&& `${-restarMinutos( jornadaSalida, marcacionFin)} MIN`
                                        const diaYfecha = dayjs.utc(i.fecha, 'DD/MM/YYYY').format('dddd DD')
                                        // la asistencia se muestra siempre; tardanza / NO ASISTIÓ solo si ese día tiene horario
                                        const tieneHorario = i.jornadaEntrada!='00:00'
                                        const marco = i.marcacionInicio!='00:00:00'
                                        // hoy aún puede marcar y los días futuros todavía no llegan: no son falta
                                        const fechaISO = dayjs.utc(i.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD')
                                        const pendiente = !marco && fechaISO >= hoy
                                        const permisosDelDia = permisos.filter(p=>fechaISO >= p.desde && fechaISO <= p.hasta)
                                        const sumarRegistradas = (conGoce)=> tardanzasRegistradas
                                            .filter(t=>t.fecha === fechaISO && t.conGoceSueldo === conGoce)
                                            .reduce((total, t)=>total + t.minutos, 0)
                                        const minutosTarde = sumarRegistradas(false) || minutosMarcados
                                        const minutosFinal = Math.max(0, minutosTarde - sumarRegistradas(true))
                                        const resumenSinPermiso = !marco ? 'NO ASISTIÓ' : (minutosFinal > 0 ? `${minutosFinal} MIN` : '')
                                        const resumenConPermiso = !marco
                                            ? (permisosDelDia.some(p=>p.conGoceSueldo) ? 'PERMISO' : 'NO ASISTIÓ')
                                            : (minutosTarde > 0 ? '0 MIN' : '')
                                        return(
                                                    <tr className=''>
                                                        <th>{diaYfecha}</th>
                                                        <td>{i.jornadaEntrada!='00:00'&&jornadaEntrada}</td>
                                                        <td>{i.jornadaSalida!='00:00'&&jornadaSalida}</td>
                                                        <td>{marco&&marcacionInicio}</td>
                                                        <td>{i.marcacionFin!='00:00:00'&&marcacionFin}</td>
                                                        <td>{i.jornadaEntrada!='00:00'&&restarTiempo(jornadaEntrada, jornadaSalida)}</td>
                                                        <td>{!tieneHorario||pendiente?'':permisosDelDia.length>0?resumenConPermiso:resumenSinPermiso}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                        )
                                    }
                                )
                                }
                                </tbody>
                        </Table>
                    </div>
                    </>
                ))
              }
                    <br/>
              </Col>

            </Row>
          </div>
    </Dialog>
  )
}




// Deja solo los días del mes (fecha 'DD/MM/YYYY') y numera las semanas desde 1 dentro de ese mes
function filtrarSemanasDelMes(semanas, mes, anio) {
    const mesAnio = `${String(mes).padStart(2, '0')}/${anio}`;
    return semanas
        .map((s) => ({ ...s, items: s.items.filter((i) => i.fecha.slice(3) === mesAnio) }))
        .filter((s) => s.items.length > 0)
        .map((s, index) => ({ ...s, semana: index + 1 }));
}

function obtenerDiasPorRango(fechaDesde, fechaHasta, marcaciones, jornadas) {
    const fechaInicio = dayjs(fechaDesde, 'DD/MM/YYYY');
    const fechaFin = dayjs(fechaHasta, 'DD/MM/YYYY');
    const dataDiasRango = [];
    let semanaActual = [];
    let semanaNumero = 1;
    let fechaActual = fechaInicio;

    // Crear un mapa de marcaciones para acceso rápido
    const mapaMarcaciones = marcaciones.reduce((mapa, item) => {
        const fecha = dayjs(item.fecha).format('DD/MM/YYYY');
        mapa[fecha] = {
            inicio: item.items[0].tiempo_marcacion_new,
            // con una sola marcación en el día no hay salida
            fin: item.items.length > 1 ? item.items[item.items.length - 1].tiempo_marcacion_new : '00:00:00',
        };
        return mapa;
    }, {});

    // Crear un mapa de jornadas para acceso rápido
    const mapaJornadas = jornadas.reduce((mapa, item) => {
        if (!mapa[item.semana]) mapa[item.semana] = {};
        mapa[item.semana][item.dia] = {
            entrada: item.entrada,
            salida: item.salida,
        };
        return mapa;
    }, {});

    const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

    while (fechaActual.isBefore(fechaFin) || fechaActual.isSame(fechaFin)) {
        const diaFormateado = fechaActual.format('DD/MM/YYYY');
        
        const diaSemana = fechaActual.day(); // Obtiene el día de la semana (0=Domingo, 6=Sábado)
        const nombreDia = diasSemana[diaSemana];
        const marcacion = mapaMarcaciones[diaFormateado] || { inicio: '00:00:00', fin: '00:00:00' };
        // Las semanas de la jornada se repiten en ciclo (un horario de 1 semana aplica a todas)
        const totalSemanas = Object.keys(mapaJornadas).length;
        const semanaJornada = totalSemanas ? ((semanaNumero - 1) % totalSemanas) + 1 : semanaNumero;
        const jornada = (mapaJornadas[semanaJornada] && mapaJornadas[semanaJornada][nombreDia]) || { entrada: '00:00', salida: '00:00' };
        // Añadir el día con marcación y jornada al array de la semana actual
        semanaActual.push({
            fecha: diaFormateado,
            marcacionInicio: marcacion.inicio,
            marcacionFin: marcacion.fin,
            jornadaEntrada: jornada.entrada,
            jornadaSalida: jornada.salida,
        });

        // Si es domingo o el último día del rango, cerrar la semana
        if (diaSemana === 0 || fechaActual.isSame(fechaFin)) {
            dataDiasRango.push({
                semana: semanaNumero,
                items: [...semanaActual],
            });
            semanaActual = [];
            semanaNumero++;
        }

        fechaActual = fechaActual.add(1, 'day');
    }

    return dataDiasRango;
}