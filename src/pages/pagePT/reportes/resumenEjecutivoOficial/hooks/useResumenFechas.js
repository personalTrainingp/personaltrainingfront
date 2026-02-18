import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onSetRangeDate } from '@/store/data/dataSlice';
import { limaStartOfDay, limaEndOfDay } from './useResumenUtils';

export const useResumenFechas = () => {
	const dispatch = useDispatch();
	const { RANGE_DATE } = useSelector((e) => e.DATA);

	const [cutDay, setCutDay] = useState(new Date().getDate());
	const [initDay, setInitDay] = useState(1);
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
	const [tasaCambio, setTasaCambio] = useState(3.37);
	const ayer = new Date();
	ayer.setDate(ayer.getDate() - 1);

	const year = new Date(new Date().setDate(new Date().getDate() - 4)).getFullYear();

	const handleSetUltimoDiaMes = () => {
		const ultimoDia = new Date(year, selectedMonth, 0).getDate();
		setCutDay(ultimoDia);
	};

	const [start, end] = useMemo(() => {
		if (!Array.isArray(RANGE_DATE) || !RANGE_DATE[0] || !RANGE_DATE[1]) return [null, null];
		return [new Date(RANGE_DATE[0]), new Date(RANGE_DATE[1])];
	}, [RANGE_DATE]);

	useEffect(() => {
		// Only dispatch if RANGE_DATE is not already set by another hook (e.g. dev hook)
		// This prevents a race condition where both hooks dispatch different date ranges
		if (RANGE_DATE && RANGE_DATE[0] && RANGE_DATE[1]) return;

		const y = new Date().getFullYear();
		const startLocal = new Date(y, selectedMonth - 1, initDay);
		const endLocal = new Date(y, selectedMonth - 1, cutDay);
		dispatch(onSetRangeDate([limaStartOfDay(startLocal), limaEndOfDay(endLocal)]));
	}, [selectedMonth, initDay, cutDay, dispatch, RANGE_DATE]);

	return {
		cutDay,
		setCutDay,
		initDay,
		setInitDay,
		selectedMonth,
		setSelectedMonth,
		tasaCambio,
		setTasaCambio,
		year,
		handleSetUltimoDiaMes,
		start,
		end,
		RANGE_DATE,
	};
};
