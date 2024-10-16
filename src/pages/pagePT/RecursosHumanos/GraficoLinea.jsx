
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export const GraficoLinea = () => {

  const data = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: 'Gastos Mensuales',
        data: [10000, 20000, 15000, 30000, 25000, 10000, 20000, 15000, 30000, 25000, 10000, 20000],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div className='col-md-6'>
      <div className=' card-body text-secondary card border-secondary box-shadow'>
        <h4>Planilla por mes</h4>
        <Line data={data} />
      </div>
    </div>
  )
}
