
const SideBarUserInfo = ({
	handleToggleSideBarUserInfo,
	showSideBarUserInfo,
}) => {
	return (
		<div id="sidebar-user">
			<div className="d-flex justify-content-between align-items-center mt-3">
				<label className="font-16 fw-bold m-0" htmlFor="sidebaruser-check">
					Sidebar User Info
				</label>
				<div className="form-check form-switch">
					<input
						type="checkbox"
						className="form-check-input"
						name="sidebar-user"
						id="sidebaruser-check"
						onChange={(e) => handleToggleSideBarUserInfo(e.target.checked)}
						defaultChecked={showSideBarUserInfo}
					/>
				</div>
			</div>
		</div>
	);
};

export default SideBarUserInfo;
