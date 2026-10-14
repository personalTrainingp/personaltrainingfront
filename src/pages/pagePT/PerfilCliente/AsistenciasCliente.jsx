import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { PTApi } from '@/common';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import { estiloLabel } from '../GestionEventosAsistencia/DataTableEventosAsistencia';

// Marcaciones del cliente en los huelleros (por su DNI): resumen + historial
export const AsistenciasCliente = ({ uid }) => {
	const [eventos, seteventos] = useState([]);
	const [dni, setdni] = useState(null);
	const [isLoading, setisLoading] = useState(false);
	const [error, seterror] = useState('');

	useEffect(() => {
		const obtenerAsistencias = async () => {
			try {
				setisLoading(true);
				seterror('');
				const { data } = await PTApi.get(`/eventos-asistencia/cliente/${uid}`);
				seteventos(data.eventos);
				setdni(data.dni);
			} catch (error) {
				console.log(error);
				seteventos([]);
				seterror(error.response?.data?.msg || 'No se pudieron obtener las asistencias');
			} finally {
				setisLoading(false);
			}
		};
		obtenerAsistencias();
	}, [uid]);

	const resumen = useMemo(() => {
		const dias = new Set(eventos.map((e) => e.fecha));
		const mesActual = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date()).slice(0, 7);
		return {
			marcaciones: eventos.length,
			dias: dias.size,
			diasMes: [...dias].filter((f) => f.startsWith(mesActual)).length,
			ultima: eventos[0] ? `${eventos[0].fecha} ${eventos[0].hora}` : '—',
		};
	}, [eventos]);

	const columns = [
		{ id: 'fecha', header: 'Fecha', accessor: 'fecha', sortable: true, width: 100, headerAlign: 'left', cellAlign: 'left' },
		{ id: 'hora', header: 'Hora', accessor: 'hora', sortable: true, width: 80, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'labelEstado',
			header: 'Estado',
			accessor: (row) => row.labelEstado || '',
			sortable: true,
			width: 180,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => {
				const e = estiloLabel(row.labelEstado);
				return e ? (
					<Badge bg={e.bg} style={e.style} title={e.ayuda}>
						<i className={`pi ${e.icono} me-1`} style={{ fontSize: '0.7rem' }} />
						{row.labelEstado}
					</Badge>
				) : null;
			},
		},
		{ id: 'huellero', header: 'Huellero', accessor: 'huellero', sortable: true, width: 120, headerAlign: 'left', cellAlign: 'left' },
	];

	if (error) return <div className="text-danger p-3">{error}</div>;
	if (!isLoading && !dni) return <div className="text-muted p-3">El cliente no tiene DNI registrado: no se pueden vincular sus marcaciones.</div>;

	const tarjetas = [
		{ titulo: 'Días asistidos', valor: resumen.dias },
		{ titulo: 'Días este mes', valor: resumen.diasMes },
		{ titulo: 'Marcaciones', valor: resumen.marcaciones },
		{ titulo: 'Última asistencia', valor: resumen.ultima },
	];
	return (
		<>
			<Row className="mb-3">
				{tarjetas.map((t) => (
					<Col key={t.titulo} xs={6} md={3}>
						<Card className="p-2 mb-2 text-center">
							<span className="text-muted">{t.titulo}</span>
							<span className="fs-4 fw-bold">{isLoading ? '…' : t.valor}</span>
						</Card>
					</Col>
				))}
			</Row>
			<DataTableCR
				columns={columns}
				data={eventos}
				loading={isLoading}
				defaultPageSize={25}
				pageSizeOptions={[10, 25, 50, 100]}
				striped={false}
				small
				responsive
				verticalBorders
				rowKey="id"
				emptyMessage="El cliente no tiene marcaciones en los huelleros"
				exportFileName={`asistencias-${dni || uid}`}
			/>
		</>
	);
};
