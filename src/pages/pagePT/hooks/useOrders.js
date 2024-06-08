import { useState } from 'react';
import { dataSeguimiento } from '../data';

export default function useOrders() {
	const [orderList, setOrderList] = useState(dataSeguimiento);

	// change order status group
	const changeOrderStatusGroup = (OrderStatusGroup) => {
		let updatedData = dataSeguimiento;
		//  filter
		updatedData =
			OrderStatusGroup === 'All'
				? dataSeguimiento
				: [...dataSeguimiento].filter((o) => o.payment_status?.includes(OrderStatusGroup));
		setOrderList(updatedData);
	};

	return { orderList, changeOrderStatusGroup };
}
