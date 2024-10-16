import 'jsvectormap';
import 'jsvectormap/dist/maps/us-merc-en.js';
import useVectorMap from './useVectorMap';

const UsaVectorMap = ({ width, height, options }) => {
	const { selectorId } = useVectorMap(options, 'us_merc_en');

	return <div id={selectorId} style={{ width: width, height: height }}></div>;
};

export default UsaVectorMap;
