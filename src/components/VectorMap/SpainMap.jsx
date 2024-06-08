import 'jsvectormap';
import 'jsvectormap/dist/maps/spain.js';
import useVectorMap from './useVectorMap';

const SpainVectorMap = ({ width, height, options }) => {
	const { selectorId } = useVectorMap(options, 'spain');

	return <div id={selectorId} style={{ width: width, height: height }}></div>;
};

export default SpainVectorMap;
