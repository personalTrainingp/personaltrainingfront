import { PageBreadcrumb } from '@/components';
import React, { useEffect } from 'react'
import { Card, Col, Nav, Row, Tab, Button } from 'react-bootstrap';
import DatosCliente from './DatosCliente';
import Shipping from './Shipping';
import Payment from './Payment';
import Summary from './Summary';
import { useCheckout } from './hooks';
import classNames from 'classnames';
import { ResumenCliente } from './ResumenCliente';
import { useOptionsStore } from '@/hooks/useOptionsStore';
import { useSelector } from 'react-redux';
import FormWizard from "react-form-wizard-component";

const NuevaVenta = () => {
	const { cart, updateShipping } = useCheckout();
	const formWizardRef = React.createRef();
	const handleComplete = () => {
	  // Handle form completion logic here
	};
	const { venta, detalle_cli_modelo } = useSelector(e=>e.uiNuevaVenta)
	const handelNext = () => {
	  console.log("nextTab");
	  formWizardRef.current?.nextTab();
	};
	const handelPrev = () => {
	  console.log("prevTab");
	  formWizardRef.current?.prevTab();
	};
	const handelReset = () => {
	  console.log("reset");
	  formWizardRef.current?.reset();
	};
	const handelActiveAll = () => {
	  console.log("activeAll");
	  formWizardRef.current?.activeAll();
	};
	const handelChangeTab = () => {
	  console.log("changeTab");
	  formWizardRef.current?.goToTab(2);
	};
  return (
    <>
    <PageBreadcrumb title="Nueva venta" subName="ventas" />
			<Tab.Container defaultActiveKey="1">
			<Card>
					<FormWizard
				ref={formWizardRef}
				shape="square"
				color="#ff8000"
				onComplete={handleComplete}
				backButtonTemplate={(handleNext) => (
					<>
					</>
				  )}
				nextButtonTemplate={(handleNext) => (
					<>
					</>
				  )}
			>
				<FormWizard.TabContent title="Datos del cliente" icon="ti-user">
					<DatosCliente dataCliente={detalle_cli_modelo} handelNext={handelNext}/>
				</FormWizard.TabContent>
				<FormWizard.TabContent title="Datos del producto" icon="ti-shopping-cart">
					<Shipping dataVenta={venta} handelNext={handelNext} handelPrev={handelPrev}/>
				</FormWizard.TabContent>
				<FormWizard.TabContent title="Datos de pago" icon="ti-credit-card">
					<Payment  handelNext={handelNext} handelPrev={handelPrev}/>
				</FormWizard.TabContent>
				<FormWizard.TabContent title="Success" icon="ti-check">
				</FormWizard.TabContent>
			</FormWizard>
			</Card>
				{/* <Row>
					<Col>
						<Card>
							<Card.Body>
								<Nav
									as="ul"
									variant="pills"
									className="nav nav-pills bg-nav-pills nav-justified mb-3"
								>
									<Nav.Item as="li" className="nav-item">
										<Nav.Link
											href=""
											eventKey="1"
											className="nav-link rounded-0"
										>
											<i
												className={classNames(
													'mdi mdi-account-circle',
													'font-18'
												)}
											></i>
											<span className="d-none d-lg-block">Datos del cliente</span>
										</Nav.Link>
									</Nav.Item>
									<Nav.Item as="li" className="nav-item">
										<Nav.Link
											href=""
											eventKey="2"
											className="nav-link rounded-0"
										>
											<i
												className={classNames(
													'ri ri-box-1-line',
													'font-18'
												)}
											></i>
											<span className="d-none d-lg-block">Datos del producto</span>
										</Nav.Link>
									</Nav.Item>
									<Nav.Item as="li">
										<Nav.Link
											href=""
											eventKey="3"
											className="nav-link rounded-0"
										>
											<i
												className={classNames(
													'mdi mdi-cash-multiple',
													'font-18'
												)}
											></i>
											<span className="d-none d-lg-block">Datos del pago</span>
										</Nav.Link>
									</Nav.Item>
								</Nav>

								<Row>
									<Col lg={12}>
										<Tab.Content>
											<Tab.Pane eventKey="1">
												<Billing/>
											</Tab.Pane>
											<Tab.Pane eventKey="2">
												<Shipping updateShipping={updateShipping} />
											</Tab.Pane>
											<Tab.Pane eventKey="3">
												<Payment />
											</Tab.Pane>
										</Tab.Content>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row> */}
			</Tab.Container>
			
    </>
  )
}

export { NuevaVenta };