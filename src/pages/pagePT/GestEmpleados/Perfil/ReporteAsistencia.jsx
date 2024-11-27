import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { ModalReportAsistencia } from './ModalReportAsistencia'
import {  ModalHorasEspeciales } from './ModalHorasEspeciales'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Table } from 'react-bootstrap'
import pdfMake from 'pdfmake/build/pdfmake'
import { fontsRoboto } from '@/assets/fonts/fontsRoboto'
pdfMake.vfs = fontsRoboto

export const ReporteAsistencia = ({}) => {

    const [isOpenModalReportAsistencia, setisOpenModalReportAsistencia] = useState(false)
    const [dataPeriodoParamSelect, setdataPeriodoParamSelect] = useState({id_param: '', fecha_hasta: '', fecha_desde:''})
    const { DataPeriodoParam, obtenerParametroPorEntidadyGrupo_PERIODO } = useTerminoStore()
    const onOpenModalReportAsistencia = (id_param, fecha_hasta, fecha_desde)=>{
        setisOpenModalReportAsistencia(true)
        setdataPeriodoParamSelect({id_param, fecha_desde, fecha_hasta})
    }
    const onCloseModalReportAsistencia = ()=>{
        setisOpenModalReportAsistencia(false)
    }
    useEffect(() => {
      obtenerParametroPorEntidadyGrupo_PERIODO('EMPLEADO', 'PERIODO_ASISTENCIA')
    }, [])
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
  return (
    <>
                        <Button onClick={onOpenModalReportAsistencia} className='m-2'>AGREGAR PERIODO</Button>
                        
                    <Table
                        // style={{tableLayout: 'fixed'}}
                        className="table-centered mb-0"
                        hover
                        responsive
                    >
                        <thead className="bg-primary">
                            <tr>
                                <th className='text-white p-1'>FECHA DESDE</th>
                                <th className='text-white p-1'>FECHA ANTES</th>
                                <th className='text-white p-1'>HORAS ASIGNADAS</th>
                                <th className='text-white p-1'>ASISTIDAS</th>
                                <th className='text-white p-1'>TARDANZAS</th>
                                <th className='text-white p-1'>GENERAR PDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>21 DE ABRIL DEL 2024</td>
                                <td>21 DE MAYO DEL 2024</td>
                                <td>198 HORAS</td>
                                <td>150 HORAS Y 20 MINUTOS</td>
                                <td>40 MINUTOS</td>
                                <td className='text-center'>
                                  <i className='pi pi-file-pdf text-primary font-20 cursor-pointer' onClick={onClickGenerarPdf}></i>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                        {/* <ModalHorasEspeciales dataPeriodoParamSelect={dataPeriodoParamSelect} show={isOpenModalReportAsistencia} onHide={onCloseModalReportAsistencia}/> */}
                        <ModalReportAsistencia dataPeriodoParamSelect={dataPeriodoParamSelect} show={isOpenModalReportAsistencia} onHide={onCloseModalReportAsistencia}/>
    </>
  )
}
