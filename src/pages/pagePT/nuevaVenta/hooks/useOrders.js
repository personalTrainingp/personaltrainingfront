import { useState } from 'react';
import { orders } from '../data';

export default function useOrders() {
	const [orderList, setOrderList] = useState(orders);

	// change order status group
	const changeOrderStatusGroup = (OrderStatusGroup) => {
		let updatedData = orders;
		//  filter
		updatedData =
			OrderStatusGroup === 'All'
				? orders
				: [...orders].filter((o) => o.payment_status?.includes(OrderStatusGroup));
		setOrderList(updatedData);
	};

	return { orderList, changeOrderStatusGroup };
}
