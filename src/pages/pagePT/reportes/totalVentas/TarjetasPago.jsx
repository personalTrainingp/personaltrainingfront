import { Card, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import SimpleBar from 'simplebar-react';
import { MoneyFormatter } from '@/components/CurrencyMask';

export const TarjetasPago = ({ tasks, title, dataSumaTotal }) => {
  return (
    <Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title={title}
					menuItems={false}
				/>
                <SimpleBar style={{ maxHeight: '500px' }} className="card-body p-0">
                    {(tasks || []).map((task, index) => {
                        return (
                            <div
                                className={classNames({ 'mb-4': index < tasks.length - 1 })}
                                key={tasks.forma_pago}
                            >
                                <div className="d-flex align-items-center mb-2">
                                    <div className="flex-grow-1 ms-2">
                                        <h5 className="my-0 fw-semibold">{task.tb_empleado.nombres_apellidos_empl}</h5>
                                    </div>
                                    {task.completedTask ? (
                                        <h5 className="my-0">
                                            {task.completedTask}
                                        </h5>
                                    ) : (
                                        <h5 className="my-0"><MoneyFormatter amount={task.total_ventas}/> - {((task.cantidad_ventas / dataSumaTotal) * 100).toFixed(2)}%</h5>
                                    )}
                                </div>
                                <ProgressBar
                                    variant={'primary'}
                                    now={((task.cantidad_ventas / dataSumaTotal) * 100)}
                                    style={{ height: 6 }}
                                />
                            </div>
                        );
                    })}
                </SimpleBar>
			</Card.Body>
		</Card>
  )
}
