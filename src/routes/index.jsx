import { Route, Routes as ReactRoutes } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';

export default function AppRoutes() {
	return (
		<ReactRoutes>
			<Route path="/*" element={<ProtectedRoutes />} />
			{/* <Route path="/error/*" element={<ErrorPages />} />
			<Route path="/landing" element={<LandingPage />} />
			<Route path="*"  element={<ErrorPageNotFound />} /> */}
		</ReactRoutes>
	);
}
