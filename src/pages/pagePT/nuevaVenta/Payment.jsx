import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { Form, TextInput } from '@/components';
import paypalImg from '@/assets/images/payments/paypal.png';
import payoneerImg from '@/assets/images/payments/payoneer.png';
import cashImg from '@/assets/images/payments/cod.png';
import masterCardImg from '@/assets/images/payments/master.png';
import discoverImg from '@/assets/images/payments/discover.png';
import visaCardImg from '@/assets/images/payments/visa.png';
import stripeImg from '@/assets/images/payments/stripe.png';
import SimpleBar from 'simplebar-react';

const Payment = () => {
	const paymentSchema = yup.object({
		card_number: yup.number().required('Please Enter Card number'),
		name: yup.string().required('Please enter name on card'),
	});
	return (
		<Row>
			<Col>
				<h4 className="mt-2">Selecciona la forma de pago</h4>
				<p className="text-muted mb-4">
					Rellene el siguiente formulario para cargar la boleta de pago.
				</p>
			<SimpleBar>
				<Row>
					<Col xl={6}>
						
					<div className="border p-3 mb-3 rounded">
						<Row>
							<Col sm={8}>
								<div className="form-check">
									<input
										type="radio"
										id="BillingOptRadio2"
										name="billingOptions"
										className="form-check-input"
									/>
									<label
										className="form-check-label font-16 fw-bold"
										htmlFor="BillingOptRadio2"
									>Tarjeta automatica</label>
								</div>
							</Col>
						</Row>
					</div>

					<div className="border p-3 mb-3 rounded">
						<Row>
							<Col sm={8}>
								<div className="form-check">
									<input
										type="radio"
										id="BillingOptRadio1"
										name="billingOptions"
										className="form-check-input"
										defaultChecked
									/>
									<label
										className="form-check-label font-16 fw-bold"
										htmlFor="BillingOptRadio1"
									>
										Dolares
									</label>
								</div>
							</Col>
						</Row>
					</div>

					<div className="border p-3 mb-3 rounded">
						<Row>
							<Col sm={8}>
								<div className="form-check">
									<input
										type="radio"
										id="BillingOptRadio3"
										name="billingOptions"
										className="form-check-input"
									/>
									<label
										className="form-check-label font-16 fw-bold"
										htmlFor="BillingOptRadio3"
									>
										Pay with Payoneer
									</label>
								</div>
								<p className="mb-0 ps-3 pt-1">
									You will be redirected to Payoneer website to complete your purchase
									securely.
								</p>
							</Col>
							<Col sm={4} className="text-sm-end mt-3 mt-sm-0">
								<img src={payoneerImg} height="30" alt="payoneer-img" />
							</Col>
						</Row>
					</div>

					<div className="border p-3 mb-3 rounded">
						<Row>
							<Col sm={8}>
								<div className="form-check">
									<input
										type="radio"
										id="BillingOptRadio4"
										name="billingOptions"
										className="form-check-input"
									/>
									<label
										className="form-check-label font-16 fw-bold"
										htmlFor="BillingOptRadio4"
									>
										Cash on Delivery
									</label>
								</div>
								<p className="mb-0 ps-3 pt-1">
									Pay with cash when your order is delivered.
								</p>
							</Col>
							<Col sm={4} className="text-sm-end mt-3 mt-sm-0">
								<img src={cashImg} height="22" alt="cash-img" />
							</Col>
						</Row>
					</div>
					</Col>
					<Col xl={6}>
					</Col>
				</Row>
			</SimpleBar>
			</Col>
		</Row>
	);
};

export default Payment;
