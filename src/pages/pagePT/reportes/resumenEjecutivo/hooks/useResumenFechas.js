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
	const [year, setYear] = useState(new Date().getFullYear());
	const [tasaCambio, setTasaCambio] = useState(3.37);

	const handleSetUltimoDiaMes = () => {
		const ultimoDia = new Date(year, selectedMonth, 0).getDate();
		setCutDay(ultimoDia);
	};

	const [start, end] = useMemo(() => {
		if (!Array.isArray(RANGE_DATE) || !RANGE_DATE[0] || !RANGE_DATE[1]) return [null, null];
		return [new Date(RANGE_DATE[0]), new Date(RANGE_DATE[1])];
	}, [RANGE_DATE]);

	useEffect(() => {
		// AL CORREGIR: Usamos 'year' del estado, no el año actual hardcodeado
		const startLocal = new Date(year, selectedMonth - 1, initDay);
		const endLocal = new Date(year, selectedMonth - 1, cutDay);
		dispatch(onSetRangeDate([limaStartOfDay(startLocal), limaEndOfDay(endLocal)]));
	}, [selectedMonth, initDay, cutDay, year, dispatch]);

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
		setYear,
		handleSetUltimoDiaMes,
		start,
		end,
		RANGE_DATE,
	};
};
