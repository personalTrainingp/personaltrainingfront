import { PageBreadcrumb } from '@/components';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { PostMkt } from './PostMkt';
import imgTest from '@/assets/images/products/product-1.jpg'
export const GestionMkt = () => {
	return (
		<>
			<PageBreadcrumb title="Actas de reunion" subName="mkt" />
			<Row>
				<Col xxl={3}></Col>
				<Col xxl={6}>
					<Card>
						<Card.Header>
							<Card.Title>Nuevo Trabajo de marketing</Card.Title>
						</Card.Header>
						<PostMkt />
					</Card>
					<Card>
						<Card.Header>
							<Card.Title>
                                <span>
                                    <span>
                                        Rosales Morales Carlos
                                        <div className="font-12">sabado 21 de abril del 2020</div>
                                    </span>
                                </span>
                                
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<span className="content-description">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
								tenetur amet optio expedita debitis, sapiente asperiores corporis
								vitae doloremque dolorem animi necessitatibus sequi iusto doloribus
								voluptatem laborum facilis in odit. Eligendi provident maiores
								adipisci! Odit, beatae! Saepe culpa maiores odit!
							</span>
                            <img src={imgTest} style={{width: '100%', height: '70%'}}/>
						</Card.Body>
					</Card>
				</Col>
				<Col xxl={3}></Col>
			</Row>
		</>
	);
};
