import { useForm } from '@/hooks/useForm';
import { Sidebar } from 'primereact/sidebar'
import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
// import { vfsFonts } from 'pdfmake/build/vfs_fonts';
import { TabPanel, TabView } from 'primereact/tabview';
import { ScrollPanel } from 'primereact/scrollpanel';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import dayjs from 'dayjs';
import { arraySexo } from '@/types/type';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { useNutricionCliente } from '@/hooks/hookApi/useNutricionCliente';
import pdfMake from 'pdfmake/build/pdfmake'
// import pdfFonts from "pdfmake/build/vfs_fonts";
import { fontsRoboto } from '@/assets/fonts/fontsRoboto'
pdfMake.vfs = fontsRoboto

const registerConsulta = {
  id: 1,
  dato_motivacion: '',
  antec_pat_de_algun_familiar: '',
  antec_pat_fumado: '',
  antec_pat_consumes_farmaco: '',
  antec_pat_tomas_alcohol: '',
  antec_pat_realizas_actividad_fisica: '',
  antec_pat_modific_tu_alimentacion_ultimos6meses: '',
  antec_pat_cual_es_tu_apetito: '',
  antec_pat_hora_de_mas_hambre: '',
  antec_pat_alimentos_preferidos:'',
  antec_pat_alimentos_desagradables:'',
  antec_pat_alimentos_alergias:'',
  antec_pat_alimentos_suplemento_complemento:'',
  antec_pat_alimentos_segun_estado_animo:'',
  antec_pat_tratam_perdida_peso:'',
  hora_acostarse: '',
  horaDeDespierto: '',
  horaDeDormir: '',
  
  horario_desayuno: '',
  lugar_desayuno: '',

  alimentacion_actual_desayuno: '',
  alimentacion_plan_desayuno: '',
  
  horario_media_maniana: '',
  lugar_media_maniana: '',
  
  alimentacion_actual_media_maniana: '',
  alimentacion_plan_media_maniana: '',
  
  horario_almuerzo: '',
  lugar_almuerzo: '',
  
  alimentacion_actual_almuerzo: '',
  alimentacion_plan_almuerzo: '',
  
  horario_media_tarde: '',
  lugar_media_tarde: '',
  
  alimentacion_actual_media_tarde: '',
  alimentacion_plan_media_tarde: '',
  
  horario_cena: '',
  lugar_cena: '',
  
  alimentacion_actual_cena: '',
  alimentacion_plan_cena: '',
  
  horario_extras: '',
  lugar_extras: '',

  alimentacion_actual_extras: '',
  alimentacion_plan_extras: '',
  
  vasos_agua_x_dia: '',
  consumo_gaseosa: '',
  consumo_dulces: '',
  cambios_fin_semana: '',
  
  hora_dormir: '',
  hora_despertar: ''
}
const registerAntecedentePatologico = {
	PAT612: false,
	PAT613: false,
	PAT614: false,
	PAT615: false,
	PAT616: false,
	PAT617: false,
	PAT618: false,
	PAT619: false,
	PAT620: false,
	PAT621: false,
	PAT622: false,
	PAT623: false,
	PAT624: false,
	PAT625: false,
	PAT626: false,
	PAT627: false,
	PAT628: false,
	PAT629: false,
	PAT630: false,
	PAT631: false,
	PAT632: false,
	PAT633: false,
	PAT634: false,
	PAT635: false,
	PAT636: false,
	PAT637: false,
	PAT638: false,
	PAT639: false,
	PAT640: false,
	PAT641: false,
	PAT642: false,
}

