import { Link } from 'react-router-dom';
import { Row, Col, Card, Container } from 'react-bootstrap';
import notFoundImg from '@/assets/images/svg/startman.svg';
import Logo from '@/assets/images/logo.png';
import { BGCircles, PageBreadcrumb } from '@/components';

const ServerError = () => {
	return (
		<>
			<PageBreadcrumb title="Server Error" />
			<BGCircles />

			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
				<Container>
					<Row className="justify-content-center">
						<Col md={8} lg={6} xl={5} xxl={4}>
							<Card>
								<Card.Header className="py-4 text-center bg-primary">
									<Link to="/">
										<span>
											<img src={Logo} alt="logo" height={22} />
										</span>
									</Link>
								</Card.Header>

								<Card.Body className="p-4">
									<div className="text-center">
										<img src={notFoundImg} height="120" alt="" />

										<h1 className="text-error mt-4">500</h1>
										<h4 className="text-uppercase text-danger mt-3">
											Internal Server Error
										</h4>
										<p className="text-muted mt-3">
											Why not try refreshing your page? or you can contact
											<Link to="" className="text-muted">
												<b>Support</b>
											</Link>
										</p>

										<Link className="btn btn-info mt-3" to="/">
											<i className="mdi mdi-reply"></i> Return Home
										</Link>
									</div>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>

			<footer className="footer footer-alt">
				2018 - {new Date().getFullYear()} © Hyper - Coderthemes.com
			</footer>
		</>
	);
};

export default ServerError;
