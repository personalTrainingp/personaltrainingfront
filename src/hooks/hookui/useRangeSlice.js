import { useState } from 'react';

export default function useRangeSlider() {
	const [selectedVals, setSelectedVals] = useState({
		'1': { textValue: 20, percent: 20 },
		'2': { textValue: 20, percent: 20 },
	});
	const [selectedRanges, setSelectedRanges] = useState({
		'1': '20-45',
		'2': '20-45',
	});

	const onSlide = (index, value, percent) => {
		let selectedValues = { ...selectedVals };
		selectedValues[index] = {
			textValue: Number(value[0].toFixed(2)),
			percent: Number(percent[0].toFixed(2)),
		};
		setSelectedVals(selectedValues);
	};

	const onSlide2 = (index, value) => {
		let selectedRange = { ...selectedRanges };
		selectedRange[index] = value[0].toFixed(2) + '-' + value[1].toFixed(2);
		setSelectedRanges(selectedRange);
	};

	return {
		selectedVals,
		selectedRanges,
		onSlide,
		onSlide2,
	};
}
