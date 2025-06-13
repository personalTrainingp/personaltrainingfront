import { Row, Col, Card, Button } from 'react-bootstrap';
import '@fullcalendar/react';
import FullCalendarWidget from './FullCalendarWidget';
import AddEditEvent from './AddEditEvent';
import { useCalendar } from './hooks';
import SidePanel from './SidePanel';
import { PageBreadcrumb } from '@/components';
import App from '../Calendar2/App';
import pptNut from './Área de nutrición Change - Cambios.pptx (2).pdf'
export const CalendarApp = ({tipo_serv}) => {
	const {
		isOpen,
		onOpenModal,
		onCloseModal,
		isEditable,
		eventData,
		events,
		onDateClick,
		onEventClick,
		onDrop,
		onEventDrop,
		onUpdateEvent,
		onRemoveEvent,
		onAddEvent,
	} = useCalendar();

	return (
		<>
			<PageBreadcrumb title={tipo_serv=='NUTRI'?"Agenda Nutricionista": "tratamientos esteticos"} subName="Apps" />

			<Row>
				<Col>
					<Card>
						<Card.Body style={{height: '100%'}}>
							<Row>
								<Col xl={4}>
									<SidePanel />
									<div className='bg-primary' style={{width: '100%'}}>
										<h1 className='text-center'>
											PRIMERA CITA: <br/> <span className='fs-2'>30 MINUTOS</span>
										</h1>
										<h1 className='text-center'>
											CITA DE SEGUIMIENTO: <br/><span className='fs-2'>20 MINUTOS</span>
										</h1>
									</div>
									<div className='text-center'>
										<a href={pptNut} className='fs-4 underline'>
											Ayuda memoria pendientes nutricion
										</a>
									</div>
								</Col>
								<Col xl={8}>
								
								<div id="leyenda">
										<div className='container-leyenda'>
											<div id="columna">
												<div className="cuadrado leyenda-confirmada"></div>
												<span id="titulo-ayuda-leyenda">Confirmada</span>
											</div>
											<div id="columna">
												<div className="cuadrado leyenda-asistio cuadrado"></div>
												<span id="titulo-ayuda-leyenda">Asistió</span>
											</div>
											<div id="columna">
												<div className="cuadrado leyenda-cancelada"></div>
												<span id="titulo-ayuda-leyenda">Cancelada</span>
											</div>
											<div id="columna">
												<div className="cuadrado leyenda-no-asistio cuadrado"></div>
												<span id="titulo-ayuda-leyenda">No asistió</span>
											</div>
										</div>
									</div>
									<br/>
									{/* fullcalendar control */}
									<App
										onDateClick={onDateClick}
										onEventClick={onEventClick}
										onDrop={onDrop}
										onEventDrop={onEventDrop}
										events={events}
										tipo_serv={tipo_serv}
									/>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* add new event modal */}
		</>
	);
};
