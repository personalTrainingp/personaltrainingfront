import React from 'react'
import Chart from 'react-apexcharts';
import { Card, Row, Col, CardTitle } from 'react-bootstrap';

export const MetaPorAsesor = () => {
// apex chart config
const apexBarChartOpts = {
    grid: {
        padding: {
            left: 0,
            right: 15,
        },
    },
    chart: {
        type: 'bar',
        height: 350,
        parentHeightOffset: 0,
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            horizontal: true,
        },
    },
    colors: ['rgba(114, 124, 245, 0.85)'],
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        categories: [
            'India',
            'China',
            'United States',
            'Japan',
            'France',
            'Italy',
            'Netherlands',
            'United Kingdom',
            'Canada',
            'South Korea',
        ],
        labels: {
            formatter: function (val) {
                return val + '%';
            },
        },
    },
};
const apexBarChartData = [
    {
        name: 'Sessions',
        data: [90, 75, 60, 50, 45, 36, 28, 20, 15, 12],
    },
];

// vector map config
const options = {
    series: {
        regions: [
            {
                attribute: 'fill',
                scale: {
                    ScaleKR: '#e6ebff',
                    ScaleCA: '#b3c3ff',
                    ScaleGB: '#809bfe',
                    ScaleNL: '#4d73fe',
                    ScaleIT: '#1b4cfe',
                    ScaleFR: '#727cf5',
                    ScaleJP: '#e7fef7',
                    ScaleUS: '#e7e9fd',
                    ScaleCN: '#8890f7',
                    ScaleIN: '#727cf5',
                },
                values: {
                    KR: 'ScaleKR',
                    CA: 'ScaleCA',
                    GB: 'ScaleGB',
                    NL: 'ScaleNL',
                    IT: 'ScaleIT',
                    FR: 'ScaleFR',
                    JP: 'ScaleJP',
                    US: 'ScaleUS',
                    CN: 'ScaleCN',
                    IN: 'ScaleIN',
                },
            },
        ],
    },
};

return (
    <Card>
        <Card.Header>
            <Card.Title>
                METAS POR ASESOR
            </Card.Title>
        </Card.Header>
        <Card.Body>
            <Chart
                        options={apexBarChartOpts}
                        series={apexBarChartData}
                        type="bar"
                        height={320}
                    />
            
				<div className="table-responsive mt-3">
					<table className="table table-sm mb-0 font-13">
						<thead>
							<tr>
								<th>Page</th>
								<th>Views</th>
								<th>Bounce Rate</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
										/hyper/dashboard-analytics
								</td>
								<td>25</td>
								<td>87.5%</td>
							</tr>
							<tr>
								<td>
										/hyper/dashboard-crm
								</td>
								<td>15</td>
								<td>21.48%</td>
							</tr>
							<tr>
								<td>
										/ubold/dashboard
								</td>
								<td>10</td>
							</tr>
							<tr>
								<td>
										/minton/home
								</td>
								<td>7</td>
							</tr>
						</tbody>
					</table>
				</div>
        </Card.Body>
    </Card>
);
}
