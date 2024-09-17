import { Row, Col, Card, Button } from 'react-bootstrap';
import '@fullcalendar/react';
import FullCalendarWidget from './FullCalendarWidget';
import { useCalendar } from './hooks';
import SidePanel from './SidePanel';
import { PageBreadcrumb } from '@/components';

const CalendarApp = () => {
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
			<PageBreadcrumb title="Crear citas para tratamientos estéticos" subName="Apps" />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Row>
								<Col xl={3}>
									<SidePanel />
									<div className="d-grid">
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
													<i className="mdi mdi-square leyenda-confirmada"></i> Confirmada
												</p>
												<p>
													<i className="mdi mdi-square leyenda-cancelada"></i> Cancelada
												</p>
												<p className="mb-0">
													<i className="mdi mdi-square leyenda-asistio"></i> Asistió
												</p>
												<p className="mb-0">
													<i className="mdi mdi-square leyenda-no-asistio"></i> No asistió
												</p>
												</div>
                                            </Card.Body>
										</Card>
									</div>
								</Col>
								<Col xl={9}>
									{/* fullcalendar control */}
									<FullCalendarWidget
										onDateClick={onDateClick}
										onEventClick={onEventClick}
										onDrop={onDrop}
										onEventDrop={onEventDrop}
										events={events}
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
