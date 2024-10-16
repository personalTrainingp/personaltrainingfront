import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { ModalSemana } from './ModalSemana';
import { ItemSemana } from './GestSemanas/ItemSemana';
import { LayoutTarifa } from './LayoutTarifa';

export const SemanasPrograma = ({data, idpgm, uidPgm}) => {
	const [select_SEMANA_ID, setselect_SEMANA_ID] = useState(0)
	const [selectSEMANA, setselectSEMANA] = useState({})
	const columns = [
		{
			name: 'Horario',
			selector: (row) => row.time_HorarioPgm,
		},
		{
			name: 'Aforo',
			selector: (row) => row.aforo_HorarioPgm,
		},
		{
			name: 'Entrenador',
			selector: (row) => row.trainer_HorarioPgm,
		},
		{
			name: 'Estado',
			selector: (row) => row.estado_HorarioPgm,
		},
	];
	const [isOpenModalSemana, setIsOpenModalSemana] = useState(false);
	const [isOpenModalSemanaUpdate, setIsOpenModalSemanaUpdate] = useState(false)
	const onOpenModalSemana = () => {
		setIsOpenModalSemana(true);
	};
	const onCloseModalSemana = () => {
		setIsOpenModalSemana(false);
	};
	const onOpenModalxSEMANA = (id)=>{
		setselect_SEMANA_ID(id);
		setIsOpenModalSemanaUpdate(true)
	}
	useEffect(() => {
		const semanaSELECT = data?.find(objeto => objeto.id_st === select_SEMANA_ID)
		setselectSEMANA(semanaSELECT)
	}, [select_SEMANA_ID])
	console.log(selectSEMANA);
	return (
		<>
			<Row className='m-4'>
				<Col lg={12}>
					<Button onClick={onOpenModalSemana} className='m-2'>Agregar semana</Button>
				</Col>
        <Col lg={12}>
        <ModalSemana show={isOpenModalSemana} onHide={onCloseModalSemana} idpgm={idpgm} uidPgm={uidPgm} />
        <Row>
			<Col lg={4} xl={3} >
			{
				data?.map(e=>{
					return (
						<Col lg={12} key={e.id_st}>
							<ItemSemana dataItem={e} onClick={()=>onOpenModalxSEMANA(e.id_st)}/>
						</Col>
					)
				})
			}
			</Col>
			<Col lg={8} xl={9}>
				{selectSEMANA?.tb_tarifa_trainings !== undefined  && (
					<LayoutTarifa data={selectSEMANA?.tb_tarifa_trainings}/>
				)

				}
			</Col>
			{/* <ModalSemanaUpdate show={isOpenModalSemanaUpdate} onHide={()=>setIsOpenModalSemanaUpdate(false)} select_SEMANA_ID={select_SEMANA_ID}/> */}
        </Row>
        </Col>
			</Row>
		</>
	);
};
