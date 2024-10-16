import { ProgressBar } from 'primereact/progressbar'
import React from 'react'
import { Badge, Card } from 'react-bootstrap'

export const MetaTitle = () => {
	const valueTemplate = (value) => {
        return (
            <React.Fragment>
				20,000.00
            </React.Fragment>
        );
    };
  return (
    <Card>
			<Card.Header>
				<Card.Title>
					<h3>
						META FEBRERO 
						<Badge bg="primary-lighten" className="text-primary fw ms-sm-1">
							<i className="mdi mdi-trending-up me-1"></i>59%
						</Badge>
					</h3>
					<div>
						Inicio: sabado 21 de septiembre 
					</div>
					<div>
						Fin: domingo 22 de septiembre
					</div>
				</Card.Title>
			</Card.Header>
				<Card.Body>
					<h5 className="float-end mt-0">65%</h5>
					<h5 className="fw-normal mt-0 font-24">200,000.00</h5>
					<ProgressBar value={40}  displayValueTemplate={valueTemplate}></ProgressBar>
					{/* <ProgressBar now={65} style={{ height: 3 }} /> */}
				</Card.Body>
			</Card>
  )
}
