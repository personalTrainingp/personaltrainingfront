import { Card, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { MoneyFormatter } from '@/components/CurrencyMask';

const Tarjetas = ({ tasks, title, dataSumaTotal }) => {
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
							key={tasks.forma_pago}
						>
							<div className="d-flex align-items-center mb-2">
								<div className="flex-grow-1 ms-2">
									<h5 className="my-0 fw-semibold">{task.forma_pago}</h5>
								</div>
								{task.completedTask ? (
									<h5 className="my-0">
										{task.completedTask}
									</h5>
								) : (
                                    <h5 className="my-0"><MoneyFormatter amount={task.monto}/> - {((task.monto / dataSumaTotal) * 100).toFixed(2)}%</h5>
								)}
							</div>
							<ProgressBar
								variant={'primary'}
								now={((task.monto / dataSumaTotal) * 100)}
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
