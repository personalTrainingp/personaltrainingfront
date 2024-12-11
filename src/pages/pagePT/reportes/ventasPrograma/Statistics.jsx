import { Card, Col } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';

const Statistics = ({ statisticsData, onModalOpenCuadroVentas }) => {
	return (
		<>
			{(statisticsData || []).map((statistics, index) => {
				return (
					<Col xl={3} sm={6} key={index.toString()}>
						<Card style={{height: '120px', paddingTop: '20px'}} onClick={()=>onModalOpenCuadroVentas(statistics.title, statistics.noOfProject)}>
							<Card.Body>
								<div className='d-flex flex-row'>
											<div className="flex-shrink-0 me-3">
												{
													statistics.icon &&(
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

													)
												}
											</div>
								<div className="flex-grow-1">
									<div className="flex-grow-1">
										<h4 className="mt-0 mb-1 fs-3 text-primary">{statistics.title}</h4>
									</div>
									<p className="mb-0 fs-2">{statistics.noOfProject.length}</p>
								</div>
								</div>
							</Card.Body>
						</Card>
					</Col>
				);
			})}
		</>
	);
};

export default Statistics;
