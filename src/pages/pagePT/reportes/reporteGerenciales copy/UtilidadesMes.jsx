import React from 'react'
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MoneyFormatter, NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const UtilidadesMes = () => {

    const barChartData = {
		labels: [
			'ENERO',
			'FEBRERO',
			'MARZO',
			'ABRIL',
			'MAYO',
			'JUNIO',
			'JULIO',
			'AGOSTO',
			'SEPTIEMBRE',
			'OCTUBRE',
			'NOVIEMBRE',
			'DICIEMBRE',
		],
		datasets: [
			{
                label: 'Total',
                data: 
                [
                    	16, 44, 32, 48, 72, 60, 84, 64, 78, 50, 68, 34
                    ],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: '#0d47a1',
                borderWidth: 1,
                borderRadius: 5, // Le da un poco de curva a las esquinas de las barras
                barThickness: 40, // Grosor de la barra
                shadowOffsetX: 4,  // Desplazamiento de la sombra en el eje X
                shadowOffsetY: 4,  // Desplazamiento de la sombra en el eje Y
                shadowBlur: 10,    // Desenfoque de la sombra
                shadowColor: 'rgba(0, 0, 0, 0.5)', // Color de la sombra
                // label: 'Ventas 2024',
                // data: [
				// 	16, 44, 32, 48, 72, 60, 84, 64, 78, 50, 68, 34, 26, 44, 32, 48, 72, 60, 74, 52,
				// 	62, 50, 32, 22,
				// ],
                // backgroundColor: function(context) {
                //     const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
                //     gradient.addColorStop(0, '#42a5f5');
                //     gradient.addColorStop(1, '#1e88e5');
                //     return gradient;
                // },
                // borderColor: '#0d47a1',
                // borderWidth: 2,
                // hoverBackgroundColor: '#64b5f6',
                // hoverBorderColor: '#1565c0',
                // hoverBorderWidth: 2,
				// barPercentage: 1.5,
				// categoryPercentage: 0.5,
				// label: 'UTILIDAD',
				// backgroundColor: '#B40E12',
				// borderColor: '#727cf5',
				// data: [
				// 	16, 44, 32, 48, 72, 60, 84, 64, 78, 50, 68, 34, 26, 44, 32, 48, 72, 60, 74, 52,
				// 	62, 50, 32, 22,
				// ]
			},
		],
	};

	const barChartOpts = {
		maintainAspectRatio: false,

		hover: {
			intersect: true,
		},
		plugins: {
			filler: {
				propagate: false,
			},
			tooltips: {
				intersect: false,
			},
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				reverse: false,
				grid: {
					color: 'rgba(0,0,0,0.05)',
				},
			},
			y: {
				ticks: {
					stepSize: 10,
					display: false,
				},
				min: 10,
				max: 100,
				display: true,
				borderDash: [5, 5],
				grid: {
					color: 'rgba(0,0,0,0)',
					fontColor: '#fff',
				},
			},
		},
	};
    const dataUtilidades=[
        {
            anio: '2024',
            mes: 'ENERO',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'FEBRERO',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'MARZO',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'ABRIL',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'MAYO',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'JUNIO',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'JULIO',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'AGOSTO',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'SEPTIEMBRE',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'OCTUBRE',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'NOVIEMBRE',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        },
        {
            anio: '2024',
            mes: 'DICIEMBRE',
            total_ingresos: 100,
            total_aportes: 100,
            total_gasto: 80,
            total_bene: 20,
            margen: '10%'
        }
    ]
    const TotalIngresosBodyTemplate = (rowData)=>{
        return (
            <>
            <NumberFormatMoney amount={rowData.total_ingresos}/>
            </>
        )
    }
    const TotalEgresosBodyTemplate = (rowData)=>{
        return (
            <>
            <NumberFormatMoney amount={rowData.total_gasto}/>
            </>
        )
    }
    const AportesEgresosBodyTemplate = (rowData)=>{
        return(
            <>
            <NumberFormatMoney amount={rowData.total_bene}/>
            </>
        )
    }
    const UtilidadesBodyTemplate = (rowData)=>{
        return(
            <>
            <NumberFormatMoney amount={rowData.total_ingresos-rowData.total_gasto}/>
            </>
        )
    }
    const MargenBodyTemplate=(rowData)=>{
        return(
            <>
            {(rowData.total_ingresos-rowData.total_gasto)/rowData.total_ingresos}
            </>
        )
    }
  return (
    <>
    
                <div dir="ltr">
					<div style={{ height: '320px' }} className="mt-3 chartjs-chart">
						<Bar data={barChartData} options={barChartOpts} />
					</div>
				</div>
                <div className='mt-3'>
                <DataTable value={dataUtilidades} size={'small'} tableStyle={{ minWidth: '50rem' }}>
                    <Column header="Mes" field='mes'></Column>
                    <Column header={<div className='d-flex flex-column'><span>INGRESOS</span><span>S/.</span></div>} body={TotalIngresosBodyTemplate}></Column>
                    <Column header={<div className='d-flex flex-column'><span>EGRESOS</span><span>S/.</span></div>} body={TotalEgresosBodyTemplate}></Column>
                    <Column header={<div className='d-flex flex-column'><span>APORTES</span><span>S/.</span></div>} body={AportesEgresosBodyTemplate}></Column>
                    <Column header={<div className='d-flex flex-column'><span>UTILIDAD</span><span>S/.</span></div>} body={UtilidadesBodyTemplate}></Column>
                    <Column header={<div className='d-flex flex-column'><span>MARGEN</span><span>%</span></div>} body={MargenBodyTemplate}></Column>
                </DataTable>
                </div>
    </>
  )
}
