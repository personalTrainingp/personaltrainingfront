import { Link } from 'react-router-dom';
import { notifications, profileMenus, searchOptions } from './data';
// import LanguageDropdown from './LanguageDropdown';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SearchDropdown from './SearchDropdown';
import TopbarSearch from './TopbarSearch';
// import AppsDropdown from './AppsDropdown';
import MaximizeScreen from './MaximizeScreen';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';

// assets
import userImage from '@/assets/images/users/avatar-1.jpg';
import { ThemeSettings, useThemeContext } from '@/common';
import useThemeCustomizer from '@/components/ThemeCustomizer/useThemeCustomizer';
import { useViewport } from '@/hooks';
import ModuloDropdown from './moduloDropdown';
import { useSelector } from 'react-redux';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect, useState } from 'react';
import { arrayRoles } from '@/types/type';

import logoDark from '@/assets/images/change-logo-dark-transparente.png';
import logoCircus from '@/assets/images/circus.png';
import logoSE from '@/assets/images/isesac.png';
import dayjs from 'dayjs';
const Topbar = ({ topbarDark, toggleMenu, navOpen }) => {
	const { settings, updateSettings, updateSidebar } = useThemeContext();
	const { user } = useSelector(e=>e.auth)
	const { sideBarType } = useThemeCustomizer();
	const { obtenerUser, usuarioObtenido } = useAuthStore()
	const { section_item } = useSelector(f=>f.DATA)
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
	const { RANGE_DATE } = useSelector(e=>e.DATA)
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
	const options = [
	{ src: logoDark, url: 'https://localhost:5174/reporte-admin/flujo-caja', w: '280px', h: 'auto' },
	{ src: logoCircus, url: 'https://change-the-slim-studio-sigma.vercel.app/reporte-admin/flujo-caja', w: '180px', h: '150px' },
	{ src: logoSE, url: 'https://localhost:5173/reporte-admin/flujo-caja', w: '250px', h: 'auto' },
	];
	  // Estado para llevar el logo seleccionado; por defecto, logoDark
  const [selectedLogo, setSelectedLogo] = useState(options[0]);

	// Función que maneja el cambio de logo cuando el usuario hace clic en un item
	const handleSelect = (opt) => {
		// window.location.href = opt.url;
		setSelectedLogo(opt);
			
	};
	const { colorEmpresa } = useSelector(e=>e.ui)

	return (
		<div className={'navbar-custom d-flex'} style={{height: '8rem'}}>
			<div className="topbar container-fluid">
				<div className="d-flex align-items-center gap-lg-2 gap-1">
					<button className="button-toggle-menu" onClick={handleLeftMenuCallBack}>
						<i className="mdi mdi-menu" />
					</button>
					<strong>
						modulo
					</strong>
						<ModuloDropdown colorEmpresa={colorEmpresa}/>
						{section_item && (
						<h3 style={{color: colorEmpresa}} className="text-uppercase fw-bolder d-flex justify-content-center align-items-center">
							<span className='fs-1'> / </span>
							<div className='mx-2'> {section_item==='d1'?<>RESUMEN COMPARATIVO MENSUAL <span className='text-primary fs-1'>POR ASESOR</span> Y CATEGORIA</>:section_item} </div>
							<span className='fs-1'> / </span>
							<div className='mx-2'> {RANGE_DATE[0] instanceof Date?dayjs(RANGE_DATE[0]).format('dddd DD [DE] MMMM [DEL] YYYY'):RANGE_DATE[0]} <br/> {dayjs(RANGE_DATE[1]).format('dddd DD [DE] MMMM YYYY')}</div> 
						</h3>
						)}
				</div>	
				<ul className=" d-flex align-items-center gap-3">
					<li>
						<Dropdown>
							{/* El Toggle muestra siempre la imagen actualmente seleccionada */}
							<Dropdown.Toggle
								as="div"
								style={{ cursor: 'pointer' }}
								id="dropdown-logo"
							>
								<img
								src={selectedLogo.src}
								alt="logo seleccionado"
								//width={selectedLogo.w} inversiones san expedito=>250px
								style={{ height: selectedLogo.h, width: selectedLogo.w}}
								/>
							</Dropdown.Toggle>
								<Dropdown.Menu>
									{options.map((opt, idx) => (
									<Dropdown.Item
										key={idx}
										onClick={() => handleSelect(opt)}
									>
										<img
										src={opt.src}
										alt={`logo opción ${idx}`}
										width={150}
										style={{ height: 'auto' }}
										/>
									</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
					</li>
					
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
