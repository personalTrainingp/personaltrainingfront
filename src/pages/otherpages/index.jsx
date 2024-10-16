import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Profile = lazy(() => import('./Profile'));
const Profile2 = lazy(() => import('./Profile2'));
const Invoice = lazy(() => import('./Invoice'));
const FAQ = lazy(() => import('./FAQ'));
const Pricing = lazy(() => import('./Pricing'));
const Error404Alt = lazy(() => import('./Error404Alt'));
const Starter = lazy(() => import('./Starter'));
const Preloader = lazy(() => import('./Preloader'));
const Timeline = lazy(() => import('./Timeline'));

export default function OtherPages() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="profile" element={<Profile />} />
				<Route path="profile2" element={<Profile2 />} />
				<Route path="invoice" element={<Invoice />} />
				<Route path="faq" element={<FAQ />} />
				<Route path="pricing" element={<Pricing />} />
				<Route path="404-alt" element={<Error404Alt />} />
				<Route path="starter" element={<Starter />} />
				<Route path="preloader" element={<Preloader />} />
				<Route path="timeline" element={<Timeline />} />
			</Route>
		</Routes>
	);
}
