import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { ModalReportAsistencia } from './ModalReportAsistencia'
import {  ModalHorasEspeciales } from './ModalHorasEspeciales'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Table } from 'react-bootstrap'
import pdfMake from 'pdfmake/build/pdfmake'
import { fontsRoboto } from '@/assets/fonts/fontsRoboto'
import { ModalAgregarNomina } from './ModalAgregarNomina'
import { ModalJornadaPlanilla } from './ModalJornadaPlanilla'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { usePlanillaStore } from './usePlanillaStore'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
pdfMake.vfs = fontsRoboto

export const ReporteAsistencia = ({uid_empl, avatarImage}) => {

    const [isOpenModalAgregarNomina, setisOpenModalAgregarNomina] = useState(false)
	const [idPlanillaEdit, setidPlanillaEdit] = useState(0)
	const [isOpenModalReportNominas, setisOpenModalReportNominas] = useState(false)
	const [isOpenModalReportAsistencia, setisOpenModalReportAsistencia] = useState(false)
    const [dataPeriodoParamSelect, setdataPeriodoParamSelect] = useState({id_param: '', fecha_hasta: '', fecha_desde:''})
	const [uidEmpleado, setuidEmpleado] = useState('')
	const [idPlanilla, setidPlanilla] = useState(0)
	const [idPlanillaJornada, setidPlanillaJornada] = useState(0)
    const { DataPeriodoParam, obtenerParametroPorEntidadyGrupo_PERIODO } = useTerminoStore()
	const { dataPlanillaxEmpl, obtenerPlanillaxEmpl, eliminarPlanillaxID } = usePlanillaStore()
    const onOpenModalNomina = (id = 0)=>{
        setidPlanillaEdit(id)
        setisOpenModalAgregarNomina(true)
    }
    const onCloseModalNomina = ()=>{
        setisOpenModalAgregarNomina(false)
        setidPlanillaEdit(0)
    }
	const onClickEliminarPlanilla = async(p)=>{
		const result = await Swal.fire({
			icon: 'warning',
			title: `¿Eliminar la planilla ${p.id}?`,
			text: `Desde ${dayjs.utc(p.fecha_desde).format('DD/MM/YYYY')}`,
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		})
		if(result.isConfirmed){
			await eliminarPlanillaxID(p.id, uid_empl)
		}
	}
    useEffect(() => {
      obtenerParametroPorEntidadyGrupo_PERIODO('EMPLEADO', 'PERIODO_ASISTENCIA')
	  obtenerPlanillaxEmpl(uid_empl)
    }, [])
	console.log(dataPlanillaxEmpl, "plani");
	
    var dd = {
		content: [
			// {
			//   text: 'CHANGE',
			//   alignment: 'center',
			//   style: 'header'
			// },
			{
				text: 'REPORTE DE ASISTENCIAS',
				alignment: 'center',
				style: 'header',
			},
			'\n',
			{
				columns: [
					{
						style: 'header_info',
						text: ['EMPRESA: INVERSIONES LUROGA \n', 'UBICACION: TARATA'],
					},
					{
						style: 'header_info',
						text: ['COLABORADOR: ALVARO SALAZAR \n', 'DEPARTAMENTO: VENTAS'],
					},
					{
						style: 'header_info',
						text: ['PERIODO DESDE: 17/02/2024 \n', 'PERIODO HASTA: 17/03/2024'],
					},
				],
			},
			{
				style: 'tableExample',
				color: '#444',
				table: {
					widths: [200, 'auto', 'auto'],
		headerRows: 2,
		// keepWithHeaderRows: 1,
		body: [
			[
				{ text: 'FECHA', style: 'tableHeader', alignment: 'center' },
				{
					text: 'HORARIO',
					style: 'tableHeader',
					colSpan: 2,
					alignment: 'center',
				},
				{}, // Celda vacía para completar el colSpan
			],
		],
				},
			},
		],
		styles: {
			tableExample: {
				// fontSize: 10
				// margin: [0, 5, 0, 15]
			},
			header_info: {
				fontSize: 10,
			},
			subTitle: {
				fontSize: 12,
				bold: true,
				margin: [4, 10, 0, 7],
			},
			subSubTitle: {
				fontSize: 12,
				bold: true,
			},
			header: {
				fontSize: 14,
				bold: true,
			},
			subHeader: {
				fontSize: 13,
			},
			quote: {
				italics: true,
			},
			small: {
				fontSize: 8,
			},
		},
	};
    const onClickGenerarPdf = ()=>{
      const formData = new FormData();
      const pdfGenerator = pdfMake.createPdf(dd)
      pdfGenerator.getBlob((blob)=>{
        // Crear un archivo para el FormData con el PDF generado
        // formData.append('file', blob, `historial-clinico-${dataCli.id_cli}.pdf`);
        // const url = URL.createObjectURL(blob)
        // seturl(url)
        // startRegisterClinico(formState, formStateAntPatNutr, formData, dataCli.id_cli)
        pdfGenerator.download()
      })
    }
	const onClickModalReporteAsistencia = (id_p, uid_emp)=>{
		setidPlanilla(id_p)
		setuidEmpleado(uid_emp)
		setisOpenModalReportAsistencia(true)
	}	
	const onClickCloseModalReporteAsistencia = ()=>{
		setisOpenModalReportAsistencia(false)
	}
  return (
    <>
                        <Button onClick={()=>onOpenModalNomina(0)} className='m-2'>AGREGAR PLANILLA</Button>
                        
                    <Table
                        // style={{tableLayout: 'fixed'}}
                        className="table-centered mb-0"
                        hover
                        responsive
                    >
                        <thead className="bg-primary">
                            <tr>
                                <th className='text-white p-1'>ID</th>
                                <th className='text-white p-1'>FECHA DESDE</th>
                                <th className='text-white p-1'>SUELDO <SymbolSoles/></th>
                                <th className='text-white p-1'>TIPO DE PAGO</th>
                                <th className='text-white p-1'>VER ASISTENCIA</th>
                                <th className='text-white p-1'>VER NOMINA</th>
                                <th className='text-white p-1'>EDITAR JORNADA</th>
                                <th className='text-white p-1'>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
							{dataPlanillaxEmpl.map(p=>(
									<tr key={p.id}>
									<td>{p.id}</td>
									<td>{dayjs.utc(p.fecha_desde).format('DD/MM/YYYY')}</td>
									<td>{p.sueldo!=null && <NumberFormatMoney amount={p.sueldo} className=''/>}</td>
									<td>{p.tipo_pago}</td>
									<td><a onClick={()=>onClickModalReporteAsistencia(p.id, p.uid_empleado)} className='text-primary border-bottom-2 cursor-pointer'>VER</a></td>
									<td><a className='text-primary border-bottom-2 cursor-pointer'>VER</a></td>
									<td><a onClick={()=>setidPlanillaJornada(p.id)} className='text-primary border-bottom-2 cursor-pointer'>EDITAR</a></td>
									<td>
										<i className='pi pi-pencil text-primary cursor-pointer mx-2' title='Editar' onClick={()=>onOpenModalNomina(p.id)}></i>
										<i className='pi pi-trash text-danger cursor-pointer mx-2' title='Eliminar' onClick={()=>onClickEliminarPlanilla(p)}></i>
									</td>
								</tr>
							))
							}
                            
                        </tbody>
                    </Table>
                        <ModalAgregarNomina uid_empl={uid_empl} id={idPlanillaEdit} show={isOpenModalAgregarNomina} onHide={onCloseModalNomina} onSaved={()=>obtenerPlanillaxEmpl(uid_empl)}/>
                        <ModalJornadaPlanilla id_planilla={idPlanillaJornada} show={idPlanillaJornada!==0} onHide={()=>setidPlanillaJornada(0)}/>
                        <ModalReportAsistencia avatarImage={avatarImage} id_planilla={idPlanilla} uid_empl={uid_empl} dataPeriodoParamSelect={dataPeriodoParamSelect} show={isOpenModalReportAsistencia} onHide={onClickCloseModalReporteAsistencia}/>
    </>
  )
}
