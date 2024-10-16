import 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import useVectorMap from './useVectorMap';

const WorldVectorMap = ({ width, height, options }) => {
	const { selectorId } = useVectorMap(options, 'world');

	return <div id={selectorId} style={{ width: width, height: height }}></div>;
};

export default WorldVectorMap;
