import { Link } from 'react-router-dom';
import { Dropdown, Row } from 'react-bootstrap';
import slackIcon from './icons/slack.png';
import bitbucketIcon from './icons/bitbucket.png';
import dribbbleIcon from './icons/dribbble.png';
import dropboxIcon from './icons/dropbox.png';
import githubIcon from './icons/github.png';
import gSuiteIcon from './icons/g-suite.png';
import { splitArray } from '@/utils';
import { useToggle } from '@/hooks';

// get the apps
const apps = [
	{
		name: 'Slack',
		icon: slackIcon,
		redirectTo: '#',
	},
	{
		name: 'GitHub',
		icon: githubIcon,
		redirectTo: '#',
	},
	{
		name: 'Dribbble',
		icon: dribbbleIcon,
		redirectTo: '#',
	},
	{
		name: 'Bitbucket',
		icon: bitbucketIcon,
		redirectTo: '#',
	},
	{
		name: 'Dropbox',
		icon: dropboxIcon,
		redirectTo: '#',
	},
	{
		name: 'G Suite',
		icon: gSuiteIcon,
		redirectTo: '#',
	},
];

const AppsDropdown = () => {
	const chunk_size = 3;
	const appsChunks = splitArray(apps, chunk_size);
	const [isOpen, toggleDropdown] = useToggle();

	return (
		<Dropdown show={isOpen} onToggle={toggleDropdown}>
			<Dropdown.Toggle
				variant="link"
				id="dropdown-apps"
				onClick={toggleDropdown}
				className="nav-link dropdown-toggle arrow-none"
			>
				<i className="ri-apps-2-line font-22"></i>
			</Dropdown.Toggle>

			<Dropdown.Menu align={'end'} className="dropdown-menu-animated dropdown-lg p-0">
				<div onClick={toggleDropdown} className="p-2">
					{appsChunks.map((chunk, index) => (
						<Row className="g-0" key={index.toString()}>
							{chunk.map((item, index1) => (
								<div className="col" key={index1.toString()}>
									<Link className="dropdown-icon-item" to={item.redirectTo}>
										<img src={item.icon} alt="" />
										<span>{item.name}</span>
									</Link>
								</div>
							))}
						</Row>
					))}
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default AppsDropdown;
