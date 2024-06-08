import { useEffect, useState } from 'react';

export default function useVectorMap(options, type) {
	const selectorId = type + new Date().getTime();
	const [map, setMap] = useState();

	useEffect(() => {
		if (!map) {
			// create jsvectormap
			const map = new (window)['jsVectorMap']({
				selector: '#' + selectorId,
				map: type,
				...options,
			});

			setMap(map);
		}
	}, [selectorId, map, options, type]);

	return { selectorId };
}
