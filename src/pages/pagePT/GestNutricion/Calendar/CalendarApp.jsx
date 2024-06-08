import { Row, Col, Card, Button } from 'react-bootstrap';
import '@fullcalendar/react';
import FullCalendarWidget from './FullCalendarWidget';
import AddEditEvent from './AddEditEvent';
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
			<PageBreadcrumb title="Crear citas" subName="Apps" />

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
                                                    Citas que siguen
                                                </Card.Title>
                                            </Card.Header>
                                            <Card.Body>
												
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
