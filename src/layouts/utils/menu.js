import { HORIZONTAL_MENU_ITEMS, MENU_ITEMS } from '@/common/menu-items';
import { useSelector } from 'react-redux';

const getMenuItems = () => {
	// NOTE - You can fetch from server and return here as well
	const { sections } = useSelector((e) => e.rutas);
	return sections;
};

const getHorizontalMenuItems = () => {
	// NOTE - You can fetch from server and return here as well
	return HORIZONTAL_MENU_ITEMS;
};

const findAllParent = (menuItems, menuItem) => {
	let parents = [];
	const parent = findMenuItem(menuItems, menuItem['parentKey']);

	if (parent) {
		parents.push(parent['key']);
		if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
	}
	return parents;
};

const findMenuItem = (menuItems, menuItemKey) => {
	if (menuItems && menuItemKey) {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].key === menuItemKey) {
				return menuItems[i];
			}
			const found = findMenuItem(menuItems[i].children, menuItemKey);
			if (found) return found;
		}
	}
	return null;
};

export { getMenuItems, getHorizontalMenuItems, findAllParent, findMenuItem };
