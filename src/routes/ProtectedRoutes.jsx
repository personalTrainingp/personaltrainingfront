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
import CrearCitasNutricion from '@/pages/pagePT/GestNutricion';
import GestCongelamiento from '@/pages/pagePT/GestCongelamiento';
import { Skeleton } from 'primereact/skeleton';




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
const GestionUsuario = lazy(() => import('../pages/pagePT/GestAuthUser'));
const PerfilCliente = lazy(() => import('../pages/pagePT/PerfilCliente'));
const GestionClientes = lazy(()=> import('../pages/pagePT/GestClientes'))
const GestionMeta = lazy(()=> import('../pages/pagePT/GestBonosyMetas'))
const GestionDescuentos= lazy(()=> import('../pages/pagePT/GestDescuentos'))
const PerfilEmpleado = lazy(()=> import('../pages/pagePT/GestEmpleados/Perfil'))
const GestionVenta = lazy(() => import('../pages/pagePT/GestVentas'));
const GestionProspectos = lazy(()=> import('../pages/pagePT/GestProspectos'))
const GestionExtensionMembresia = lazy(()=> import('../pages/pagePT/GestExtensionMembresia'))
const GestionAuditoria = lazy(()=> import('../pages/pagePT/Auditoria'))
const GestionComision = lazy(()=> import('../pages/pagePT/GestComision'))
const ServFitology = lazy(()=> import('../pages/pagePT/ServFitology'))
const ServNutricion = lazy(()=> import('../pages/pagePT/ServNutricion'))
const ReportePorProgramas = lazy(()=>import('../pages/pagePT/reportes/ventasPrograma'))
const ReporteTotalVentas = lazy(()=>import('../pages/pagePT/reportes/totalVentas'))
const ReporteVentasAsesor = lazy(()=>import('../pages/pagePT/reportes/ventasAsesor'))
const ReporteVentasporSemana = lazy(()=>import('../pages/pagePT/reportes/ventaPorSemana'))
const AportesIngresos = lazy(()=>import('../pages/pagePT/GestAportesIngresos'))
const Terminologias = lazy(()=>import('../pages/pagePT/Terminologias'))
const ReporteEgresos = lazy(()=>import('../pages/pagePT/reportes/reporteEgresos'))
const ReporteGerenciales = lazy(()=>import('../pages/pagePT/reportes/reporteGerenciales'))
// const CrearCitasNutricionales = lazy(() => import('../pages/pagePT/GestNutricion'));
// const CrearCitasFitology = lazy(()=>import('../pages/pagePT/CrearCitasFitology'))
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
			<div className="border-round border-1 surface-border p-4 d-flex">
				<Skeleton width="300px" height="85vh" className='m-2'></Skeleton>
				<Skeleton width="100%" height="85vh" className='m-2'></Skeleton>
			</div>
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
						sections.find(e=>e.url==='/crear-citas-nutricion')&&
                        <Route path='crear-citas-nutricion' element={<CrearCitasNutricion tipo_serv={'NUTRIC'}/>}/>
					}
					{
						sections.find(e=>e.url==='/crear-citas-fitology')&&
                        <Route path='crear-citas-fitology' element={<CrearCitasNutricion tipo_serv={'FITOL'}/>}/>
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
					{
						sections.find(e=>e.url==='/gestion-prospecto') &&
						<Route path='gestion-prospecto' element={<GestionProspectos/>}/>
					}
					{
						sections.find(e=>e.url==='/extension/congelamiento') &&
						<Route path='extension/congelamiento' element={<GestionExtensionMembresia/>}/>
					}
					{
						sections.find(e=>e.url==='/auditoria') &&
						<Route path='auditoria' element={<GestionAuditoria/>}/>
					}
					{
						sections.find(e=>e.url==='/gestion-comisional') &&
						<Route path='gestion-comisional' element={<GestionComision/>}/>
					}
					{
						sections.find(e=>e.url==='/serv-fitology') &&
						<Route path='serv-fitology' element={<ServNutricion tipo_serv={'FITOL'}/>}/>
					}
					{
						sections.find(e=>e.url==='/serv-nutricion') &&
						<Route path='serv-nutricion' element={<ServNutricion tipo_serv={'NUTRI'}/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte') && 
						<Route path='reporte/reporte-programa' element={<ReportePorProgramas/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte') && 
						<Route path='reporte/total-ventas' element={<ReporteTotalVentas/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte') && 
						<Route path='reporte/total-ventas' element={<ReporteTotalVentas/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte') && 
						<Route path='reporte/ventas-asesor' element={<ReporteVentasAsesor/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte') &&
						<Route path='reporte/venta-semana' element={<ReporteVentasporSemana/>}/>
					}
					{
						sections.find(e=>e.url==='/aporte-ingresos') &&
						<Route path='aporte-ingresos' element={<AportesIngresos/>}/>
					}
					{
						sections.find(e=>e.url==='/configuracion-terminos') &&
						<Route path='configuracion-terminos' element={<Terminologias/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte-admin/reporte-egresos') &&
						<Route path='reporte-admin/reporte-egresos' element={<ReporteEgresos/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte-admin/reporte-gerencial') &&
						<Route path='reporte-admin/reporte-gerencial' element={<ReporteGerenciales/>}/>
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
