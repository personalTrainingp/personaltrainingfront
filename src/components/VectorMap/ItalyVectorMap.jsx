import 'jsvectormap';
import 'jsvectormap/dist/maps/italy.js';
import useVectorMap from './useVectorMap';

const ItalyVectorMap = ({ width, height, options }) => {
	const { selectorId } = useVectorMap(options, 'italy');

	return <div id={selectorId} style={{ width: width, height: height }}></div>;
};

export default ItalyVectorMap;
