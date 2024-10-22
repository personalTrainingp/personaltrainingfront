import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useToggle } from '@/hooks';
import { useRoleStore } from '@/hooks/hookApi/useRoleStore';
import { useSelector } from 'react-redux';

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
const modulosNEW = [
	{
		name: 'Administracion',
        path: '/adm',
		secciones: [
			{
				key: 'cliente-admClientes',
				label: 'Administrador de clientes',
				isTitle: false,
				icon: 'uil-calender',
				url: '/gestion-clientes',
			},
			{
				key: 'colaboradores-admColaboradores',
				label: 'Colaboradores',
				isTitle: false,
				icon: 'uil-calender',
				url: '/gestion-empleados',
			},
			{
				key: 'gestion-pgms',
				label: 'Gestion de programas',
				isTitle: false,
				icon: 'uil-calender',
				url: '/gestion-programas',
			},
			{
				key: 'gestion-prds',
				label: 'Productos',
				isTitle: false,
				icon: 'uil-calender',
				url: '/gestion-productos',
			}
		]
	},
	{
		name: 'Ventas',
        path: '/venta/seguimiento',
		secciones:[
			{
				key: 'ventas',
				label: 'Ventas',
				isTitle: true,
			},
			{
				key: 'ventas-nuevaVenta',
				label: 'Nueva venta',
				isTitle: false,
				icon: 'uil-calender',
				url: '/nueva-venta',
			},
			{
				key: 'ventas-seguimiento',
				label: 'Seguimiento',
				isTitle: false,
				icon: 'uil-calender',
				url: '/seguimiento',
			},
			{
				key: 'gest-prov',
				label: 'Gestion de proveedores',
				isTitle: false,
				icon: 'uil-calender',
				url: '/gestion-proveedores',
			}
		]
	}
]

const ModuloDropdown = () => {
	const { modulos } = useSelector(e=>e.rutas)
	const [moduloSelect, setModuloSelect] = useState(0);
	const { obtenerSeccions } = useRoleStore()
    const [isOpen, toggleDropdown] = useToggle();
	const handleModuloChange = (modulo) => {
		
		setModuloSelect(modulo);
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
					{modulos[0]?.name}
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