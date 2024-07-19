import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import { useToggle } from '@/hooks';
import { useDispatch } from 'react-redux';
import { onLogout } from '@/store';
import { useAuthStore } from '@/hooks/useAuthStore';

const ProfileDropdown = ({ userTitle, username, menuItems, userImage }) => {
	const [isOpen, toggleDropdown] = useToggle();
	const { startLogout } = useAuthStore()

	return (
		<Dropdown show={isOpen} onToggle={toggleDropdown}>
			<Dropdown.Toggle
				variant="link"
				id="dropdown-profile"
				as={'button'}
				onClick={toggleDropdown}
				className="nav-link dropdown-toggle arrow-none nav-user px-2"
			>
				<span className="account-user-avatar">
					{/* <img src={userImage} className="rounded-circle" width={32} alt="user" /> */}
				</span>
				<span className="d-lg-flex flex-column gap-1 d-none">
					<h5 className="my-0">{username}</h5>
					<h6 className="my-0 fw-normal align-self-start">{userTitle}</h6>
				</span>
			</Dropdown.Toggle>
			<Dropdown.Menu align={'end'} className="dropdown-menu-animated profile-dropdown">
				<div onClick={toggleDropdown}>
					{menuItems.map((item, i) => {
						if(item.redirectTo ==='/account/logout'){
							return(
								<a
									to={item.redirectTo}
									className="dropdown-item notify-item"
									key={i + '-profile-menu'}
									onClick={()=>{
										startLogout()
									}}
								>
									<i className={classNames(item.icon, 'me-1')}></i>
									<span>{item.label}</span>
								</a>
							)
						}
						return (
							<Link
								to={item.redirectTo}
								className="dropdown-item notify-item"
								key={i + '-profile-menu'}
							>
								<i className={classNames(item.icon, 'me-1')}></i>
								<span>{item.label}</span>
							</Link>
						);
					})}
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default ProfileDropdown;
