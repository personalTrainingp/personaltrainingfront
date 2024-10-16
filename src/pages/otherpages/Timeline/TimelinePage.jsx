import { Row, Col } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { Fragment } from 'react';
import { timelineData } from './data';

const TimelinePage = () => {
	return (
		<>
			<PageBreadcrumb title="Timeline" subName="Pages" />

			<Row className="justify-content-center">
				<Col>
					<div className="timeline">
						{Object.keys(timelineData).map((day, idx) => {
							return (
								<Fragment key={idx}>
									<div className="timeline-show mb-3 text-center">
										<h5 className="m-0 time-show-name">{day}</h5>
									</div>

									{(timelineData[day] || []).map((item, idx) => {
										return (
											<div
												key={idx}
												className={`timeline-lg-item ${
													idx % 2 === 0 ? 'timeline-item-left' : ''
												}`}
											>
												<div className="timeline-desk">
													<div className="timeline-box">
														<span className="arrow-alt"></span>
														<span className="timeline-icon">
															<i className="mdi mdi-adjust"></i>
														</span>
														<h4 className="mt-0 mb-1 font-16">
															{item.title}
														</h4>
														<p className="text-muted">
															<small>{item.date}</small>
														</p>
														<p>{item.text}</p>

														{item.images && (
															<div className="timeline-album mb-3 d-flex gap-1">
																{(item.images || []).map(
																	(img, idx) => {
																		return (
																			<span
																				key={idx}
																				className="cursor-pointer"
																			>
																				<img
																					alt=""
																					src={img}
																				/>
																			</span>
																		);
																	}
																)}
															</div>
														)}

														{item.reactions &&
															(item.reactions || []).map(
																(item, idx) => {
																	return (
																		<button
																			key={idx}
																			className="btn btn-sm btn-light me-1"
																		>
																			<span
																				role="img"
																				aria-label="thumbs-up"
																			>
																				{item.emoji}
																			</span>
																			{item.count}
																		</button>
																	);
																}
															)}

														{item.user && (
															<div className="d-flex">
																<img
																	src={item.user.image}
																	alt="Arya S"
																	className="rounded-circle me-2"
																	height="24"
																/>
																<div>
																	<h5 className="mt-1 font-14 mb-0">
																		{item.user.name}
																		<small>
																			- {item.user.position}
																		</small>
																	</h5>
																</div>
															</div>
														)}
													</div>
												</div>
											</div>
										);
									})}
								</Fragment>
							);
						})}
					</div>
				</Col>
			</Row>
		</>
	);
};

export { TimelinePage };
