import DefaultLayout from '@/layouts/Default';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Login = lazy(() => import('./Login'));

export default function Account() {
	return (
		<Routes>
			<Route path="/*" element={<DefaultLayout />}>
				<Route index element={<Login />} />
				<Route path="login" element={<Login />} />
			</Route>
		</Routes>
	);
}
