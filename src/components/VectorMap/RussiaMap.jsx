import 'jsvectormap';
import 'jsvectormap/dist/maps/russia.js';
import useVectorMap from './useVectorMap';

const RussiaVectorMap = ({ width, height, options }) => {
	const { selectorId } = useVectorMap(options, 'russia');

	return <div id={selectorId} style={{ width: width, height: height }}></div>;
};

export default RussiaVectorMap;
