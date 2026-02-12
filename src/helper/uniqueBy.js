export const uniqueBy = (array, key) => [
	...new Map(array.map((item) => [item[key], item])).values(),
];
