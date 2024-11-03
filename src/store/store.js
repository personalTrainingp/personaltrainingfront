import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import { uiSlice } from './ui/uiSlice';
import { selectSlice } from './dataSelects/selectSlice';
import { proveedorSlice } from './dataProveedor/proveedorSlice';
import { productoSlice } from './dataProducto/productoSlice';
import { gfGvSlice } from './gfGv/gfGvSlice';
import { programaPTSlice } from './ventaProgramaPT/programaPTSlice';
import { tablehorarioSlice } from './tableHorario/tablehorarioSlice';
import { uiNuevaVentaSlice } from './uiNuevaVenta/uiNuevaVenta';
import { usuarioSlice } from './usuario/usuarioSlice';
import { authClientSlice } from './usuario/usuarioClienteSlice';
import { authEmplSlice } from './usuario/usuarioEmpleadoSlice';
import { metaSlice } from './uiMeta/metaSlice';
import { ImpuestoSlice } from './dataImpuesto/impuestoSlice';
import { parametroSlice } from './dataParametros/parametroSlice';
import { CalendarSlice } from './calendar/calendarSlice';
import { GastosSlice } from './dataGastos/gastosSlice';
import { rutasSlice } from './sections/RutasSlice';
import { authProspectoSlice } from './usuario/usuarioProspectoSlice';
import { comentarioSlice } from './dataComentario/comentarioSlice';
import { serviciosSlice } from './Servicios/serviciosSlice';
import { dataSlice } from './data/dataSlice';
import { terminologiaSlice } from './dataTerminologia/terminologiaSlice';

export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		ui: uiSlice.reducer,
		eSelect: selectSlice.reducer,
		prov: proveedorSlice.reducer,
		prod: productoSlice.reducer,
		gf_gv: gfGvSlice.reducer,
		programaPT: programaPTSlice.reducer,
		hrpgm: tablehorarioSlice.reducer,
		uiNuevaVenta: uiNuevaVentaSlice.reducer,
		usuario: usuarioSlice.reducer,
		authClient: authClientSlice.reducer,
		authEmpl: authEmplSlice.reducer,
		meta: metaSlice.reducer,
		impuestos: ImpuestoSlice.reducer,
		parametro: parametroSlice.reducer,
		calendar: CalendarSlice.reducer,
		finanzas: GastosSlice.reducer,
		rutas: rutasSlice.reducer,
		authProspec: authProspectoSlice.reducer,
		comentario: comentarioSlice.reducer,
		servicios: serviciosSlice.reducer,
		DATA: dataSlice.reducer,
		terminologia: terminologiaSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
