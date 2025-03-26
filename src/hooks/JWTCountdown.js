const JWTCountdown = ({ expTimestamp, onExpire }) => {
	const calcularTiempoRestante = () => {
		const ahora = Date.now() / 1000; // tiempo actual en segundos
		return Math.max(expTimestamp - ahora, 0);
	};

	const [tiempoRestante, setTiempoRestante] = useState(calcularTiempoRestante());

	useEffect(() => {
		const intervalo = setInterval(() => {
			const restante = calcularTiempoRestante();
			setTiempoRestante(restante);
			if (restante <= 0) {
				clearInterval(intervalo);
				onExpire();
			}
		}, 1000);

		return () => clearInterval(intervalo);
	}, [expTimestamp]);

	const formatearTiempo = (tiempo) => {
		const horas = Math.floor(tiempo / 3600);
		const minutos = Math.floor((tiempo % 3600) / 60);
		const segundos = Math.floor(tiempo % 60);
		return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
	};

	return (
		<div>
			Tiempo restante del token: <strong>{formatearTiempo(tiempoRestante)}</strong>
		</div>
	);
};

export default JWTCountdown;
