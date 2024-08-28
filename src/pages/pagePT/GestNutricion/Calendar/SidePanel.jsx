import classNames from 'classnames';
import { externalEvents } from './data';
import { Card, CardTitle, Col, Row } from 'react-bootstrap';
import { CustomDatePicker } from '@/components';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { onChangeDaySelected } from '@/store/calendar/calendarSlice';

const SidePanel = () => {
	const [daySelected, setdaySelected] = useState(new Date())
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(onChangeDaySelected(daySelected))
	}, [daySelected])
	
	return (
		<>
		<Card style={{margin: '0', padding: '0'}}>
			<Card.Body style={{margin: '0', padding: '0'}}>
				<CardTitle
					title="Your Calendar"
				/>
				<Row>
					<Col md={12} className="calendar-widget">
						<CustomDatePicker
							value={daySelected}
							onChange={(date) => setdaySelected(date)}
							inline
						/>
					</Col>
				</Row>
			</Card.Body>
		</Card>
		</>
	);
};

export default SidePanel;
