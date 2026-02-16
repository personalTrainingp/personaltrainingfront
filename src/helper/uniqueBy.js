export const uniqueBy = (array = [], key = 'id') => {
	const keys = Array.isArray(key) ? key : [key];

	const makeKey = (item) =>
		keys
			.map((k) => {
				const v = item?.[k];
				// Si llega un objeto/array lo serializamos para poder comparar (sin caer en circular)
				if (v && typeof v === 'object') return `${k}:${safeStringify(v)}`;
				return `${k}:${String(v)}`;
			})
			.join('|');

	const map = new Map();
	for (const item of array) {
		map.set(makeKey(item), item); // conserva el último repetido (igual que tu versión)
	}
	return [...map.values()];
};

const safeStringify = (v) => {
	try {
		return JSON.stringify(v);
	} catch {
		return String(v);
	}
};
