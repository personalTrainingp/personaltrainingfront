import 'jsvectormap';
import 'jsvectormap/dist/maps/canada.js';
import useVectorMap from './useVectorMap';

const CanadaVectorMap = ({ width, height, options }) => {
	const { selectorId } = useVectorMap(options, 'canada');

	return <div id={selectorId} style={{ width: width, height: height }}></div>;
};

export default CanadaVectorMap;
