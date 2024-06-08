import 'jsvectormap';
import 'jsvectormap/dist/maps/iraq.js';
import useVectorMap from './useVectorMap';

const IraqVectorMap = ({ width, height, options }) => {
	const { selectorId } = useVectorMap(options, 'iraq');

	return <div id={selectorId} style={{ width: width, height: height }}></div>;
};

export default IraqVectorMap;
