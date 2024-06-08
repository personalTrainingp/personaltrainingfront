import { ThemeSettings } from '@/common';
import { Form, Row } from 'react-bootstrap';

const LayoutType = ({ handleChangeLayoutType, layoutType, layoutConstants }) => {
	return (
		<>
			<h5 className="mt-0 font-16 fw-bold mb-3">Choose Layout</h5>
			<Row>
				<div className="col-4">
					<Form.Check className="card-radio">
						<Form.Check.Input
							type="radio"
							name="data-layout"
							id="customizer-layout01"
							value={layoutConstants.vertical}
							onChange={(e) => handleChangeLayoutType(e.target.value)}
							checked={layoutType === layoutConstants.vertical}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="customizer-layout01"
						>
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
									<span className="d-flex h-100 flex-column">
										<span className="bg-light d-block p-1"></span>
									</span>
								</span>
							</span>
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Vertical</h5>
				</div>

				<div className="col-4">
					<Form.Check className="card-radio">
						<Form.Check.Input
							type="radio"
							name="data-layout"
							id="customizer-layout02"
							value={layoutConstants.horizontal}
							onChange={(e) => handleChangeLayoutType(e.target.value)}
							checked={layoutType === layoutConstants.horizontal}
						/>
						<Form.Check.Label
							className="p-0 avatar-md w-100"
							htmlFor="customizer-layout02"
						>
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
						</Form.Check.Label>
					</Form.Check>
					<h5 className="font-14 text-center text-muted mt-2">Horizontal</h5>
				</div>
			</Row>
		</>
	);
};

export default LayoutType;
