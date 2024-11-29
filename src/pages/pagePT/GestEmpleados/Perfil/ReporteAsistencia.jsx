import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { ModalReportAsistencia } from './ModalReportAsistencia'
import {  ModalHorasEspeciales } from './ModalHorasEspeciales'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Table } from 'react-bootstrap'
import pdfMake from 'pdfmake/build/pdfmake'
import { fontsRoboto } from '@/assets/fonts/fontsRoboto'
import { ModalAgregarNomina } from './ModalAgregarNomina'
pdfMake.vfs = fontsRoboto

export const ReporteAsistencia = ({}) => {

    const [isOpenModalAgregarNomina, setisOpenModalAgregarNomina] = useState(false)
	const [isOpenModalReportNominas, setisOpenModalReportNominas] = useState(false)
	const [isOpenModalReportAsistencia, setisOpenModalReportAsistencia] = useState(false)
    const [dataPeriodoParamSelect, setdataPeriodoParamSelect] = useState({id_param: '', fecha_hasta: '', fecha_desde:''})
    const { DataPeriodoParam, obtenerParametroPorEntidadyGrupo_PERIODO } = useTerminoStore()
    const onOpenModalReportAsistencia = (id_param, fecha_hasta, fecha_desde)=>{
        setisOpenModalAgregarNomina(true)
        setdataPeriodoParamSelect({id_param, fecha_desde, fecha_hasta})
    }
    const onCloseModalNomina = ()=>{
        setisOpenModalAgregarNomina(false)
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
	const onClickModalReporteAsistencia = ()=>{
		setisOpenModalReportAsistencia(true)
	}	
	const onClickCloseModalReporteAsistencia = ()=>{
		setisOpenModalReportAsistencia(false)
	}
  return (
    <>
                        <Button onClick={onOpenModalReportAsistencia} className='m-2'>AGREGAR NOMINAS</Button>
                        
                    <Table
                        // style={{tableLayout: 'fixed'}}
                        className="table-centered mb-0"
                        hover
                        responsive
                    >
                        <thead className="bg-primary">
                            <tr>
                                <th className='text-white p-1'>ID</th>
                                <th className='text-white p-1'>FECHA</th>
                                <th className='text-white p-1'>REMUNERACIONES S/.</th>
                                <th className='text-white p-1'>DESCUENTOS S/.</th>
                                <th className='text-white p-1'>APORTES S/.</th>
                                <th className='text-white p-1'>VER ASISTENCIAS</th>
                                <th className='text-white p-1'>VER NOMINA</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>01</td>
                                <td>MIERCOLES 21 DE MAYO DEL 2024</td>
                                <td>2,000.00</td>
                                <td>100.00</td>
                                <td>250.00</td>
								<td><a onClick={onClickModalReporteAsistencia} className='text-primary border-bottom-2 cursor-pointer'>VER</a></td>
								<td><a className='text-primary border-bottom-2 cursor-pointer'>VER</a></td>
                            </tr>
                        </tbody>
                    </Table>
                        <ModalAgregarNomina dataPeriodoParamSelect={dataPeriodoParamSelect} show={isOpenModalAgregarNomina} onHide={onCloseModalNomina}/>
                        <ModalReportAsistencia dataPeriodoParamSelect={dataPeriodoParamSelect} show={isOpenModalReportAsistencia} onHide={onClickCloseModalReporteAsistencia}/>
    </>
  )
}
