import { ThemeSettings } from '@/common';
import { Form, Row } from 'react-bootstrap';

const SideBarTheme = ({
	handleChangeSideBarTheme,
	sideBarTheme,
	layoutConstants,
}) => {
	return (
		<div>
			<h5 className="my-3 font-16 fw-bold">Menu Color</h5>

			<Row>
				<div className="col-4">
					<Form.Check className="sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-menu-color"
							id="leftbar-color-light"
							value={layoutConstants.light}
							onChange={(e) => handleChangeSideBarTheme(e.target.value)}
							checked={sideBarTheme === layoutConstants.light}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-color-light"
						>
							<div id="sidebar-size">
								<span className="d-flex h-100">
									<span className="flex-shrink-0">
										<span className="bg-light d-flex h-100 border-end  flex-column p-1 px-2">
											<span className="d-block p-1 bg-dark-lighten rounded mb-1"></span>
											<span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
											<span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
											<span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
											<span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
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
									<span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
										<span className="d-block p-1 bg-dark-lighten rounded me-1"></span>
										<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto"></span>
										<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
										<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
										<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
									</span>
									<span className="bg-light d-block p-1"></span>
								</span>
							</div>
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Light</h5>
				</div>

				<div className="col-4">
					<Form.Check className="sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-menu-color"
							id="leftbar-color-dark"
							value={layoutConstants.dark}
							onChange={(e) => handleChangeSideBarTheme(e.target.value)}
							checked={sideBarTheme === layoutConstants.dark}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-color-dark"
						>
							<div id="sidebar-size">
								<span className="d-flex h-100">
									<span className="flex-shrink-0">
										<span className="bg-dark d-flex h-100 flex-column p-1 px-2">
											<span className="d-block p-1 bg-dark-lighten rounded mb-1"></span>
											<span className="d-block border border-secondary rounded border-opacity-25 border-3 w-100 mb-1"></span>
											<span className="d-block border border-secondary rounded border-opacity-25 border-3 w-100 mb-1"></span>
											<span className="d-block border border-secondary rounded border-opacity-25 border-3 w-100 mb-1"></span>
											<span className="d-block border border-secondary rounded border-opacity-25 border-3 w-100 mb-1"></span>
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
									<span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-primary border-opacity-25">
										<span className="d-block p-1 bg-primary-lighten rounded me-1"></span>
										<span className="d-block border border-secondary rounded border-opacity-25 border-3 ms-auto"></span>
										<span className="d-block border border-secondary rounded border-opacity-25 border-3 ms-1"></span>
										<span className="d-block border border-secondary rounded border-opacity-25 border-3 ms-1"></span>
										<span className="d-block border border-secondary rounded border-opacity-25 border-3 ms-1"></span>
									</span>
									<span className="bg-dark d-block p-1"></span>
								</span>
							</div>
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Dark</h5>
				</div>
				<div className="col-4">
					<Form.Check className="sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-menu-color"
							id="leftbar-color-brand"
							value={layoutConstants.brand}
							onChange={(e) => handleChangeSideBarTheme(e.target.value)}
							checked={sideBarTheme === layoutConstants.brand}
						/>
						<Form.Check.Input
							type="radio"
							name="data-menu-color"
							id="leftbar-color-brand"
							value="brand"
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-color-brand"
						>
							<div id="sidebar-size">
								<span className="d-flex h-100">
									<span className="flex-shrink-0">
										<span className="bg-primary bg-gradient d-flex h-100 flex-column p-1 px-2">
											<span className="d-block p-1 bg-light-lighten rounded mb-1"></span>
											<span className="d-block border opacity-25 rounded border-3 w-100 mb-1"></span>
											<span className="d-block border opacity-25 rounded border-3 w-100 mb-1"></span>
											<span className="d-block border opacity-25 rounded border-3 w-100 mb-1"></span>
											<span className="d-block border opacity-25 rounded border-3 w-100 mb-1"></span>
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
									<span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary">
										<span className="d-block p-1 bg-dark-lighten rounded me-1"></span>
										<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto"></span>
										<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
										<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
										<span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1"></span>
									</span>
									<span className="bg-primary bg-gradient d-block p-1"></span>
								</span>
							</div>
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Brand</h5>
				</div>
			</Row>
		</div>
	);
};

export default SideBarTheme;
