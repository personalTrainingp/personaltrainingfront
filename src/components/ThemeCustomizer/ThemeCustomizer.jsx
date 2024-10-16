import LayoutPosition from './LayoutPosition';
import LayoutTheme from './LayoutTheme';
import LayoutType from './LayoutType';
import LayoutWidth from './LayoutWidth';
import SideBarType from './SideBarType';
import SideBarTheme from './SideBarTheme';
import SideBarUserInfo from './SideBarUserInfo';
import TopBarTheme from './TopBarTheme';
import useThemeCustomizer from './useThemeCustomizer';
import { ThemeSettings } from '@/common/context';

const ThemeCustomizer = () => {
	const {
		layoutType,
		layoutTheme,
		layoutWidth,
		topBarTheme,
		sideBarTheme,
		sideBarType,
		layoutPosition,
		showSideBarUserInfo,
		handleChangeLayoutType,
		handleChangeLayoutTheme,
		handleChangeLayoutWidth,
		handleChangeTopBarTheme,
		handleChangeSideBarTheme,
		handleChangeSideBarType,
		handleChangeLayoutPosition,
		handleToggleSideBarUserInfo,
	} = useThemeCustomizer();

	return (
		<div className="card mb-0 p-3">
			<LayoutType
				handleChangeLayoutType={handleChangeLayoutType}
				layoutType={layoutType}
				layoutConstants={ThemeSettings.layout.type}
			/>

			<LayoutTheme
				handleChangeLayoutTheme={handleChangeLayoutTheme}
				layoutTheme={layoutTheme}
				layoutConstants={ThemeSettings.theme}
			/>

			<LayoutWidth
				handleChangeLayoutWidth={handleChangeLayoutWidth}
				layoutWidth={layoutWidth}
				layoutConstants={ThemeSettings.layout.mode}
			/>

			<TopBarTheme
				handleChangeTopBarTheme={handleChangeTopBarTheme}
				topBarTheme={topBarTheme}
				layoutConstants={ThemeSettings.topbar.theme}
			/>

			<SideBarTheme
				handleChangeSideBarTheme={handleChangeSideBarTheme}
				sideBarTheme={sideBarTheme}
				layoutConstants={ThemeSettings.sidebar.theme}
			/>

			<SideBarType
				handleChangeSideBarType={handleChangeSideBarType}
				sideBarType={sideBarType}
				layoutConstants={ThemeSettings.sidebar.size}
			/>

			<LayoutPosition
				handleChangeLayoutPosition={handleChangeLayoutPosition}
				layoutPosition={layoutPosition}
				layoutConstants={ThemeSettings.layout.menuPosition}
			/>

			<SideBarUserInfo
				handleToggleSideBarUserInfo={handleToggleSideBarUserInfo}
				showSideBarUserInfo={showSideBarUserInfo}
			/>
		</div>
	);
};

export default ThemeCustomizer;
