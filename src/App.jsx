import AppRoutes from '@/routes';
import { NotificationProvider, ThemeProvider } from '@/common/context';
import { PrimeReactProvider, addLocale, locale } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import './assets/scss/Saas.scss';
import { Provider } from 'react-redux';
import { store } from './store';
import 'regenerator-runtime/runtime';

import Offline from "react-offline";
import { Snake } from 'react-snake-lib';
import { ConfirmDialog } from 'primereact/confirmdialog';
// Añadir textos en español
addLocale('es', {
    startsWith: 'Empieza con',
    contains: 'Contiene',
    notContains: 'No contiene',
    endsWith: 'Termina con',
    equals: 'Igual a',
    notEquals: 'Diferente a',
    noFilter: 'Sin filtro',
    lt: 'Menor que',
    lte: 'Menor o igual que',
    gt: 'Mayor que',
    gte: 'Mayor o igual que',
    dateIs: 'Es',
    dateIsNot: 'No es',
    dateBefore: 'Antes de',
    dateAfter: 'Despues de',
    custom: 'Personalizado',
    clear: 'Limpiar',
    apply: 'Aplicar',
    matchAll: 'Coincidir con todos',
    matchAny: 'Coincidir con cualquiera',
    addRule: 'Añadir regla',
    removeRule: 'Eliminar regla',
    accept: 'Sí',
    reject: 'No',
    choose: 'Elegir',
    upload: 'Subir',
    cancel: 'Cancelar',
    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
    today: 'Hoy',
    weekHeader: 'Sm',
    firstDayOfWeek: 1,
    dateFormat: 'dd/mm/yy',
    weak: 'Débil',
    medium: 'Medio',
    strong: 'Fuerte',
    passwordPrompt: 'Introduzca una contraseña',
    emptyFilterMessage: 'No se encontraron resultados', 
    emptyMessage: 'No hay opciones disponibles'
});

// Establecer el idioma por defecto
locale('es');
const App = () => {
	return (
        
		<Provider store={store}>
		<ThemeProvider>
			<NotificationProvider>
				<PrimeReactProvider>
                    
        <ConfirmDialog />
                <Offline>
                    {({ isOffline, isOnline }) => {
                        return isOffline ? 
                        <div className='d-flex align-items-center justify-content-center' style={{height: '100vh'}}>
                            <h1>
                                No hay conexion a internet
                            </h1>
                            <Snake
                            borderRadius={0}
                            snakeHeadRadius={10}
                            snakeSpeed={150}
                            startGameText="Empezar juego"
                            />
                        </div>
                            : 
                            <AppRoutes />
                            ;
                    }}
                </Offline>
				</PrimeReactProvider>
			</NotificationProvider>
		</ThemeProvider>
		</Provider>
	);
};

export default App;
