import { Link } from 'react-router-dom';
import { notifications, profileMenus, searchOptions } from './data';
// import LanguageDropdown from './LanguageDropdown';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SearchDropdown from './SearchDropdown';
import TopbarSearch from './TopbarSearch';
// import AppsDropdown from './AppsDropdown';
import MaximizeScreen from './MaximizeScreen';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

// assets
import userImage from '@/assets/images/users/avatar-1.jpg';
import { ThemeSettings, useThemeContext } from '@/common';
import useThemeCustomizer from '@/components/ThemeCustomizer/useThemeCustomizer';
import { useViewport } from '@/hooks';
import ModuloDropdown from './moduloDropdown';
import { useSelector } from 'react-redux';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect } from 'react';
import { arrayRoles } from '@/types/type';

const Topbar = ({ topbarDark, toggleMenu, navOpen }) => {
	const { settings, updateSettings, updateSidebar } = useThemeContext();
	const { user } = useSelector(e=>e.auth)
	const { sideBarType } = useThemeCustomizer();
	const { obtenerUser, usuarioObtenido } = useAuthStore()

	const { width } = useViewport();
	/**
	 * Toggle the leftmenu when having mobile screen
	 */
	// const uid_user = localStorage.getItem('uid-user')
	const handleLeftMenuCallBack = () => {
		if(width< 768){
			if(sideBarType === 'full'){
				showLeftSideBarBackdrop();
				document.getElementsByTagName('html')[0].classList.add('sidebar-enable');
			}
		}
		else if(width < 1140){
			if(sideBarType === 'full'){
				showLeftSideBarBackdrop();
				document.getElementsByTagName('html')[0].classList.add('sidebar-enable');
			}
		}
		else if(width>= 1140){
			if(sideBarType==='default'){
				updateSidebar({ size: ThemeSettings.sidebar.size.fullscreen });
			}
			else if(sideBarType==='fullscreen'){
				updateSidebar({ size: ThemeSettings.sidebar.size.default });
			}
		}
	};

	/**
	 * creates backdrop for leftsidebar
	 */
	function showLeftSideBarBackdrop() {
		const backdrop = document.createElement('div');
		backdrop.id = 'custom-backdrop';
		backdrop.className = 'offcanvas-backdrop fade show';
		document.body.appendChild(backdrop);

		backdrop.addEventListener('click', function () {
			document.getElementsByTagName('html')[0].classList.remove('sidebar-enable');
			hideLeftSideBarBackdrop();
		});
	}

	function hideLeftSideBarBackdrop() {
		const backdrop = document.getElementById('custom-backdrop');
		if (backdrop) {
			document.body.removeChild(backdrop);
			document.body.style.removeProperty('overflow');
		}
	}

	/**
	 * Toggle Dark Mode
	 */
	const toggleDarkMode = () => {
		if (settings.theme === 'dark') {
			updateSettings({ theme: ThemeSettings.theme.light });
		} else {
			updateSettings({ theme: ThemeSettings.theme.dark });
		}
	};

	/**
	 * Toggles the right sidebar
	 */
	const handleRightSideBar = () => {
		updateSettings({ rightSidebar: ThemeSettings.rightSidebar.show });
	};
	useEffect(() => {
		obtenerUser()
		console.log("usuario presente");
	}, [])
	return (
		<div className={'navbar-custom'}>
			<div className="topbar container-fluid">
				<div className="d-flex align-items-center gap-lg-2 gap-1">
					<button className="button-toggle-menu" onClick={handleLeftMenuCallBack}>
						<i className="mdi mdi-menu" />
					</button>
					<strong>
						Estas en el modulo de 
					</strong>
						<ModuloDropdown/>
					{/* <button
						className={`navbar-toggle ${navOpen ? 'open' : ''}`}
						onClick={toggleMenu}
					>
						<div className="lines">
							<span />
							<span />
							<span />
						</div>
					</button> */}
					{/* <TopbarSearch options={searchOptions} /> */}
				</div>

				<ul className="topbar-menu d-flex align-items-center gap-3">
					<li className="d-sm-inline-block">
						<OverlayTrigger
							placement="left"
							overlay={<Tooltip id="dark-mode-toggler">Theme Mode</Tooltip>}
						>
							<div className="nav-link" id="light-dark-mode" onClick={toggleDarkMode}>
								<i className="ri-moon-line font-22" />
							</div>
						</OverlayTrigger>
					</li>

					{/* <li className="d-none d-md-inline-block">
						<MaximizeScreen />
					</li> */}

					<li className="dropdown">
						<ProfileDropdown
							userImage={userImage}
							menuItems={profileMenus}
							username={usuarioObtenido.usuario_user?usuarioObtenido.usuario_user:'unnamed'}
							userTitle={`Rol: ${usuarioObtenido.rol_user?arrayRoles.find(e=>e.value===usuarioObtenido.rol_user).label:'SIN ROLE'}`}
						/>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Topbar;
