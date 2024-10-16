import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="footer">
			<div className="container-fluid">
				<Row>
					<Col md={6}>{currentYear} © Hyper - Coderthemes.com</Col>
					<Col md={6}>
						<div className="text-md-end footer-links d-none d-md-block">
							<Link to="https://coderthemes.com" target="_blank">
								About
							</Link>
							&nbsp;
							<Link to="https://coderthemes.com" target="_blank">
								Support
							</Link>
							&nbsp;
							<Link to="https://coderthemes.com" target="_blank">
								Contact Us
							</Link>
						</div>
					</Col>
				</Row>
			</div>
		</footer>
	);
}
