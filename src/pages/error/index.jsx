import DefaultLayout from '@/layouts/Default';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const PageNotFound = lazy(() => import('./PageNotFound'));
const ServerError = lazy(() => import('./ServerError'));
const Maintenance = lazy(() => import('./Maintenance'));

const ErrorPages = () => {
	return (
		<Routes>
			<Route path="/*" element={<DefaultLayout />}>
				<Route path="404" element={<PageNotFound />} />
				<Route path="500" element={<ServerError />} />
				<Route path="maintenance" element={<Maintenance />} />
			</Route>
		</Routes>
	);
};

export default ErrorPages;
