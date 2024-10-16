import { PageLoader } from '@/components';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
	return (
		<Suspense fallback={<PageLoader />}>
			<Outlet />
		</Suspense>
	);
};
export default DefaultLayout;
