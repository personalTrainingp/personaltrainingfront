import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { PerfilPrograma } from './GestProgramas/PerfilPrograma';
import PerfilEmpleado from './GestEmpleados/Perfil';

const NuevaVenta = lazy(() => import('./nuevaVenta'));
const Seguimiento = lazy(() => import('./seguimiento'));
const TotaldeVentas = lazy(() => import('./reportes/totalVentas'));
const VentasPrograma = lazy(() => import('./reportes/ventasPrograma'));
const VentasAsesor = lazy(() => import('./reportes/ventasAsesor'));
const GestionProveedores = lazy(() => import('./GestProveedores'));
const GestionProductos = lazy(() => import('./GestProductos'));
const GestionProgramas = lazy(() => import('./GestProgramas'));
const GestionFyG = lazy(() => import('./GestGastos'));
const GestionEmpleados = lazy(() => import('./GestEmpleados'));
const CrearCitasNutricionales = lazy(() => import('./GestNutricion'));
const GestionUsuario = lazy(() => import('./GestAuthUser'));
const PerfilCliente = lazy(() => import('./PerfilCliente'));
const GestionClientes = lazy(()=> import('./GestClientes'))
const GestionMeta = lazy(()=> import('./GestBonosyMetas'))
const GestionDescuentos= lazy(()=> import('./GestDescuentos'))
export default function Ventas() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="nueva-venta" element={<NuevaVenta />} />
				<Route path="seguimiento" element={<Seguimiento />} />
				<Route path='reporte/total-ventas' element={<TotaldeVentas/>}/>
				<Route path='reporte/ventas-programas' element={<VentasPrograma/>}/>
				<Route path='reporte/ventas-asesor' element={<VentasAsesor/>}/>
				<Route path='gestion-proveedores' element={<GestionProveedores/>}/>
				<Route path='gestion-productos' element={<GestionProductos/>}/>
				<Route path='gestion-programas' element={<GestionProgramas/>}/>
				<Route path='gestion-gastosF-gastosV' element={<GestionFyG/>}/>
				<Route path='citas' element={<CrearCitasNutricionales/>}/>
				<Route path='gestion-empleados' element={<GestionEmpleados/>}/>
				<Route path='gestion-clientes' element={<GestionClientes/>}/>
				<Route path='gestion-auth-usuario' element={<GestionUsuario/>}/>
				<Route path='historial-cliente/:uid' element={<PerfilCliente/>}/>
				<Route path='perfil-colaborador/:uid' element={<PerfilEmpleado/>}/>
				<Route path='programa/:uid' element={<PerfilPrograma/>}/>
				<Route path='gestion-meta' element={<GestionMeta/>}/>
				<Route path='gestion-descuentos' element={<GestionDescuentos/>}/>
			</Route>
		</Routes>
	);
}