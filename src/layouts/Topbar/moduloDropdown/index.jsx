import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useToggle } from '@/hooks';
import { useRoleStore } from '@/hooks/hookApi/useRoleStore';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { onSetRangeDate, onViewSection } from '@/store/data/dataSlice';

// const modulos = [
// 	{
// 		name: 'Administracion',
//         path: '/adm',
// 		key: 'mod-adm'
// 	},
// 	{
// 		name: 'Ventas',
//         path: '/venta/seguimiento',
// 		key: 'mod-venta'
// 	}
// ];

const ModuloDropdown = () => {
	const dispatch = useDispatch()
	const { modulos } = useSelector(e=>e.rutas)
	const [moduloSelect, setModuloSelect] = useState(0);
	const { obtenerSeccions } = useRoleStore()
    const [isOpen, toggleDropdown] = useToggle();
	const handleModuloChange = (modulo) => {
		
		setModuloSelect(modulo);
		// dispatch(onSetRangeDate([]))
		dispatch(onViewSection(''))
		// obtenerSeccions(modulos[modulo])
	};

	useEffect(() => {
		obtenerSeccions(modulos[moduloSelect])
		
	}, [moduloSelect, modulos])
	
  return (
    <Dropdown show={isOpen} onToggle={toggleDropdown}>
			<Dropdown.Toggle
				variant="link"
				id="dropdown-languages"
				onClick={toggleDropdown}
				className="nav-link dropdown-toggle arrow-none"
			>
				<span className="align-middle d-sm-inline-block text-primary font-bold font-24">
					{modulos[moduloSelect]?.name}
				</span>
				<i className="mdi mdi-chevron-down d-sm-inline-block align-middle"></i>
			</Dropdown.Toggle>
			<Dropdown.Menu align={'end'} className="dropdown-menu-animated topbar-dropdown-menu">
				<div onClick={toggleDropdown}>
					{modulos.map((lang, i) => {
						return (
							<Link to={lang.path} onClick={() => handleModuloChange(i)} className="dropdown-item notify-item" key={i + '-mod'}>
								<span className="align-middle">{lang.name}</span>
							</Link>
						);
					})}
				</div>
			</Dropdown.Menu>
		</Dropdown>
  )
}

export default ModuloDropdown