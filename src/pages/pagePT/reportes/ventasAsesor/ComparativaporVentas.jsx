import Chart from 'react-apexcharts';
import { Card } from 'react-bootstrap';
import React from 'react'

export const ComparativaporVentas = () => {
    var options = {
        series: [{
          name: 'XYZ MOTORS',
          data: [
            { x: new Date('2023-01-01').getTime(), y: 1000000 },
            { x: new Date('2023-02-01').getTime(), y: 2000000 },
            { x: new Date('2023-03-01').getTime(), y: 3000000 },
            { x: new Date('2023-04-01').getTime(), y: 4000000 },
            { x: new Date('2023-11-01').getTime(), y: 5000000 },
            { x: new Date('2023-11-01').getTime(), y: 5000000 },
            { x: new Date('2023-11-01').getTime(), y: 5000000 },
            { x: new Date('2023-11-01').getTime(), y: 5000000 },
            { x: new Date('2023-11-01').getTime(), y: 5000000 },
            { x: new Date('2023-11-01').getTime(), y: 5000000 },
            { x: new Date('2023-11-01').getTime(), y: 5000000 },
            { x: new Date('2023-11-01').getTime(), y: 5000000 },
          ]
        }],
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: '',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return (val).toFixed(0);
            },
          },
          title: {
            text: 'Precio'
          },
        },
        xaxis: {
          type: 'datetime',
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0)
            }
          }
        }
      };
  return (
    <Card>
        <Card.Header>
            <Card.Title>VENTAS POR DIA</Card.Title>
        </Card.Header>
        <Card.Body>
        <div style={{ height: '327px' }} className="mt-3 chartjs-chart">
					<Chart
						options={options}
                        series={options.series}
                        type="area"
            height={327}
            className="apex-charts"
					/>
				</div>
        </Card.Body>
    </Card>
  )
}
