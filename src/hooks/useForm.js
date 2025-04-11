import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useForm = (initialForm = {}, formValidations = {}) => {
	const [formState, setFormState] = useState(initialForm);
	const [formValidation, setFormValidation] = useState({});
	useEffect(() => {
		createValidators();
	}, [formState]);

	useEffect(() => {
		setFormState(initialForm);
	}, [initialForm]);

	const isFormValid = useMemo(() => {
		for (const formValue of Object.keys(formValidation)) {
			if (formValidation[formValue] !== null) return false;
		}
		return true;
	}, [formValidation]);

	const onInputChange = ({ target }) => {
		const { name, value, checked, type } = target;
		// console.log({ [name]: value });
		if (type === 'checkbox') {
			console.log('en checkeeee');
			console.log([name], checked);

			return setFormState({
				...formState,
				[name]: checked,
			});
		}

		setFormState({
			...formState,
			[name]: value,
		});
	};
	const onInputChangeMonto = ({ target }) => {
		const { name, value, checked, type } = target;
		// console.log({ [name]: value });
		setFormState({
			...formState,
			[name]: value,
		});
	};
	const valueMonto = ({ target }) => {
		const { name, value, checked, type } = target;
		// console.log({ [name]: value });
		return value.replace(/,/g, '');
	};
	const onInputChangeReact = (value, name) => {
		setFormState({
			...formState,
			[name]: Array.isArray(value) ? value : value?.value,
		});
	};
	const onInputChangeReactSelect = (value, name) => {
		console.log(value, name);
		setFormState({
			...formState,
			[name]: value,
		});
	};
	const onInputChangePrimeReact = (value, name) => {
		setFormState({
			...formState,
			[name]: value.value,
		});
	};
	const onFileChange = (event) => {
		const file = event.target.files[0];
		const name = event.target.name;
		console.log({ [name]: file });
		// Verifica si el tipo de archivo es aceptable (png o jpeg)
		if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
			// Realiza la lógica para manejar el archivo
			// Actualizar el AuthSlice
			// const reader = new FileReader();
			setFormState({
				...formState,
				[name]: file,
			});
			// reader.onload = () => {
			// };
			// reader.readAsDataURL(file);
		} else {
			// Muestra un mensaje de error o realiza alguna acción para archivos no válidos
			console.error('Por favor, selecciona un archivo PNG o JPEG.');
		}
	};
	const onResetForm = () => {
		setFormState(initialForm);
	};
	const onInputChangeFlaticon = (e, name) => {
		// console.log('entrando...', e, name);
		const horario = e[0].toLocaleTimeString();
		setFormState({
			...formState,
			[name]: horario,
		});
	};
	const onInputChangeButton = (e, isActive) => {
		// const {value} = target;
		// console.log(e.target.name, isActive);
		setFormState({
			...formState,
			[e.target.name]: isActive,
		});
	};
	const onInputChangeFunction = (name, value) => {
		setFormState({
			...formState,
			[name]: value,
		});
	};
	const onInputChangeRange = (e) => {};
	const createValidators = () => {
		const formCheckedValues = {};

		for (const formField of Object.keys(formValidations)) {
			const [fn, errorMessage] = formValidations[formField];

			formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
		}

		setFormValidation(formCheckedValues);
	};

	return {
		...formState,
		formState,
		onInputChange,
		onResetForm,
		onInputChangeReact,
		onFileChange,
		onInputChangeFlaticon,
		onInputChangeButton,
		onInputChangeFunction,
		onInputChangeRange,
		onInputChangeMonto,
		valueMonto,
		onInputChangeReactSelect,

		...formValidation,
		isFormValid,
	};
};
