import { ThemeSettings } from '@/common';
import { Form, Row } from 'react-bootstrap';

const SideBarType = ({
	handleChangeSideBarType,
	sideBarType,
	layoutConstants,
}) => {
	return (
		<div id="sidebar-size">
			<h5 className="my-3 font-16 fw-bold">Sidebar Size</h5>

			<Row>
				<div className="col-4">
					<Form.Check className="sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-sidenav-size"
							id="leftbar-size-default"
							value={layoutConstants.default}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.default}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-size-default"
						>
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
						</Form.Check.Label>
					</Form.Check>

					<h5 className="font-14 text-center text-muted mt-2">Default</h5>
				</div>

				<div className="col-4">
					<div className="form-check sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-sidenav-size"
							id="leftbar-size-compact"
							value={layoutConstants.compact}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.compact}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-size-compact"
						>
							<span className="d-flex h-100">
								<span className="flex-shrink-0">
									<span className="bg-light d-flex h-100 border-end  flex-column p-1">
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
						</Form.Check.Label>
					</div>

					<h5 className="font-14 text-center text-muted mt-2">Compact</h5>
				</div>

				<div className="col-4">
					<div className="form-check sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-sidenav-size"
							id="leftbar-size-small"
							value={layoutConstants.condensed}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.condensed}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-size-small"
						>
							<span className="d-flex h-100">
								<span className="flex-shrink-0">
									<span
										className="bg-light d-flex h-100 border-end flex-column"
										style={{ padding: 2 }}
									>
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
						</Form.Check.Label>
					</div>

					<h5 className="font-14 text-center text-muted mt-2">Condensed</h5>
				</div>

				<div className="col-4">
					<div className="form-check sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-sidenav-size"
							id="leftbar-size-small-hover"
							value={layoutConstants.showOnHover}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.showOnHover}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-size-small-hover"
						>
							<span className="d-flex h-100">
								<span className="flex-shrink-0">
									<span
										className="bg-light d-flex h-100 border-end flex-column"
										style={{ padding: 2 }}
									>
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
						</Form.Check.Label>
					</div>

					<h5 className="font-14 text-center text-muted mt-2">Hover View</h5>
				</div>

				<div className="col-4">
					<div className="form-check sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-sidenav-size"
							id="leftbar-size-full"
							value={layoutConstants.full}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.full}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-size-full"
						>
							<span className="d-flex h-100">
								<span className="flex-shrink-0">
									<span className="d-flex h-100 flex-column">
										<span className="d-block p-1 bg-dark-lighten mb-1"></span>
									</span>
								</span>
								<span className="flex-grow-1">
									<span className="d-flex h-100 flex-column">
										<span className="bg-light d-block p-1"></span>
									</span>
								</span>
							</span>
						</Form.Check.Label>
					</div>

					<h5 className="font-14 text-center text-muted mt-2">Full Layout</h5>
				</div>

				<div className="col-4">
					<div className="form-check sidebar-setting card-radio">
						<Form.Check.Input
							type="radio"
							name="data-sidenav-size"
							id="leftbar-size-fullscreen"
							value={layoutConstants.fullscreen}
							onChange={(e) => handleChangeSideBarType(e.target.value)}
							checked={sideBarType === layoutConstants.fullscreen}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="leftbar-size-fullscreen"
						>
							<span className="d-flex h-100">
								<span className="flex-grow-1">
									<span className="d-flex h-100 flex-column">
										<span className="bg-light d-block p-1"></span>
									</span>
								</span>
							</span>
						</Form.Check.Label>
					</div>

					<h5 className="font-14 text-center text-muted mt-2">Fullscreen Layout</h5>
				</div>
			</Row>
		</div>
	);
};

export default SideBarType;
