import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import AppMenu from './Menu';

// assets
import profileImg from '@/assets/images/users/avatar-1.jpg';
// import logo from '@/assets/images/logo_pt.png';
import logoDark from '@/assets/images/change-logo-dark-transparente.png';
import { getMenuItems } from './utils/menu';

// const UserBox = () => {
// 	return (
// 		<div className="leftbar-user">
// 			<Link to="/pages/profile">
// 				<img
// 					src={profileImg}
// 					alt="user-image"
// 					height="42"
// 					className="rounded-circle shadow-sm"
// 				/>
// 				<span className="leftbar-user-name mt-2">Dominic Keller</span>
// 			</Link>
// 		</div>
// 	);
// };

const SideBarContent = () => {
	return (
		<>
			{/* <UserBox /> */}
			<AppMenu menuItems={getMenuItems()} />
			<div className="clearfix" />
		</>
	);
};

const LeftSidebar = ({ isCondensed, leftbarDark }) => {
	const menuNodeRef = useRef(null);
	/**
	 * Handle the click anywhere in doc
	 */
	const handleOtherClick = (e) => {
		if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target))
			return;
		// else hide the menubar
		if (document.body) {
			document.body.classList.remove('sidebar-enable');
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOtherClick, false);

		return () => {
			document.removeEventListener('mousedown', handleOtherClick, false);
		};
	}, []);

	return (
		<div className="leftside-menu" ref={menuNodeRef}>
			<Link to="/" className={`logo ${leftbarDark ? 'logo-light' : 'logo-dark'}`}>
				<span className="logo-lg p-2">
					<img src={leftbarDark ? logo : logoDark} alt="logo" width={'190'} style={{height: '50px'}} />
				</span>
			</Link>
			{!isCondensed && (
				<SimpleBar style={{ maxHeight: '100%' }} scrollbarMaxSize={320}>
					<SideBarContent />
				</SimpleBar>
			)}
			{/* {isCondensed && <SideBarContent />} */}
		</div>
	);
};

export default LeftSidebar;
