import { Chart, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { dir } from 'i18next';
import { Pie } from 'react-chartjs-2';

// Registrar los elementos necesarios
Chart.register(ArcElement, Title, Tooltip, Legend);

export const GraficoPie = ( dirtData) => {

    let data_label = [];
    let data_numbers = [];
   
    console.log(dirtData);
    for (const key in dirtData){
        
        let result = dirtData[key];
        for(const key2 in result){
            data_label.push(key2);
            data_numbers.push(result[key2].TotalSalario);
        };
    };
    const data = {
        labels: data_label,
        datasets: [
            {
                label: 'Colores',
                data: data_numbers,
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
