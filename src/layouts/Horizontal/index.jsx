import React, { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useToggle } from '@/hooks';
import { useThemeContext } from '@/common/context';
import { changeHTMLAttribute } from '@/utils';

const Topbar = React.lazy(() => import('../Topbar/'));
const Navbar = React.lazy(() => import('./Navbar'));

const loading = () => <div className="text-center"></div>;

const HorizontalLayout = () => {
	const { settings } = useThemeContext();
	const [horizontalDropdownOpen, toggleMenu] = useToggle();

	/*
	 * layout defaults
	 */
	useEffect(() => {
		changeHTMLAttribute('data-layout', 'topnav');

		return () => {
			document.getElementsByTagName('html')[0].removeAttribute('data-layout');
		};
	}, []);

	useEffect(() => {
		changeHTMLAttribute('data-bs-theme', settings.theme);
	}, [settings.theme]);

	useEffect(() => {
		changeHTMLAttribute('data-layout-mode', settings.layout.mode);
	}, [settings.layout.mode]);

	useEffect(() => {
		changeHTMLAttribute('data-menu-color', settings.sidebar.theme);
	}, [settings.sidebar.theme]);

	useEffect(() => {
		changeHTMLAttribute('data-topbar-color', settings.topbar.theme);
	}, [settings.topbar.theme]);

	useEffect(() => {
		changeHTMLAttribute('data-layout-position', settings.layout.menuPosition);
	}, [settings.layout.menuPosition]);

	return (
		<div className="wrapper">
			<Suspense fallback={loading()}>
				<Topbar
					toggleMenu={toggleMenu}
					navOpen={horizontalDropdownOpen}
					topbarDark={true}
				/>
			</Suspense>

			<Suspense fallback={loading()}>
				<Navbar isMenuOpened={horizontalDropdownOpen} />
			</Suspense>

			<div className="content-page">
				<div className="content">
					<Container fluid>
						<Suspense fallback={loading()}>
							<Outlet />
						</Suspense>
					</Container>
				</div>


			</div>
		</div>
	);
};

export default HorizontalLayout;
