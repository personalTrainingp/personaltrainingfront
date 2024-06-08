import { Row, Col } from 'react-bootstrap';
import { PageBreadcrumb, TodoList } from '@/components';
import Statistics from './Statistics';
import CampaignsChart from './CampaignsChart';
import RevenueChart from './RevenueChart';
import Performers from './Performers';
import Leads from './Leads';
import CampaignWidget from './CampaignWidget';
import { topPerformanceData, recentLeads } from './data';
import { usePreloader } from './hooks';

const PreloaderPage = () => {
	usePreloader();

	return (
		<>
			<div id="preloader">
				<div id="status">
					<div className="bouncing-loader">
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			</div>
			<PageBreadcrumb title="With Preloader" subName="Pages" />

			<Statistics />

			<Row>
				<Col lg={5}>
					<CampaignsChart />
				</Col>
				<Col lg={7}>
					<RevenueChart />
				</Col>
			</Row>

			<Row>
				<Col xl={4} lg={12}>
					<Performers topPerformanceData={topPerformanceData} />
				</Col>
				<Col xl={4} lg={6}>
					<Leads recentLeads={recentLeads} />
				</Col>
				<Col xl={4} lg={6}>
					<CampaignWidget />
					<TodoList height="224px" />
				</Col>
			</Row>
		</>
	);
};

export { PreloaderPage };
