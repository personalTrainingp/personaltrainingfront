import React from 'react'
import Chart from 'react-apexcharts';
import { Col, Row } from 'react-bootstrap';

export const EgresosxGrupo = () => {
    const options = {
        chart: {
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team A', 'Team B', 'Team C', 'Team D'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
      };
    
      const series = [{
        name: 'series-1',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
      }];
  return (
    <div className="app">
    <div className="row">
      <div className="mixed-chart">
        <Chart
          options={options}
          series={series}
          type="pie"
          width="500"
        />
      </div>
    </div>
  </div>
  )
}
