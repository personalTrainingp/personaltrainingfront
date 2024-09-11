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
import CrearCitasNutricion from '@/pages/pagePT/GestNutricion';




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
const ReporteMetas = lazy(()=>import('../pages/pagePT/reportes/reporteMetas'))
const MarketingAgenda = lazy(()=>import('../pages/pagePT/GestMkt'))
const HistorialCitasNutricionista = lazy(()=>import('../pages/pagePT/HistorialCitasNutricionista'))
const GestionTipoCambio = lazy(()=>import('../pages/pagePT/GestTipoCambio'))
const ControlDeContratosClientes = lazy(()=>import('../pages/pagePT/GestContratosDeCliente'))
const GestActasDeReunion = lazy(()=>import('../pages/pagePT/GestActasReunion'))

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
			<div className='d-flex align-items-center justify-content-center' style={{height: '100vh'}}>
				<span className="loader"></span>
			</div>
		)
	}
	return (
	<ReactRoutes>
		{
			status  === 'authenticated' ? (
				<>
				<Route path="/*" element={<Layout />}>
					{sections.find(e=>e.url==='/nueva-venta')&&
						<Route path="nueva-venta" element={<NuevaVenta />} />
					}
					{
						sections.find(e=>e.url==='/reporte/venta-por-semana')&&
                        <Route path='reporte/venta-por-semana' element={<ReporteVentasporSemana/>}/>
					}
					{sections.find(e=>e.url==='/mkt-actas-reunion')&&
						<Route path="mkt-actas-reunion" element={<GestActasDeReunion />} />
					}
					{sections.find(e=>e.url==='/seguimiento')&&
						<Route path="seguimiento" element={<Seguimiento />} />
					}
					{
						sections.find(e=>e.url==='/contrato-clientes')&&
						<Route path="contrato-clientes" element={<ControlDeContratosClientes />} />
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
                        <Route path='crear-citas-nutricion' element={<CrearCitasNutricion tipo_serv={'NUTRI'}/>}/>
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
						sections.find(e=>e.url==='/extension-membresia') &&
						<Route path='extension-membresia' element={<GestionExtensionMembresia/>}/>
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
						<Route path='reporte/reporte-metas' element={<ReporteMetas/>}/>
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
						sections.find(e=>e.url==='/trabajo-marketing') &&
						<Route path='trabajo-marketing' element={<MarketingAgenda/>}/>
					}
					{
						sections.find(e=>e.url==='/reporte-admin/reporte-gerencial') &&
						<Route path='reporte-admin/reporte-gerencial' element={<ReporteGerenciales/>}/>
					}
					{
						sections.find(e=>e.url==='/history-citas-nutricion') &&
						<Route path='history-citas-nutricion' element={<HistorialCitasNutricionista/>}/>
					}
					{
						
						sections.find(e=>e.url==='/tipo-cambio') &&
						<Route path='tipo-cambio' element={<GestionTipoCambio/>}/>
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
