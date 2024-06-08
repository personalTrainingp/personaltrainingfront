import { Row, Col, InputGroup, Form } from 'react-bootstrap';
import { Form as RHForm } from '@/components';
import { Link } from 'react-router-dom';
import { PasswordInput, TextAreaInput, TextInput } from '@/components';

const PersonalInfo = () => {
	return (
		<>
			<h5 className="mb-4 text-uppercase">
				<i className="mdi mdi-account-circle me-1"></i> Personal Info
			</h5>
			<Row>
				<Col md={6}>
					<TextInput
						label="First Name"
						type="text"
						name="firstname"
						placeholder="Enter first name"
						containerClass={'mb-3'}
						key="firstname"
					/>
				</Col>
				<Col md={6}>
					<TextInput
						label="Last Name"
						type="text"
						name="lastname"
						placeholder="Enter last name"
						containerClass={'mb-3'}
						key="lastname"
					/>
				</Col>
			</Row>
			<Row>
				<Col>
					<TextAreaInput
						label="Bio"
						name="userbio"
						placeholder="Write something..."
						rows={4}
						containerClass={'mb-3'}
						key="userbio"
					/>
				</Col>
			</Row>
			<Row>
				<Col md={6} className="mb-3">
					<TextInput
						label="Email Address"
						type="email"
						name="usermail"
						placeholder="Enter email"
						key="useremail"
					/>
					<span className="form-text text-muted">
						<small>
							If you want to change email please <Link to="">click</Link> here.
						</small>
					</span>
				</Col>
				<Col md={6} className="mb-3">
					<PasswordInput
						label="Password"
						name="userpassword"
						placeholder="Enter password"
						key="userpassword"
					/>
					<span className="form-text text-muted">
						<small>
							If you want to change password please <Link to="">click</Link> here.
						</small>
					</span>
				</Col>
			</Row>
		</>
	);
};

const CompanyInfo = () => {
	return (
		<>
			<h5 className="mb-3 text-uppercase bg-light p-2">
				<i className="mdi mdi-office-building me-1"></i> Company Info
			</h5>
			<Row>
				<Col md={6}>
					<TextInput
						label="Company Name"
						type="text"
						name="companyname"
						placeholder="Enter company name"
						containerClass={'mb-3'}
						key="companyname"
					/>
				</Col>
				<Col md={6}>
					<TextInput
						label="Website"
						type="text"
						name="cwebsite"
						placeholder="Enter website url"
						containerClass={'mb-3'}
						key="cwebsite"
					/>
				</Col>
			</Row>
		</>
	);
};

const Social = ({ socialinfo }) => {
	return (
		<>
			<h5 className="mb-3 text-uppercase bg-light p-2">
				<i className="mdi mdi-earth me-1"></i> Social
			</h5>

			<Row>
				{socialinfo.map((item, index) => {
					return (
						<Col key={index.toString()} md={6} className="mb-3">
							<Form.Label> {item.label} </Form.Label>
							<InputGroup className="mb-0">
								<span className="input-group-text">
									<i className={item.icon}></i>
								</span>
								<Form.Control placeholder={item.placeholder} />
							</InputGroup>
						</Col>
					);
				})}
			</Row>
		</>
	);
};

const Settings = () => {
	const socialInfo = [
		{
			label: 'Facebook',
			icon: 'mdi mdi-facebook',
			placeholder: 'Url',
		},
		{
			label: 'Twitter',
			icon: 'mdi mdi-twitter',
			placeholder: 'Username',
		},
		{
			label: 'Instagram',
			icon: 'mdi mdi-instagram',
			placeholder: 'Url',
		},
		{
			label: 'Linkedin',
			icon: 'mdi mdi-linkedin',
			placeholder: 'Url',
		},
		{
			label: 'Skype',
			icon: 'mdi mdi-skype',
			placeholder: '@username',
		},
		{
			label: 'Github',
			icon: 'mdi mdi-github',
			placeholder: 'Username',
		},
	];

	return (
		<RHForm onSubmit={(e) => e.preventDefault()}>
			<PersonalInfo />
			<CompanyInfo />
			<Social socialinfo={socialInfo} />

			<div className="text-end">
				<button type="submit" className="btn btn-success mt-2">
					<i className="mdi mdi-content-save"></i> Save
				</button>
			</div>
		</RHForm>
	);
};

export default Settings;
