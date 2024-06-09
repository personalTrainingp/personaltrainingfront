import { ThemeSettings, useThemeContext } from '@/common';
import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes as ReactRoutes } from 'react-router-dom';
import VerticalLayout from '@/layouts/Vertical';
import HorizontalLayout from '@/layouts/Horizontal';
import { useSelector } from 'react-redux';
import { useAuthStore } from '@/hooks/useAuthStore';
import Account from '@/pages/account';
import { Home } from '@/pages/pagePT/Home';
import { PerfilPrograma } from '@/pages/pagePT/GestProgramas/PerfilPrograma';
import { useRoleStore } from '@/hooks/hookApi/useRoleStore';




const NuevaVenta = lazy(() => import('../pages/pagePT/nuevaVenta'));
const Seguimiento = lazy(() => import('../pages/pagePT/seguimiento'));
const TotaldeVentas = lazy(() => import('../pages/pagePT/reportes/totalVentas'));
const VentasPrograma = lazy(() => import('../pages/pagePT/reportes/ventasPrograma'));
const VentasAsesor = lazy(() => import('../pages/pagePT/reportes/ventasAsesor'));
const GestionProveedores = lazy(() => import('../pages/pagePT/GestProveedores'));
const GestionProductos = lazy(() => import('../pages/pagePT/GestProductos'));
const GestionProgramas = lazy(() => import('../pages/pagePT/GestProgramas'));
const GestionFyG = lazy(() => import('../pages/pagePT/GestGastos'));
const GestionEmpleados = lazy(() => import('../pages/pagePT/GestEmpleados'));
const CrearCitasNutricionales = lazy(() => import('../pages/pagePT/GestNutricion'));
const GestionUsuario = lazy(() => import('../pages/pagePT/GestAuthUser'));
const PerfilCliente = lazy(() => import('../pages/pagePT/PerfilCliente'));
const GestionClientes = lazy(()=> import('../pages/pagePT/GestClientes'))
const GestionMeta = lazy(()=> import('../pages/pagePT/GestBonosyMetas'))
const GestionDescuentos= lazy(()=> import('../pages/pagePT/GestDescuentos'))
const PerfilEmpleado = lazy(()=> import('../pages/pagePT/GestEmpleados/Perfil'))
const GestionVenta = lazy(() => import('../pages/pagePT/GestVentas'));
// const PerfilPrograma = lazy(()=> import('../pages/pagePT/GestProgramas/PerfilPrograma'))
/**
 * routes import
 */
const OtherPages = lazy(() => import('../pages/otherpages'));
const Error404Alt = lazy(() => import('../pages/otherpages/Error404Alt'));

export default function ProtectedRoutes() {
	const { settings } = useThemeContext();
	const Layout =
		settings.layout.type == ThemeSettings.layout.type.vertical
			? VerticalLayout
			: HorizontalLayout;

	// const {status} = useSelector(u=>u.auth)
	
	const { status, checkAuthToken } = useAuthStore()
	// const {obtenerModulos} = useRoleStore()
	const { sections } = useSelector(e=>e.rutas)
	// useEffect(() => {
	// 	obtenerModulos()
	// }, [])
	useEffect(() => {checkAuthToken()}, [])
	if (status === 'checking') {
		return(
			<h3>Cargando...</h3>
		)
	}
	// console.log(sections);
	// console.log(sections.find(e=>e.key==='config')?'hay':'nop');
	return (
	<ReactRoutes>
		{
			status  === 'authenticated' ? (
				<>
				<Route path="/*" element={<Layout />}>
					{sections.find(e=>e.url==='/nueva-venta')&&
						<Route path="nueva-venta" element={<NuevaVenta />} />
					}
					{sections.find(e=>e.url==='/seguimiento')&&
						<Route path="seguimiento" element={<Seguimiento />} />
					}
					{
						sections.find(e=>e.url==='/reporte/total-ventas')&&
                        <Route path='reporte/total-ventas' element={<TotaldeVentas/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte/ventas-programas')&&
                        <Route path='reporte/ventas-programas' element={<VentasPrograma/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte/ventas-asesor')&&
                        <Route path='reporte/ventas-asesor' element={<VentasAsesor/>}/>
					}
					{
						sections.find(e=>e.url==='/gestion-proveedores')&&
                        <Route path='gestion-proveedores' element={<GestionProveedores/>}/>
					}
					{
						sections.find(e=>e.url==='/gestion-productos')&&
                        <Route path='gestion-productos' element={<GestionProductos/>}/>
					}
					{
						sections.find(e=>e.url==='/gestion-programas')&&
                        <Route path='gestion-programas' element={<GestionProgramas/>}/>
					}
					{
						sections.find(e=>e.url==='/gestion-gastosF-gastosV')&&
                        <Route path='gestion-gastosF-gastosV' element={<GestionFyG/>}/>
					}
					{
						sections.find(e=>e.url==='/gestion-empleados')&&
						<>
							<Route path='gestion-empleados' element={<GestionEmpleados/>}/>
							<Route path='perfil-colaborador/:uid' element={<PerfilEmpleado/>}/>
						</>
					}
					{
						sections.find(e=>e.url==='/gestion-nutricion')&&
                        <Route path='gestion-nutricion' element={<CrearCitasNutricionales/>}/>
					}
					{
						sections.find(e=>e.url==='/gestion-clientes')&&
						<>
							<Route path='gestion-clientes' element={<GestionClientes/>}/>
							<Route path='historial-cliente/:uid' element={<PerfilCliente/>}/>
						</>
					}
					{
						sections.find(e=>e.url==='/gestion-ventas')&&
                        <Route path='gestion-ventas' element={<GestionVenta/>}/>
					}
					{sections.find(e=>e.url==='/gestion-auth-usuario')&&
					<Route path='gestion-auth-usuario' element={<GestionUsuario/>}/>
					}
					{sections.find(e=>e.url==='/metas')&&
					<Route path='metas' element={<GestionMeta/>}/>
					}
					<Route path='programa/:uid' element={<PerfilPrograma/>}/>
					<Route path='gestion-descuentos' element={<GestionDescuentos/>}/>
					<Route path="pages/*" element={<OtherPages />} />
					<Route path='home' element={<Home/>}/>
					<Route path='*' element={<Navigate to={"/home"}/>}/>
				</Route>
				</>
		)
		: (
			<>
			<Route path="account/*" element={<Account />} />
			<Route path='/*' element={<Navigate to={"/account/login"}/>}/>
			</>
			// <Navigate to={"/account/login"} replace/>
			// <Navigate to="/account/login" replace />
		)
		}
		</ReactRoutes>

	)
}
