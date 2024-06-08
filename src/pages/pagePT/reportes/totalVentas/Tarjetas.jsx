import { Card, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';

const Tarjetas = ({ tasks, title }) => {
	return (
		<Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title={title}
					menuItems={false}
				/>
				{(tasks || []).map((task, index) => {
					return (
						<div
							className={classNames({ 'mb-4': index < tasks.length - 1 })}
							key={index.toString()}
						>
							<div className="d-flex align-items-center mb-2">
								<div className="flex-grow-1 ms-2">
									<h5 className="my-0 fw-semibold">{task.title}</h5>
								</div>
								{task.completedTask ? (
									<h5 className="my-0">
										{task.completedTask}
									</h5>
								) : (
									<h5 className="my-0">{task.progressValue}%</h5>
								)}
							</div>
							<ProgressBar
								variant={task.variant}
								now={task.progressValue}
								style={{ height: 6 }}
							/>
						</div>
					);
				})}
			</Card.Body>
		</Card>
	);
};

export default Tarjetas;