export const SidebarClinico = ({show, onHide, dataCli}) => {
  	
	const {
		antec_pat_de_algun_familiar,
		dato_motivacion,
		antec_pat_fumado,
		antec_pat_consumes_farmaco,
		antec_pat_tomas_alcohol,
		antec_pat_realizas_actividad_fisica,
		antec_pat_modific_tu_alimentacion_ultimos6meses,
		antec_pat_cual_es_tu_apetito,
		antec_pat_hora_de_mas_hambre,
		antec_pat_alimentos_preferidos,
		antec_pat_alimentos_desagradables,
		antec_pat_alimentos_alergias,
		antec_pat_alimentos_suplemento_complemento,
		antec_pat_alimentos_segun_estado_animo,
		antec_pat_tratam_perdida_peso,
		hora_acostarse,
		horaDeDespierto,
		horaDeDormir,
		horario_desayuno,
		lugar_desayuno,
		alimentacion_actual_desayuno,
		alimentacion_plan_desayuno,
		horario_media_maniana,
		lugar_media_maniana,
		alimentacion_actual_media_maniana,
		alimentacion_plan_media_maniana,
		horario_almuerzo,
		lugar_almuerzo,
		alimentacion_actual_almuerzo,
		alimentacion_plan_almuerzo,
		horario_media_tarde,
		lugar_media_tarde,
		alimentacion_actual_media_tarde,
		alimentacion_plan_media_tarde,
		horario_cena,
		lugar_cena,
		alimentacion_actual_cena,
		alimentacion_plan_cena,
		horario_extras,
		lugar_extras,
		alimentacion_actual_extras,
		alimentacion_plan_extras,
		vasos_agua_x_dia,
		consumo_gaseosa,
		consumo_dulces,
		cambios_fin_semana,
		onInputChange,
		formState,
		onResetForm: onResetConsulta} = useForm(registerConsulta)
		const {
			PAT612,
			PAT613,
			PAT614,
			PAT615,
			PAT616,
			PAT617,
			PAT618,
			PAT619,
			PAT620,
			PAT621,
			PAT622,
			PAT623,
			PAT624,
			PAT625,
			PAT626,
			PAT627,
			PAT628,
			PAT629,
			PAT630,
			PAT631,
			PAT632,
			PAT633,
			PAT634,
			PAT635,
			PAT636,
			PAT637,
			PAT638,
			PAT639,
			PAT640,
			PAT641,
			PAT642,
			formState:formStateAntPatNutr,
			onInputChange:onInputChangePatNutr,
			onResetForm: onResetFormApatol
		} = useForm(registerAntecedentePatologico)
	const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
	const [url, seturl] = useState(null)
		const { calcularEdad } = helperFunctions()
	var dd = {
		content: [
			{
				text: 'HISTORIA NUTRICIONAL',
				alignment: 'center',
				style: 'header'
			},
			{
				text: 'I) Datos del paciente',
				style:'subTitle'
			},
			{
				style: 'tableExample',
				table: {
					widths: ['*', '*', '*', '*'],
					body: [
						[{text: `NOMBRES Y APELLIDOS: ${dataCli.nombre_cli} ${dataCli.apPaterno_cli} ${dataCli.apMaterno_cli}`, style: 'tableHeader', colSpan: 4}, {}, {}, {}], // Celda que abarca 4 columnas
						[
						{text: `EDAD: ${calcularEdad(dataCli.fecha_nacimiento)} años`, style: 'tableHeader', colSpan: 2}, {}, 
						{text: `SEXO: ${arraySexo.find(s=>s.value==dataCli.sexo_cli).label}`, style: 'tableHeader', colSpan: 2}, {}
						], // Dos celdas que abarcan 2 columnas cada una
						[{text: `MOTIVACIÓN (¿PARA QUÉ QUIERE LOGRAR ESE OBJETIVO?): ${formState.dato_motivacion.toUpperCase()}`, style: 'tableHeader', colSpan: 4}, {}, {}, {}] // Celda que abarca 4 columnas
					]
				}
			},
			{
				text: 'II) ANTECEDENTES PATOLÓGICOS',
				style:'subTitle'
			},
			{
				style: 'tableExample',
				table: {
					widths: ['*', '*', '*', '*'],
					body: [
						// [{text: 'Sufre o sufrió de alguna de estas enfermedades, dolencias o condiciones?', style: 'tableHeader', colSpan: 4}],
						[{text: `Enf. Cardiovascular ( ${PAT612 ? 'X':''} )`, style: 'tableHeader'}, {text: `Hígado graso ( ${PAT613 ? 'X':''} )`, style: 'tableHeader',}, {text: `Osteoporosis/osteopenia ( ${PAT614 ? 'X':''} )`, style: 'tableHeader'}, {text: `Intestino Irritable – D ( ${PAT615 ? 'X':''} )`, style: 'tableHeader',}],
						[{text: `Diabetes ( ${PAT616 ? 'X':''} ) RI ( ${PAT617 ? 'X':''}  )`, style: 'tableHeader'}, {text: `Enf. Renal ( ${PAT618 ? 'X':''} )`, style: 'tableHeader'}, {text: `Gota ( ${PAT619 ? 'X':''} ) `, style: 'tableHeader'}, {text: `Nauseas/ Vómitos ( ${PAT620 ? 'X':''} )`, style: 'tableHeader',}],
						[{text: `Resistencia a la insulina ( ${PAT621 ? 'X':''}  )`}, {text: `Enf. Pancreática ( ${PAT622 ? 'X':''} )`}, {text: `Hipertiroidismo ( ${PAT623 ? 'X':''} )`}, {text: `Falta de apetito ( ${PAT624 ? 'X':''} )`}],
						[{text: `Enf. Pulmonar ( ${PAT625 ? 'X':''} )`}, {text: `Enf. Pulmonar ( ${PAT626 ? 'X':''} )`}, {text: `Hipotiroidismo ( ${PAT627 ? 'X':''} ) `}, {text: `Gastritis y/o úlceras ( ${PAT628 ? 'X':''} )`}],
						[{text: `Colesterol elevado ( ${PAT629 ? 'X':''} )`}, {text: `Cáncer ( ${PAT630 ? 'X':''} )`}, {text: `Enfermedad autoinmune ( ${PAT631 ? 'X':''} )`}, {text: `Estrés ( ${PAT632 ? 'X':''} ) Ansiedad ( ${PAT633 ? 'X':''} )`}],
						[{text: `Triglicéridos elevados ( ${PAT634 ? 'X':''} )`}, {text: `Migrañas ( ${PAT635 ? 'X':''} )`}, {text: `Dificultad al masticar ( ${PAT636 ? 'X':''} )`}, {text: `Depresión ( ${PAT637 ? 'X':''} ) Insomnio ( ${PAT638 ? 'X':''} )`}],
						[{text: `Anemia  ( ${PAT639 ? 'X':''} )`}, {text: `Estreñimiento ( ${PAT640 ? 'X':''} )`}, {text: `Intestino Irritable - C ( ${PAT641 ? 'X':''} )`}, {text: `Prostatitis ( ${PAT642 ? 'X':''} )`}],
						[{text: ' ', colSpan: 4}],
						[{text: `Algún familiar consanguíneo sufre o sufrió de alguna de estas enfermedades? ${antec_pat_de_algun_familiar}`, colSpan: 4}],
					]
				}
			},
			{
				text: 'III) ESTILO DE VIDA',
				style:'subTitle'
			},
			{
				style: 'tableExample',
				table: {
					widths: ['*', '*', '*', '*'],
					body: [
						[{text: `¿Fumas o has fumado anteriormente? ( ${antec_pat_fumado.trim().length<=0?'':'SI'} ) ${antec_pat_fumado}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Consumes algún fármaco con frecuencia? ( ${antec_pat_consumes_farmaco.trim().length<=0?'':'SI'} ) ${antec_pat_consumes_farmaco}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Tomas alcohol? ( ${antec_pat_tomas_alcohol.trim().length<=0?'':'SI'} ) ${antec_pat_tomas_alcohol}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Realizas actividad física? ( ${antec_pat_realizas_actividad_fisica.trim().length<=0?'':'SI'} ) ${antec_pat_realizas_actividad_fisica}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Modificaste tu alimentación en los últimos 6 meses? (${antec_pat_modific_tu_alimentacion_ultimos6meses.trim().length<=0?'':'SI'} ) ${antec_pat_modific_tu_alimentacion_ultimos6meses}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Cómo es tu apetito? ${antec_pat_cual_es_tu_apetito}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿A qué hora tienes más hambre? ${antec_pat_hora_de_mas_hambre}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Cuáles son tus alimentos preferidos? ${antec_pat_alimentos_preferidos}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Alimentos que te desagradan? ${antec_pat_alimentos_desagradables}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Alergia o intolerancia a algún alimento? ${antec_pat_alimentos_alergias}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Tomas algún suplemento o complemento? ${antec_pat_alimentos_suplemento_complemento}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Tu alimentación varía de acuerdo a su estado de ánimo? ${antec_pat_alimentos_segun_estado_animo}`, style: 'tableHeader', colSpan: 4}],
						[{text: `¿Qué tratamientos de pérdida de peso has realizado? ¿Has usado o usas medicamentos para bajar de peso? ${antec_pat_tratam_perdida_peso}`, style: 'tableHeader', colSpan: 4}],
					]
				}
			},
			
			{
				text: `Despiertas a las:  ${horaDeDespierto.length>0?dayjs(horaDeDespierto, 'HH:mm').format('hh:mm A'):''}`,
				style:'subSubTitle',
				pageBreak: 'before'
			},
			{
				style: 'tableExample',
				table: {
					widths: ['*', '*', '*'],
					body: [
						[
							{text: 'TIEMPO DE COMIDA', style: 'tableHeader'}, 
							{text: 'ALIMENTACION ACTUAL', style: 'tableHeader'}, 
							{text: 'PLAN ALIMENTARIO', style: 'tableHeader'}
						],
						[
							{text: 'DESAYUNO', alignment: 'center', style: 'tableHeader'},  // Segunda fila de la primera columna
							{text: `${alimentacion_actual_desayuno}`, rowSpan: 3},  // Esta celda abarca las siguientes 3 filas
							{text: `${alimentacion_plan_desayuno}`, rowSpan: 3}   // Esta celda también abarca las siguientes 3 filas
						],
						[
							{text: `Horario : ${horario_desayuno.length>0?dayjs(horario_desayuno, 'HH:mm').format('hh:mm A'):''}`, style: 'tableHeader'},  // Tercera fila de la primera columna
							{},  // Celda vacía porque "rowSpan" ya abarca esta fila
							{}  // Celda vacía porque "rowSpan" ya abarca esta fila
						],
						[
							{text: `Lugar : ${lugar_desayuno}`, style: 'tableHeader'},  // Cuarta fila de la primera columna
							{},  // Celda vacía
							{}  // Celda vacía
						],
						[
							{text: 'MEDIA MAÑANA', alignment: 'center', style: 'tableHeader'},  // Segunda fila de la primera columna
							{text: `${alimentacion_actual_media_maniana}`, rowSpan: 3},  // Esta celda abarca las siguientes 3 filas
							{text: `${alimentacion_plan_media_maniana}`, rowSpan: 3}   // Esta celda también abarca las siguientes 3 filas
						],
						[
							{text: `Horario : ${horario_media_maniana.length>0?dayjs(horario_media_maniana, 'HH:mm').format('hh:mm A'):''}`, style: 'tableHeader'},  // Tercera fila de la primera columna
							{},  // Celda vacía porque "rowSpan" ya abarca esta fila
							{}  // Celda vacía porque "rowSpan" ya abarca esta fila
						],
						[
							{text: `Lugar : ${lugar_media_maniana}`, style: 'tableHeader'},  // Cuarta fila de la primera columna
							{},  // Celda vacía
							{}  // Celda vacía
						],
						[
							{text: 'ALMUERZO', alignment: 'center', style: 'tableHeader'},  // Segunda fila de la primera columna
							{text: `${alimentacion_actual_almuerzo}`, rowSpan: 3},  // Esta celda abarca las siguientes 3 filas
							{text: `${alimentacion_plan_almuerzo}`, rowSpan: 3}   // Esta celda también abarca las siguientes 3 filas
						],
						[
							{text: `Horario : ${ horario_almuerzo.length>0?dayjs(horario_almuerzo, 'HH:mm').format('hh:mm A'):''}`, style: 'tableHeader'},  // Tercera fila de la primera columna
							{},  // Celda vacía porque "rowSpan" ya abarca esta fila
							{}  // Celda vacía porque "rowSpan" ya abarca esta fila
						],
						[
							{text: `Lugar : ${lugar_almuerzo}`, style: 'tableHeader'},  // Cuarta fila de la primera columna
							{},  // Celda vacía
							{}  // Celda vacía
						],
						[
							{text: 'MEDIA TARDE', alignment: 'center', style: 'tableHeader'},  // Segunda fila de la primera columna
							{text: `${alimentacion_actual_media_tarde}`, rowSpan: 3},  // Esta celda abarca las siguientes 3 filas
							{text: `${alimentacion_plan_media_tarde}`, rowSpan: 3}   // Esta celda también abarca las siguientes 3 filas
						],
						[
							{text: `Horario : ${ horario_media_tarde.length>0?dayjs(horario_media_tarde, 'HH:mm').format('hh:mm A'):''}`, style: 'tableHeader'},  // Tercera fila de la primera columna
							{},  // Celda vacía porque "rowSpan" ya abarca esta fila
							{}  // Celda vacía porque "rowSpan" ya abarca esta fila
						],
						[
							{text: `Lugar : ${lugar_media_tarde}`, style: 'tableHeader'},  // Cuarta fila de la primera columna
							{},  // Celda vacía
							{}  // Celda vacía
						],
						[
							{text: 'CENA', alignment: 'center', style: 'tableHeader'},  // Segunda fila de la primera columna
							{text: `${alimentacion_actual_cena}`, rowSpan: 3},  // Esta celda abarca las siguientes 3 filas
							{text: `${alimentacion_plan_cena}`, rowSpan: 3}   // Esta celda también abarca las siguientes 3 filas
						],
						[
							{text: `Horario : ${horario_cena.length>0?dayjs(horario_cena, 'HH:mm').format('hh:mm A'):''}`, style: 'tableHeader'},  // Tercera fila de la primera columna
							{},  // Celda vacía porque "rowSpan" ya abarca esta fila
							{}  // Celda vacía porque "rowSpan" ya abarca esta fila
						],
						[
							{text: `Lugar : ${lugar_cena}`, style: 'tableHeader'},  // Cuarta fila de la primera columna
							{},  // Celda vacía
							{}  // Celda vacía
						],
						[
							{text: 'EXTRAS', alignment: 'center', style: 'tableHeader'},  // Segunda fila de la primera columna
							{text: `${alimentacion_actual_extras}`, rowSpan: 3},  // Esta celda abarca las siguientes 3 filas
							{text: `${alimentacion_plan_extras}`, rowSpan: 3}   // Esta celda también abarca las siguientes 3 filas
						],
						[
							{text: `Horario : ${horario_extras.length>0?dayjs(horario_extras, 'HH:mm').format('hh:mm A'):''}`, style: 'tableHeader'},  // Tercera fila de la primera columna
							{},  // Celda vacía porque "rowSpan" ya abarca esta fila
							{}  // Celda vacía porque "rowSpan" ya abarca esta fila
						],
						[
							{text: `Lugar : ${lugar_extras}`, style: 'tableHeader'},  // Cuarta fila de la primera columna
							{},  // Celda vacía
							{}  // Celda vacía
						],
						[{text: `vasos de agua natural al día: `, colSpan: 1}, {text: ` ${vasos_agua_x_dia}`, colSpan: 2}],
						[{text: `Consumo de gaseosa: `, colSpan: 1}, {text: `${consumo_gaseosa}`, colSpan: 2}],
						[{text: `Consumo de  dulces: ${consumo_dulces}`, colSpan: 1}, {text: `${consumo_dulces}`, colSpan: 2}],
						[{text: `Cambios por fin de semana: `, colSpan: 1}, {text: `${cambios_fin_semana}`, colSpan: 2}],
						[{text: `Hora de acostarse: ${hora_acostarse}`, colSpan: 1}, {text: `${hora_acostarse}`, colSpan: 2}],
					]
				}
			},
			{
				text: `Duerme a las: ${horaDeDormir.length>0?dayjs(horaDeDormir, 'HH:mm').format('hh:mm A'):''}`,
				style:'subSubTitle',
			},
		],
		styles: {

			tableExample: {
				// fontSize: 10
				// margin: [0, 5, 0, 15]
			},
			subTitle: {
				fontSize: 12,
				bold: true,
				margin: [4, 10, 0, 7]
			},
			subSubTitle:{
				fontSize: 12,
				bold: true
			},
			header: {
				fontSize: 18,
				bold: true,
			},
			subHeader: {
				fontSize: 13,
			},
			quote: {
				italics: true
			},
			small: {
				fontSize: 8
			}
		}
		
	}
	useEffect(() => {
		obtenerParametroPorEntidadyGrupo('NUTRICION', 'ANT.PATOLOG')
	}, [])
	const { startRegisterClinico } = useNutricionCliente()
  const onStartSubmitClinico = (e)=>{
	e.preventDefault();

	// Crear un nuevo FormData
	const formData = new FormData();
	const pdfGenerator = pdfMake.createPdf(dd)
	pdfGenerator.getBlob((blob)=>{
		// Crear un archivo para el FormData con el PDF generado
		formData.append('file', blob, `historial-clinico-${dataCli.id_cli}.pdf`);
		const url = URL.createObjectURL(blob)
		seturl(url)
		startRegisterClinico(formState, formStateAntPatNutr, formData, dataCli.id_cli)
		// pdfGenerator.download()
	})
	cancelarHClinico()
  }
  const cancelarHClinico = ()=>{
	onHide()
	onResetFormApatol()
	onResetConsulta()
  }
  return (
    <Sidebar visible={show} onHide={onHide} style={{width: '1450px'}}>
        <h2>Registrar consulta</h2>
        <form onSubmit={onStartSubmitClinico}>
				<div className="mb-2">
					<label htmlFor="dato_motivacion" className="form-label">
						MOTIVACION DEL SOCIO*
					</label>
					<textarea
						className="form-control"
						name="dato_motivacion"
						value={dato_motivacion}
						onChange={onInputChange}
						id="dato_motivacion"
					/>
				</div>
			<TabView>
				<TabPanel header='ANTECEDENTES PATOLOGICOS'>
					<ScrollPanel style={{height: '25rem'}}>
						<h4>Sufre o sufrió de alguna de estas enfermedades, dolencias o condiciones?</h4>
						<Row>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT612' onChange={onInputChangePatNutr} checked={PAT612} name={'PAT612'}/>
										<label className="form-check-label" for={`PAT612`}>
											Enf. Cardiovascular
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT613' onChange={onInputChangePatNutr} checked={PAT613} name={'PAT613'} />
										<label className="form-check-label" for={`PAT613`}>
											Hígado graso
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT614' onChange={onInputChangePatNutr} checked={PAT614} name={'PAT614'} />
										<label className="form-check-label" for={`PAT614`}>
											Osteoporosis/osteopenia
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT615' onChange={onInputChangePatNutr} checked={PAT615} name={'PAT615'} />
										<label className="form-check-label" for={`PAT615`}>
											Intestino Irritable – D
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT616' onChange={onInputChangePatNutr} checked={PAT616} name={'PAT616'} />
										<label className="form-check-label" for={`PAT616`}>
											Diabetes
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT617' onChange={onInputChangePatNutr} checked={PAT617} name={'PAT617'} />
										<label className="form-check-label" for={`PAT617`}>
											RI
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT618' onChange={onInputChangePatNutr} checked={PAT618} name={'PAT618'} />
										<label className="form-check-label" for={`PAT618`}>
											Enf. Renal
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT619' onChange={onInputChangePatNutr} checked={PAT619} name={'PAT619'} />
										<label className="form-check-label" for={`PAT619`}>
											Gota
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT620' onChange={onInputChangePatNutr} checked={PAT620} name={'PAT620'} />
										<label className="form-check-label" for={`PAT620`}>
											Nauseas/ Vómitos
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT621' onChange={onInputChangePatNutr} checked={PAT621} name={'PAT621'} />
										<label className="form-check-label" for={`PAT621`}>
											Resistencia a la insulina
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT622' onChange={onInputChangePatNutr} checked={PAT622} name={'PAT622'} />
										<label className="form-check-label" for={`PAT622`}>
											Enf. Pancreática
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT623' onChange={onInputChangePatNutr} checked={PAT623} name={'PAT623'} />
										<label className="form-check-label" for={`PAT623`}>
											Hipertiroidismo
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT624' onChange={onInputChangePatNutr} checked={PAT624} name={'PAT624'} />
										<label className="form-check-label" for={`PAT624`}>
											Falta de apetito
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT625' onChange={onInputChangePatNutr} checked={PAT625} name={'PAT625'} />
										<label className="form-check-label" for={`PAT625`}>
											Hipertensión
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT626' onChange={onInputChangePatNutr} checked={PAT626} name={'PAT626'} />
										<label className="form-check-label" for={`PAT626`}>
											Enf. Pulmonar
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT627' onChange={onInputChangePatNutr} checked={PAT627} name={'PAT627'} />
										<label className="form-check-label" for={`PAT627`}>
											Hipotiroidismo
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT628' onChange={onInputChangePatNutr} checked={PAT628} name={'PAT628'} />
										<label className="form-check-label" for={`PAT628`}>
											Gastritis y/o úlceras
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT629' onChange={onInputChangePatNutr} checked={PAT629} name={'PAT629'} />
										<label className="form-check-label" for={`PAT629`}>
											Colesterol elevado
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT630' onChange={onInputChangePatNutr} checked={PAT630} name={'PAT630'} />
										<label className="form-check-label" for={`PAT630`}>
											Cáncer
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT631' onChange={onInputChangePatNutr} checked={PAT631} name={'PAT631'} />
										<label className="form-check-label" for={`PAT631`}>
											Enfermedad autoinmune
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT632' onChange={onInputChangePatNutr} checked={PAT632} name={'PAT632'} />
										<label className="form-check-label" for={`PAT632`}>
											Estrés
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT633' onChange={onInputChangePatNutr} checked={PAT633} name={'PAT633'} />
										<label className="form-check-label" for={`PAT633`}>
											ANSIEDAD
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT634' onChange={onInputChangePatNutr} checked={PAT634} name={'PAT634'} />
										<label className="form-check-label" for={`PAT634`}>
											Triglicéridos elevados
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT635' onChange={onInputChangePatNutr} checked={PAT635} name={'PAT635'} />
										<label className="form-check-label" for={`PAT635`}>
											Migrañas
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT636' onChange={onInputChangePatNutr} checked={PAT636} name={'PAT636'} />
										<label className="form-check-label" for={`PAT636`}>
											Dificultad al masticar
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT637' onChange={onInputChangePatNutr} checked={PAT637} name={'PAT637'} />
										<label className="form-check-label" for={`PAT637`}>
											Depresión
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT638' onChange={onInputChangePatNutr} checked={PAT638} name={'PAT638'} />
										<label className="form-check-label" for={`PAT638`}>
											Insomnio
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT639' onChange={onInputChangePatNutr} checked={PAT639} name={'PAT639'} />
										<label className="form-check-label" for={`PAT639`}>
											Anemia
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT640' onChange={onInputChangePatNutr} checked={PAT640} name={'PAT640'} />
										<label className="form-check-label" for={`PAT640`}>
										Estreñimiento
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT641' onChange={onInputChangePatNutr} checked={PAT641} name={'PAT641'} />
										<label className="form-check-label" for={`PAT641`}>
										Intestino Irritable - C
										</label>
									</div>
								</Col>
								<Col xxl={3} className='my-1'>
									<div className="form-check">
										<input className="form-check-input" type="checkbox" id='PAT642' onChange={onInputChangePatNutr} checked={PAT642} name={'PAT642'} />
										<label className="form-check-label" for={`PAT642`}>
											Prostatitis
										</label>
									</div>
								</Col>
								<Col xxl={12} className='mt-2'>
									<div className="mb-2">
										<label htmlFor="antec_pat_de_algun_familiar" className="form-label">
										    ¿Algún familiar consanguíneo sufre o sufrió de alguna de estas enfermedades?
										</label>
										<textarea
											className="form-control"
											name="antec_pat_de_algun_familiar"
											value={antec_pat_de_algun_familiar}
											onChange={onInputChange}
											id="antec_pat_de_algun_familiar"
										/>
									</div>
								</Col>
						</Row>
					</ScrollPanel>
				</TabPanel>
				<TabPanel header='ESTILO DE VIDA'>
					<ScrollPanel style={{height: '25rem'}}>
						<Row>
							<Col lg={12}>
								<div className="mb-2">
									<label htmlFor="antec_pat_fumado" className="form-label">
										¿Fumas o has fumado anteriormente?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_fumado"
										value={antec_pat_fumado}
										onChange={onInputChange}
										id="antec_pat_fumado"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_consumes_farmaco" className="form-label">
										¿Consumes algún fármaco con frecuencia?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_consumes_farmaco"
										value={antec_pat_consumes_farmaco}
										onChange={onInputChange}
										id="antec_pat_consumes_farmaco"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_tomas_alcohol" className="form-label">
										¿Tomas alcohol?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_tomas_alcohol"
										value={antec_pat_tomas_alcohol}
										onChange={onInputChange}
										id="antec_pat_tomas_alcohol"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_realizas_actividad_fisica" className="form-label">
										¿Realizas actividad física?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_realizas_actividad_fisica"
										value={antec_pat_realizas_actividad_fisica}
										onChange={onInputChange}
										id="antec_pat_realizas_actividad_fisica"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_modific_tu_alimentacion_ultimos6meses" className="form-label">
										¿Modificaste tu alimentación en los últimos 6 meses?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_modific_tu_alimentacion_ultimos6meses"
										value={antec_pat_modific_tu_alimentacion_ultimos6meses}
										onChange={onInputChange}
										id="antec_pat_modific_tu_alimentacion_ultimos6meses"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_cual_es_tu_apetito" className="form-label">
										¿Cómo es tu apetito? 
									</label>
									<textarea
										className="form-control"
										name="antec_pat_cual_es_tu_apetito"
										value={antec_pat_cual_es_tu_apetito}
										onChange={onInputChange}
										id="antec_pat_cual_es_tu_apetito"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_hora_de_mas_hambre" className="form-label">
										¿A qué hora tienes más hambre?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_hora_de_mas_hambre"
										value={antec_pat_hora_de_mas_hambre}
										onChange={onInputChange}
										id="antec_pat_hora_de_mas_hambre"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_alimentos_preferidos" className="form-label">
										¿Cuáles son tus alimentos preferidos?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_alimentos_preferidos"
										value={antec_pat_alimentos_preferidos}
										onChange={onInputChange}
										id="antec_pat_alimentos_preferidos"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_alimentos_desagradables" className="form-label">
										¿Alimentos que te desagradan?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_alimentos_desagradables"
										value={antec_pat_alimentos_desagradables}
										onChange={onInputChange}
										id="antec_pat_alimentos_desagradables"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_alimentos_alergias" className="form-label">
										¿Alergia o intolerancia a algún alimento?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_alimentos_alergias"
										value={antec_pat_alimentos_alergias}
										onChange={onInputChange}
										id="antec_pat_alimentos_alergias"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_alimentos_suplemento_complemento" className="form-label">
										¿Tomas algún suplemento o complemento?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_alimentos_suplemento_complemento"
										value={antec_pat_alimentos_suplemento_complemento}
										onChange={onInputChange}
										id="antec_pat_alimentos_suplemento_complemento"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_alimentos_segun_estado_animo" className="form-label">
										¿Tu alimentación varía de acuerdo a su estado de ánimo?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_alimentos_segun_estado_animo"
										value={antec_pat_alimentos_segun_estado_animo}
										onChange={onInputChange}
										id="antec_pat_alimentos_segun_estado_animo"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="antec_pat_tratam_perdida_peso" className="form-label">
										¿Qué tratamientos de pérdida de peso has realizado? ¿Has usado o usas medicamentos para bajar de peso?
									</label>
									<textarea
										className="form-control"
										name="antec_pat_tratam_perdida_peso"
										value={antec_pat_tratam_perdida_peso}
										onChange={onInputChange}
										id="antec_pat_tratam_perdida_peso"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="vasos_agua_x_dia" className="form-label">
										Vasos de agua natural al día
									</label>
									<textarea
										className="form-control"
										name="vasos_agua_x_dia"
										value={vasos_agua_x_dia}
										onChange={onInputChange}
										id="vasos_agua_x_dia"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="consumo_gaseosa" className="form-label">
										Consumo de gaseosa
									</label>
									<textarea
										className="form-control"
										name="consumo_gaseosa"
										value={consumo_gaseosa}
										onChange={onInputChange}
										id="consumo_gaseosa"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="consumo_dulces" className="form-label">
										Consumo de dulces:
									</label>
									<textarea
										className="form-control"
										name="consumo_dulces"
										value={consumo_dulces}
										onChange={onInputChange}
										id="consumo_dulces"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="cambios_fin_semana" className="form-label">
										Cambios por fn de semana:
									</label>
									<textarea
										className="form-control"
										name="cambios_fin_semana"
										value={cambios_fin_semana}
										onChange={onInputChange}
										id="cambios_fin_semana"
									/>
								</div>
							</Col>
						</Row>
					</ScrollPanel>
				</TabPanel>
				<TabPanel header='ALIMENTACION'>
					<ScrollPanel style={{height: '25rem'}}>
						<Row>
							<Col xxl={12}>
							<Row>
								<Col xxl={2}>
									<div className="mb-2">
										<label htmlFor="horaDeDespierto" className="form-label">
											DESPIERTA A LAS:
										</label>
										<input
											className="form-control"
											type='time'
											name="horaDeDespierto"
											value={horaDeDespierto}
											onChange={onInputChange}
											id="horaDeDespierto"
										/>
									</div>
								</Col>
								<Col xxl={2}>
									<div className="mb-2">
										<label htmlFor="horaDeDormir" className="form-label">
											DUERME A LAS:
										</label>
										<input
											className="form-control"
											type='time'
											name="horaDeDormir"
											value={horaDeDormir}
											onChange={onInputChange}
											id="horaDeDormir"
										/>
									</div>
								</Col>

							</Row>
							</Col>

							<Col xxl={2} className='border-right-2'>
								<h4 className='text-center'>DESAYUNO</h4>
								<div className="mb-2">
									<label htmlFor="horario_desayuno" className="form-label">
										Horario
									</label>
									<input
										className="form-control"
										type='time'
										name="horario_desayuno"
										value={horario_desayuno}
										onChange={onInputChange}
										id="horario_desayuno"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="lugar_desayuno" className="form-label">
										Lugar
									</label>
									<input
										className="form-control"
										type='text'
										name="lugar_desayuno"
										value={lugar_desayuno}
										onChange={onInputChange}
										id="lugar_desayuno"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_actual_desayuno" className="form-label">
										ALIMENTACION ACTUAL
									</label>
									<textarea
										className="form-control"
										name="alimentacion_actual_desayuno"
										value={alimentacion_actual_desayuno}
										onChange={onInputChange}
										id="alimentacion_actual_desayuno"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_plan_desayuno" className="form-label">
										PLAN ALIMENTARIO
									</label>
									<textarea
										className="form-control"
										name="alimentacion_plan_desayuno"
										value={alimentacion_plan_desayuno}
										onChange={onInputChange}
										id="alimentacion_plan_desayuno"
									/>
								</div>
							</Col>
							<Col xxl={2} className='border-right-2'>
								<h4 className='text-center'>MEDIA MAÑANA</h4>
								<div className="mb-2">
									<label htmlFor="horario_media_maniana" className="form-label">
										Horario
									</label>
									<input
										className="form-control"
										type='time'
										name="horario_media_maniana"
										value={horario_media_maniana}
										onChange={onInputChange}
										id="horario_media_maniana"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="lugar_media_maniana" className="form-label">
										Lugar
									</label>
									<input
										className="form-control"
										type='text'
										name="lugar_media_maniana"
										value={lugar_media_maniana}
										onChange={onInputChange}
										id="lugar_media_maniana"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_actual_media_maniana" className="form-label">
										ALIMENTACION ACTUAL
									</label>
									<textarea
										className="form-control"
										name="alimentacion_actual_media_maniana"
										value={alimentacion_actual_media_maniana}
										onChange={onInputChange}
										id="alimentacion_actual_media_maniana"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_plan_media_maniana" className="form-label">
										PLAN ALIMENTARIO
									</label>
									<textarea
										className="form-control"
										name="alimentacion_plan_media_maniana"
										value={alimentacion_plan_media_maniana}
										onChange={onInputChange}
										id="alimentacion_plan_media_maniana"
									/>
								</div>
							</Col>
							<Col xxl={2} className='border-right-2'>
								<h4 className='text-center'>ALMUERZO</h4>
								<div className="mb-2">
									<label htmlFor="horario_almuerzo" className="form-label">
										Horario
									</label>
									<input
										className="form-control"
										type='time'
										name="horario_almuerzo"
										value={horario_almuerzo}
										onChange={onInputChange}
										id="horario_almuerzo"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="lugar_almuerzo" className="form-label">
										Lugar
									</label>
									<input
										className="form-control"
										type='text'
										name="lugar_almuerzo"
										value={lugar_almuerzo}
										onChange={onInputChange}
										id="lugar_almuerzo"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_actual_almuerzo" className="form-label">
										ALIMENTACION ACTUAL
									</label>
									<textarea
										className="form-control"
										name="alimentacion_actual_almuerzo"
										value={alimentacion_actual_almuerzo}
										onChange={onInputChange}
										id="alimentacion_actual_almuerzo"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_plan_almuerzo" className="form-label">
										PLAN ALIMENTARIO
									</label>
									<textarea
										className="form-control"
										name="alimentacion_plan_almuerzo"
										value={alimentacion_plan_almuerzo}
										onChange={onInputChange}
										id="alimentacion_plan_almuerzo"
									/>
								</div>
							</Col>
							<Col xxl={2} className='border-right-2'>
								<h4 className='text-center'>MEDIA TARDE</h4>
								<div className="mb-2">
									<label htmlFor="horario_media_tarde" className="form-label">
										Horario
									</label>
									<input
										className="form-control"
										type='time'
										name="horario_media_tarde"
										value={horario_media_tarde}
										onChange={onInputChange}
										id="horario_media_tarde"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="lugar_media_tarde" className="form-label">
										Lugar
									</label>
									<input
										className="form-control"
										type='text'
										name="lugar_media_tarde"
										value={lugar_media_tarde}
										onChange={onInputChange}
										id="lugar_media_tarde"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_actual_media_tarde" className="form-label">
										ALIMENTACION ACTUAL
									</label>
									<textarea
										className="form-control"
										name="alimentacion_actual_media_tarde"
										value={alimentacion_actual_media_tarde}
										onChange={onInputChange}
										id="alimentacion_actual_media_tarde"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_plan_media_tarde" className="form-label">
										PLAN ALIMENTARIO
									</label>
									<textarea
										className="form-control"
										name="alimentacion_plan_media_tarde"
										value={alimentacion_plan_media_tarde}
										onChange={onInputChange}
										id="alimentacion_plan_media_tarde"
									/>
								</div>
							</Col>
							<Col xxl={2} className='border-right-2'>
								<h4 className='text-center'>CENA</h4>
								<div className="mb-2">
									<label htmlFor="horario_cena" className="form-label">
										Horario
									</label>
									<input
										className="form-control"
										type='time'
										name="horario_cena"
										value={horario_cena}
										onChange={onInputChange}
										id="horario_cena"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="lugar_cena" className="form-label">
										Lugar
									</label>
									<input
										className="form-control"
										type='text'
										name="lugar_cena"
										value={lugar_cena}
										onChange={onInputChange}
										id="lugar_cena"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_actual_cena" className="form-label">
										ALIMENTACION ACTUAL
									</label>
									<textarea
										className="form-control"
										name="alimentacion_actual_cena"
										value={alimentacion_actual_cena}
										onChange={onInputChange}
										id="alimentacion_actual_cena"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_plan_cena" className="form-label">
										PLAN ALIMENTARIO
									</label>
									<textarea
										className="form-control"
										name="alimentacion_plan_cena"
										value={alimentacion_plan_cena}
										onChange={onInputChange}
										id="alimentacion_plan_cena"
									/>
								</div>
							</Col>
							<Col xxl={2} className='border-right-2'>
								<h4 className='text-center'>EXTRAS</h4>
								<div className="mb-2">
									<label htmlFor="horario_extras" className="form-label">
										Horario
									</label>
									<input
										className="form-control"
										type='time'
										name="horario_extras"
										value={horario_extras}
										onChange={onInputChange}
										id="horario_extras"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="lugar_extras" className="form-label">
										Lugar
									</label>
									<input
										className="form-control"
										type='text'
										name="lugar_extras"
										value={lugar_extras}
										onChange={onInputChange}
										id="lugar_extras"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_actual_extras" className="form-label">
										ALIMENTACION ACTUAL
									</label>
									<textarea
										className="form-control"
										name="alimentacion_actual_extras"
										value={alimentacion_actual_extras}
										onChange={onInputChange}
										id="alimentacion_actual_extras"
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="alimentacion_plan_extras" className="form-label">
										PLAN ALIMENTARIO
									</label>
									<textarea
										className="form-control"
										name="alimentacion_plan_extras"
										value={alimentacion_plan_extras}
										onChange={onInputChange}
										id="alimentacion_plan_extras"
									/>
								</div>
							</Col>
							
						</Row>
					</ScrollPanel>
				</TabPanel>
			</TabView>
			
			<Button type="submit">Agregar consulta</Button>
			<a className='text-primary mx-3 cursor-pointer' onClick={cancelarHClinico}>Cancelar</a>
		</form>
    </Sidebar>
  )
}
