import { Card, Col } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';

const Statistics = ({ statisticsData }) => {
	return (
		<>
			{(statisticsData || []).map((statistics, index) => {
				return (
					<Col xl={3} sm={6} key={index.toString()}>
						<Card>
							<Card.Body>
								<CardTitle
									containerClass="d-flex align-items-center justify-content-between"
									title={
										<>
											<div className="flex-shrink-0 me-3">
												<div className="avatar-sm">
													<span
														className={classNames(
															'avatar-title',
															'bg-' + statistics.variant + '-lighten',
															'text-' + statistics.variant,
															'rounded'
														)}
													>
														<i
															className={classNames(
																statistics.icon,
																'font-24'
															)}
														></i>
													</span>
												</div>
											</div>
											<div className="flex-grow-1">
												<h4 className="mt-0 mb-1">{statistics.title}</h4>
												<p className="mb-0">{statistics.noOfProject}</p>
											</div>
										</>
									}
								/>
							</Card.Body>
						</Card>
					</Col>
				);
			})}
		</>
	);
};

export default Statistics;
