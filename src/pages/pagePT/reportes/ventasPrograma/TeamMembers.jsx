import { Card } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';

const TeamMembers = ({ members, title }) => {
	return (
		<Card>
			<Card.Body>
				<div className="d-flex justify-content-between align-items-center mb-2">
					<h4 className="header-title mb-0">{title}</h4>
				</div>
			</Card.Body>
			<SimpleBar className="card-body py-0" style={{ maxHeight: '308px' }}>
				{(members || []).map((member, index) => {
					return (
						<div
							className={classNames(
								'd-flex',
								'align-items-center',
								'mb-4',
								index === 0 ? 'mt-0' : 'mt-3'
							)}
							key={index.toString()}
						>
							<div className="w-100 overflow-hidden">
								<h5 className="mt-0 mb-1 fw-semibold">{member.name} (20) </h5>
							</div>
						</div>
					);
				})}
			</SimpleBar>
		</Card>
	);
};

export default TeamMembers;
