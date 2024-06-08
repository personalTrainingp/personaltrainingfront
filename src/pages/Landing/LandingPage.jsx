import NavBar from './NavBar';
import Hero from './Hero';
import Services from './Services';
import Layouts from './Layouts';
import Features from './Features';
import Pricing from './Pricing';
import FAQ from './FAQ';
import ContactUs from './ContactUs';
import Footer from './Footer';
import { services, layouts, features, plans, rawFaqs } from './data';
import { useAccountLayout } from '@/components/BGCircles';
import { PageBreadcrumb } from '@/components';

const LandingPage = () => {
	useAccountLayout();

	return (
		<>
			<PageBreadcrumb title="Landing" />
			{/* navbar */}
			<NavBar />

			{/* hero */}
			<Hero />

			{/* services */}
			<Services services={services} />

			{/* layouts */}
			<Layouts layouts={layouts} />

			{/* features */}
			<Features features={features} />

			{/* pricing */}
			<Pricing plans={plans} />

			{/* faqs */}
			<FAQ rawFaqs={rawFaqs} />

			{/* contact */}
			<ContactUs />

			{/* footer */}
			<Footer />
		</>
	);
};

export { LandingPage };
