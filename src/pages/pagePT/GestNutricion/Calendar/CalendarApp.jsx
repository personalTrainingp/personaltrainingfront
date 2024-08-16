import { Row, Col, Card, Button } from 'react-bootstrap';
import '@fullcalendar/react';
import FullCalendarWidget from './FullCalendarWidget';
import AddEditEvent from './AddEditEvent';
import { useCalendar } from './hooks';
import SidePanel from './SidePanel';
import { PageBreadcrumb } from '@/components';

const CalendarApp = ({tipo_serv}) => {
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
			<PageBreadcrumb title={tipo_serv=='NUTRI'?"Crear citas Nutricionista": "tratamientos esteticos"} subName="Apps" />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Row>
								<Col xl={3}>
									<SidePanel />
									{/* <div className="d-grid">
										<Card>
											<Card.Header>
                                                <Card.Title as="h5">
                                                    <i className="mdi mdi-calendar-clock me-2"></i>
                                                    Leyenda
                                                </Card.Title>
                                            </Card.Header>
                                            <Card.Body>
												<div className="chart-widget-list">
												<p>
													<i className="mdi mdi-square leyenda-confirmada cuadrado"></i> Confirmada
												</p>
												<p>
													<i className="mdi mdi-square leyenda-cancelada cuadrado"></i> Cancelada
												</p>
												<p className="mb-0">
													<i className="mdi mdi-square leyenda-asistio cuadrado"></i> Asistio
												</p>
												<p className="mb-0">
													<i className="mdi mdi-square leyenda-no-asistio cuadrado"></i> No asistio
												</p>
												</div>
                                            </Card.Body>
										</Card>
									</div> */}
								</Col>
								<Col xl={9}>
								
								<div id="leyenda">
										<div className='container-leyenda'>
											<div id="columna">
												<div className="cuadrado leyenda-confirmada"></div>
												<span id="titulo-ayuda-leyenda">Confirmada</span>
											</div>
											<div id="columna">
												<div className="cuadrado leyenda-cancelada"></div>
												<span id="titulo-ayuda-leyenda">Cancelada</span>
											</div>
											<div id="columna">
												<div className="cuadrado leyenda-asistio cuadrado"></div>
												<span id="titulo-ayuda-leyenda">Asistio</span>
											</div>
											<div id="columna">
												<div className="cuadrado leyenda-no-asistio cuadrado"></div>
												<span id="titulo-ayuda-leyenda">No asistio</span>
											</div>
										</div>
									</div>
									<br/>
									{/* fullcalendar control */}
									<FullCalendarWidget
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

export { CalendarApp };
