import { ThemeSettings } from '@/common';
import { Form, Row } from 'react-bootstrap';

const LayoutTheme = ({
	handleChangeLayoutTheme,
	layoutTheme,
	layoutConstants,
}) => {
	return (
		<>
			<h5 className="my-3 font-16 fw-bold">Color Scheme</h5>

			<div className="colorscheme-cardradio">
				<Row>
					<div className="col-4">
						<Form.Check className="card-radio">
							<Form.Check.Input
								type="radio"
								name="data-bs-theme"
								id="layout-color-light"
								value={layoutConstants.light}
								onChange={(e) => handleChangeLayoutTheme(e.target.value)}
								checked={layoutTheme === layoutConstants.light}
							/>
							<Form.Check.Label
								className="p-0 avatar-md w-100"
								htmlFor="layout-color-light"
							>
								<div id="sidebar-size">
									<span className="d-flex h-100">
										<span className="flex-shrink-0">
											<span className="bg-light d-flex h-100 border-end flex-column p-1 px-2">
												<span className="d-block p-1 bg-dark-lighten rounded mb-1"></span>
												<span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
												<span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
												<span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
												<span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
											</span>
										</span>
										<span className="flex-grow-1">
											<span className="d-flex h-100 flex-column bg-white rounded-2">
												<span className="bg-light d-block p-1"></span>
											</span>
										</span>
									</span>
								</div>

								<div id="topnav-color" className="bg-white rounded-2 h-100">
									<span className="d-flex h-100 flex-column">
										<span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
											<span className="d-block p-1 bg-dark-lighten rounded me-1"></span>
											<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto"></span>
											<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
											<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
											<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
										</span>
										<span className="d-flex h-100 flex-column bg-white rounded-2">
											<span className="bg-light d-block p-1"></span>
										</span>
									</span>
								</div>
							</Form.Check.Label>
						</Form.Check>
						<h5 className="font-14 text-center text-muted mt-2">Light</h5>
					</div>

					<div className="col-4">
						<Form.Check className="card-radio">
							<Form.Check.Input
								type="radio"
								name="data-bs-theme"
								id="layout-color-dark"
								value={layoutConstants.dark}
								onChange={(e) => handleChangeLayoutTheme(e.target.value)}
								checked={layoutTheme === layoutConstants.dark}
							/>
							<Form.Check.Label
								className="p-0 avatar-md w-100 bg-black"
								htmlFor="layout-color-dark"
							>
								<div id="sidebar-size">
									<span className="d-flex h-100">
										<span className="flex-shrink-0">
											<span className="bg-light d-flex h-100 flex-column p-1 px-2">
												<span className="d-block p-1 bg-dark-lighten rounded mb-1"></span>
												<span className="d-block border border-secondary border-opacity-25 border-3 rounded w-100 mb-1"></span>
												<span className="d-block border border-secondary border-opacity-25 border-3 rounded w-100 mb-1"></span>
												<span className="d-block border border-secondary border-opacity-25 border-3 rounded w-100 mb-1"></span>
												<span className="d-block border border-secondary border-opacity-25 border-3 rounded w-100 mb-1"></span>
											</span>
										</span>
										<span className="flex-grow-1">
											<span className="d-flex h-100 flex-column">
												<span className="bg-light d-block p-1"></span>
											</span>
										</span>
									</span>
								</div>

								<div id="topnav-color">
									<span className="d-flex h-100 flex-column">
										<span className="bg-light-lighten d-flex p-1 align-items-center border-bottom border-opacity-25 border-primary border-opacity-25">
											<span className="d-block p-1 bg-dark-lighten rounded me-1"></span>
											<span className="d-block border border-primary border-opacity-25 border-3 rounded ms-auto"></span>
											<span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1"></span>
											<span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1"></span>
											<span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1"></span>
										</span>
										<span className="bg-light-lighten d-block p-1"></span>
									</span>
								</div>
							</Form.Check.Label>
						</Form.Check>
						<h5 className="font-14 text-center text-muted mt-2">Dark</h5>
					</div>
				</Row>
			</div>
		</>
	);
};

export default LayoutTheme;
