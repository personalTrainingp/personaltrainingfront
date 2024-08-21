import { Card, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import SimpleBar from 'simplebar-react';
import { MoneyFormatter } from '@/components/CurrencyMask';
import Chart from 'react-apexcharts';

export const TarjetasPago = ({ tasks, title, dataSumaTotal }) => {
    const pagos = tasks.map(producto => ({
        nombre_producto: producto.empl,
        total_ventas: producto.monto
    })) || []
    
    const series = [
        {
            name: 'TOTAL:',
          data: pagos.map(e=>e.total_ventas),
        },
      ];
    const options = {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '50%', // Ajusta este valor para hacer las barras más delgadas
          },
        },
        colors: ['#D41115'], // Cambia el color de las barras (puedes añadir más colores si hay múltiples series)
        dataLabels: {
            enabled: true,
            offsetX: 10,
            style: {
              fontSize: '16px', // Cambia este valor para hacer los números más grandes
            },
			formatter: function (val, opts) {
				return formatCurrency(val)
			},
          },
        xaxis: {
          categories: pagos.map(e=>e.nombre_producto),
        },
		tooltip: {
			y: {
				formatter: function (val) {
					return formatCurrency(val);
				},
			},
		},
      };
    console.log(dataSumaTotal);
    
	const formatCurrency = (value) => {
		return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
	};
  return (
    <Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title={title}
					menuItems={false}
				/>
                <Chart options={options} series={series} type="bar" height={350} />
                <SimpleBar style={{ maxHeight: '500px' }} className="card-body p-0">
                    {(tasks || []).map((task, index) => {
                        return (
                            <div
                                className={classNames({ 'mb-3': index < tasks.length - 1 })}
                                key={tasks.forma_pago}
                            >
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 ms-2">
                                        <h5 className="my-0 fw-semibold">{task.empl}</h5>
                                    </div>
                                    {task.completedTask ? (
                                        <h5 className="my-0">
                                            {task.completedTask}
                                        </h5>
                                    ) : (
                                        <h5 className="my-0"><MoneyFormatter amount={task.monto}/> - {((task.monto / dataSumaTotal) * 100).toFixed(2)}%</h5>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </SimpleBar>
			</Card.Body>
		</Card>
  )
}
