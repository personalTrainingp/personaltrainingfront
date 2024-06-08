import { Card, Col, Row } from 'react-bootstrap';
import cardBg from '@/assets/images/bg-pattern.png';

const ProgramaContainer = ({imgUrl}) => {
	return (
		<Card className="bg-black card-bg-img" style={{ backgroundImage: `url(${cardBg})` }}>
			<Card.Body>
				<div className='d-flex justify-content-center'>
				<img src={imgUrl} width={200} height={100}></img>
				</div>
			</Card.Body>
		</Card>
	);
};

export default ProgramaContainer;
