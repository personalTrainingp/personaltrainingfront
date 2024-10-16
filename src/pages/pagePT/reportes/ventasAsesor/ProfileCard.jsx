import classNames from 'classnames';
import React from 'react'
import { Card } from 'react-bootstrap';

export const ProfileCard = () => {
    const profileStats = [
		{ label: 'Total de ventas:', value: '$ 25,184' },
		{ label: 'Cantidad de ventas:', value: '5482' },
		{ label: 'Canjes:', value: '5482' },
	];

	return (
		<Card className={classNames('widget-flat')}>
			<Card.Body>
				<span className="float-start m-2 me-4">
					<img
						// src={profileImg}
						style={{ height: '100px' }}
						alt=""
						className="rounded-circle img-thumbnail"
					/>
				</span>

				<div>
					<h4 className="mt-1 mb-1">Alvaro Salazar</h4>
					{/* <p className="font-13"> Authorised Brand Seller</p> */}

					<ul className="mb-0 list-inline">
						{profileStats.map((stat, i) => {
							return (
								<li className="list-inline-item me-3" key={i + '-stat'}>
									<h5 className="mb-1">{stat.label}</h5>
									<p className="mb-0 font-13">{stat.value}</p>
								</li>
							);
						})}
					</ul>
				</div>
			</Card.Body>
		</Card>
	);
}
