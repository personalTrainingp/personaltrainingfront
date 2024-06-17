import { PageBreadcrumb, Table } from '@/components';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { ModalMeta } from './ModalMeta';
import { columns, sizePerPageList } from './ColumnsSet';
import { useSelector } from 'react-redux';
import { useMetaStore } from '@/hooks/hookApi/useMetaStore';
import { useDispatch } from 'react-redux';
import Nouislider from 'nouislider-react';
import { Divider } from 'primereact/divider';

export const GestMetas = () => {
	const [isModalOpenMetas, setIsModalOpenMetas] = useState(false);
	const dispatch = useDispatch();
	const { dataMetas } = useSelector((e) => e.meta);
	const { obtenerMetas } = useMetaStore();
	const hideModal = () => {
		setIsModalOpenMetas(false);
	};
	const showModal = () => {
		setIsModalOpenMetas(true);
	};
	useEffect(() => {
		obtenerMetas();
	}, []);

	return (
		<>
			<PageBreadcrumb title="Metas" subName="E" />
                <Button onClick={showModal}>Agregar meta</Button>
			<Card>
				<div className="flex justify-content-center p-2">
					<Divider align="left">
						<div className="inline-flex align-items-center">
							<b className='fs-3'>Sin Iniciar</b>
						</div>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quis
							pariatur, veniam non sit quasi dolor iste dicta voluptatem perferendis
							excepturi rem reiciendis vero facilis doloremque, dignissimos incidunt.
							Ea consectetur corrupti id illum omnis consequatur adipisci harum sequi,
							sit magnam dignissimos eaque ipsum quaerat maxime cumque exercitationem
							esse, voluptates quam.
						</p>
					</Divider>
					<Divider layout="vertical" />
                    <Divider align="left">
						<div className="inline-flex align-items-center">
							<b className='fs-3'>En progreso</b>
						</div>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quis
							pariatur, veniam non sit quasi dolor iste dicta voluptatem perferendis
							excepturi rem reiciendis vero facilis doloremque, dignissimos incidunt.
							Ea consectetur corrupti id illum omnis consequatur adipisci harum sequi,
							sit magnam dignissimos eaque ipsum quaerat maxime cumque exercitationem
							esse, voluptates quam.
						</p>
					</Divider>
					<Divider layout="vertical" />
					<Divider align="left">
						<div className="inline-flex align-items-center">
							<b className='fs-3'>Completado</b>
						</div>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quis
							pariatur, veniam non sit quasi dolor iste dicta voluptatem perferendis
							excepturi rem reiciendis vero facilis doloremque, dignissimos incidunt.
							Ea consectetur corrupti id illum omnis consequatur adipisci harum sequi,
							sit magnam dignissimos eaque ipsum quaerat maxime cumque exercitationem
							esse, voluptates quam.
						</p>
					</Divider>
				</div>
			</Card>
			<ModalMeta show={isModalOpenMetas} onHide={hideModal} />
		</>
	);
};
