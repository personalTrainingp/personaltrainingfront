import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, plugins } from 'chart.js';
export const GraficoBarras = ( {data , options}) => {

 
  Chart.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

  return (
    <div className='col-md-6'>
      <div className=' card-body text-secondary card border-secondary box-shadow'>
        <h4>Planilla por Mes</h4>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
