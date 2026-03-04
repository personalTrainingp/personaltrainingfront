import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Collapse } from 'react-bootstrap';
import { ThemeSettings, useThemeContext } from '@/common';
import { findAllParent, findMenuItem } from './utils/menu';
import { useDispatch } from 'react-redux';
import { onSetDataView } from '@/store/data/dataSlice';
import ModuloDropdown from './Topbar/moduloDropdown';
import { useSelector } from 'react-redux';

const MenuItemWithChildren = ({
  item,
  linkClassName,
  subMenuClassNames,
  activeMenuItems,
  toggleMenu,
}) => {
  const [open, setOpen] = useState(activeMenuItems.includes(item.key));

  const { settings } = useThemeContext();

  const collapseClass = settings.sidebar.size === ThemeSettings.sidebar.size.condensed;

  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = (e) => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };
  return (
    <li className={classNames('side-nav-item', { 'menuitem-active': open })}>
      <Link
        to="#"
        onClick={toggleMenuItem}
        data-menu-key={item.key}
        aria-expanded={open}
        className={linkClassName}
      >
        {item.icon && <i className={item.icon}></i>}
        <span className='fs-4 ml-3'> {item.label} </span>
      </Link>
      <Collapse in={open}>
        <div className={collapseClass ? 'collapse' : ''}>
          <ul className={classNames(subMenuClassNames)} id="sidebarDashboards">
            {(item.children || []).map((child, index) => {
              return (
                <React.Fragment key={child.key}>
                  {child.children ? (
                    <MenuItemWithChildren
                      item={child}
                      linkClassName={
                        activeMenuItems.includes(child.key) ? 'active' : ''
                      }
                      activeMenuItems={activeMenuItems}
                      subMenuClassNames="side-nav-third-level"
                      toggleMenu={toggleMenu}
                    />
                  ) : (
                    <MenuItem
                      item={child}
                      className={
                        activeMenuItems.includes(child.key)
                          ? 'menuitem-active'
                          : ''
                      }
                      linkClassName={
                        activeMenuItems.includes(child.key) ? 'active' : ''
                      }
                    />
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </Collapse>
    </li>
  );
};

const MenuItem = ({ item, className, linkClassName }) => {
  return (
    <li className={className}>
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );

};
const MenuItemLink = ({ item, className }) => {
  return (
    <Link
      to={item.url}
      target={item.target}
      className={`side-nav-link-ref ${className}`}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {item.icon ? (
        <>
          <i className={item.icon}></i>
          <div className='ml-3' style={{ whiteSpace: 'normal' }}>&nbsp; {item.label}</div>
        </>
      ) : (
        <>
          {item.label}
        </>
      )}
    </Link>
  );
};


const AppMenu = ({ menuItems }) => {
  const location = useLocation();

  const menuRef = useRef(null);

  const [activeMenuItems, setActiveMenuItems] = useState([]);
  /*
   * toggle the menus
   */
  const toggleMenu = (menuItem, show) => {
    if (show) setActiveMenuItems([menuItem['key'], ...findAllParent(menuItems, menuItem)]);
  };

  /**
   * activate the menuitems
   */
  const activeMenu = useCallback(() => {
    const div = document.getElementById('main-side-menu');
    let matchingMenuItem = null;

    if (div) {
      const items = div.getElementsByClassName(
        'side-nav-link-ref'
      );
      for (let i = 0; i < items.length; ++i) {
        if (location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('data-menu-key');
        const activeMt = findMenuItem(menuItems, mid);
        if (activeMt) {
          setActiveMenuItems([activeMt['key'], ...findAllParent(menuItems, activeMt)]);
        }
      }
    }
  }, [location.pathname, menuItems]);

  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

	const { colorEmpresa } = useSelector(e=>e.ui)
  return (
    <>
      <div className='d-flex justify-content-center flex-column ml-3 mb-3'>
        <strong className='mb-1'>
          módulo
        </strong>
        <div>
          <ModuloDropdown colorEmpresa={colorEmpresa}/>
        </div>
      </div>
      <ul className="side-nav" ref={menuRef} id="main-side-menu">
        {(menuItems || []).map((item, index) => {
          return (
            <React.Fragment key={index.toString()}>
              {
              (
                <React.Fragment>
                  {item.children ? (
                    <MenuItemWithChildren
                      item={item}
                      toggleMenu={toggleMenu}
                      subMenuClassNames="side-nav-second-level"
                      activeMenuItems={activeMenuItems}
                      linkClassName="side-nav-link"
                    />
                  ) : (
                    <MenuItem
                      item={item}
                      linkClassName="side-nav-link"
                      className={`side-nav-item ${activeMenuItems.includes(item.key) ? 'menuitem-active' : ''}`}
                    />
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}

      </ul>
    </>
  );
};

export default AppMenu;
