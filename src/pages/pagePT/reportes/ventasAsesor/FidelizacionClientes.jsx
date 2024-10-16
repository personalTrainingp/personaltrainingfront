import classNames from 'classnames';
import React from 'react'
import { Card } from 'react-bootstrap'
import SimpleBar from 'simplebar-react';

export const FidelizacionClientes = ({members}) => {
  return (
    <Card>
        <Card.Header>
            <Card.Title>Fidelizacion de clientes</Card.Title>
        </Card.Header>
        <Card.Body>
        <SimpleBar className="card-body py-0" style={{ maxHeight: '308px' }}>
				{(members || []).map((member, index) => {
					return (
						<div
							className={classNames	(
								'd-flex',
								'align-items-center',
								'mb-4',
								index === 0 ? 'mt-0' : 'mt-3'
							)}
							key={index.toString()}
						>
							<div className="w-100 overflow-hidden">
								<h5 className="mt-0 mb-1 fw-semibold">{member.name} (20) </h5>
							</div>
						</div>
					);
				})}
			</SimpleBar>

        </Card.Body>
    </Card>
  )
}
