import moment from 'moment';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import es from 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale(es);
export const helperFunctions = () => {
	const calcularEdad = (fechaNacimiento) => {
		const hoy = dayjs();
		const nacimiento = dayjs(fechaNacimiento);

		let edad = hoy.year() - nacimiento.year();

		// Si el mes y el día no han llegado aún este año, resta 1 a la edad
		if (
			hoy.month() < nacimiento.month() ||
			(hoy.month() === nacimiento.month() && hoy.date() < nacimiento.date())
		) {
			edad--;
		}

		return edad;
	};
	function modificarFechaHabiles(fechaInicial, dias) {
		let fecha = dayjs(fechaInicial);
		let contador = 0;

		while (contador < Math.abs(dias)) {
			// Sumar o restar 1 día, dependiendo si estamos sumando o restando
			fecha = dias > 0 ? fecha.add(1, 'day') : fecha.subtract(1, 'day');

			// Si el día no es sábado (6) ni domingo (0), lo contamos como día hábil
			if (fecha.day() !== 0 && fecha.day() !== 6) {
				contador++;
			}
		}

		return fecha.format('YYYY-MM-DD');
	}
	const base64ToFile = (base64String, fileName) => {

		// Decodificar el string base64
		const byteString = atob(base64String.split(',')[1]);

		// Crear un array de bytes
		const byteArray = new Uint8Array(byteString.length);
		for (let i = 0; i < byteString.length; i++) {
			byteArray[i] = byteString.charCodeAt(i);
		}

		// Determinar el tipo MIME
		const mimeType = base64String.match(/data:(.*?);base64/)[1];

		// Crear un objeto Blob
		const blob = new Blob([byteArray], { type: mimeType });

		// Crear un objeto File
		const file = new File([blob], fileName, { type: mimeType });

		return file;
	};
	const randomFunction = (lenghtRandom, code) => {
		let possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let randomNumber = '';
		for (let i = 0; i < lenghtRandom; i++) {
			randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return `${code}_${randomNumber}`;
	};
	const generarCombinaciones = (tamano, caracteres, prefijo) => {
		let combinacion = '';

		// Agregar el prefijo si existe
		if (prefijo) {
			combinacion += prefijo + '_';
		}

		// Generar la parte del string con letras y números
		for (let i = 0; i < tamano; i++) {
			const indice = Math.floor(Math.random() * caracteres.length);
			combinacion += caracteres.charAt(indice);
		}

		return combinacion;
	};
	function sumarDiasHabiles(fecha, diasHabiles) {
		let fechaResultado = new Date(fecha); // Crear una copia de la fecha

		while (diasHabiles > 0) {
			fechaResultado.setDate(fechaResultado.getDate() + 1); // Sumar un día

			// Si es un día hábil (lunes a viernes), restamos un día hábil del contador
			const diaSemana = fechaResultado.getDay();
			if (diaSemana !== 0 && diaSemana !== 6) {
				diasHabiles--;
			}
		}

		return fechaResultado;
	}
	const objetoComparador = (objeto1, objeto2) => {
		// Obtener las claves (propiedades) de ambos objetos
		const clavesObjeto1 = Object.keys(objeto1);
		const clavesObjeto2 = Object.keys(objeto2);

		// Verificar si la cantidad de propiedades es la misma
		if (clavesObjeto1.length !== clavesObjeto2.length) {
			return false;
		}

		// Verificar si los valores de cada propiedad son iguales
		for (let i = 0; i < clavesObjeto1.length; i++) {
			const clave = clavesObjeto1[i];

			if (objeto1[clave] !== objeto2[clave]) {
				return false;
			}
		}

		// Si ha pasado todas las verificaciones, los objetos son iguales
		return true;
	};
	const sumarSemanas = (fecha, semanas) => {
		// Crear un objeto moment a partir de la fecha
		const fechaMoment = moment(fecha);
		// Sumar semanas a la fecha
		const nuevaFecha = fechaMoment.add(semanas, 'weeks');

		// Devolver la nueva fecha en formato 'YYYY-MM-DD'
		return nuevaFecha.format('YYYY-MM-DD');
	};
	const diasLaborables = (fechaInicio, fechaFin) => {
		let diasLaborables = 0;
		const fechaInicioParsed = dayjs(fechaInicio);
		const fechaFinParsed = dayjs(fechaFin);

		// Determina la dirección de la iteración
		const direccion = fechaFinParsed.isAfter(fechaInicioParsed) ? 1 : -1;

		// Calcula el número total de días
		const totalDias = Math.abs(fechaFinParsed.diff(fechaInicioParsed, 'day')) + 1;

		// Inicializa fechaActual
		let fechaActual = fechaInicioParsed;

		// Itera sobre el rango de días
		for (let i = 0; i < totalDias; i++) {
			// Si el día actual es laborable (de lunes a viernes)
			if (fechaActual.day() !== 0 && fechaActual.day() !== 6) {
				diasLaborables += direccion;
			}
			fechaActual = fechaActual.add(direccion, 'day');
		}

		return diasLaborables;
	};
	const estadoExtension = (fecha_inicio, fecha_fin, actual) => {};
	const daysUTC = (fecha) => {
		return dayjs.utc(fecha).locale('es').format('DD/MM/YYYY');
	};

	// function sumarDiasHabiles(fecha, n_dia) {
	// 	if (!fecha) {
	// 		return 'No fue posible cargar la fecha';
	// 	}
	// 	// Convertir la cadena de fecha a un objeto Date
	// 	let date = new Date(fecha);

	// 	// Crear un arreglo de tamaño n_dia
	// 	let dias = Array.from({ length: n_dia }, (_, i) => i);

	// 	// Usar forEach para iterar sobre los días
	// 	dias.forEach(() => {
	// 		// Incrementar la fecha en un día
	// 		date.setDate(date.getDate() + 1);

	// 		// Obtener el día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
	// 		let diaSemana = date.getDay();

	// 		// Si el día es fin de semana (Sábado o Domingo), saltar hasta el lunes
	// 		if (diaSemana === 5) {
	// 			// Sábado
	// 			date.setDate(date.getDate() + 2); // Saltar a lunes
	// 		} else if (diaSemana === 0) {
	// 			// Domingo
	// 			date.setDate(date.getDate() + 1); // Saltar a lunes
	// 		}
	// 	});

	// 	// Retornar la nueva fecha en formato ISO 8601
	// 	return date.toISOString().split('T')[0];
	// }

	return {
		randomFunction,
		modificarFechaHabiles,
		generarCombinaciones,
		objetoComparador,
		sumarSemanas,
		diasLaborables,
		estadoExtension,
		daysUTC,
		base64ToFile,
		sumarDiasHabiles,
		calcularEdad,
	};
};
