import { Chart, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registrar los elementos necesarios
Chart.register(ArcElement, Title, Tooltip, Legend);

export const GraficoPie = () => {
    const data = {
        labels: ['Vendedores', 'Limpieza', 'Entrenadores'],
        datasets: [
            {
                label: 'Colores',
                data: [10000, 5000, 18000],
                backgroundColor: ['red', 'blue', 'yellow'],
            },
        ],
    };
    return (
        <div className='col-md-5'>
            <div className=' card-body text-secondary card border-secondary box-shadow'>
                <h4>Gráfico de Departamentos</h4>
                <Pie data={data} />
            </div>
        </div>
    )
}
