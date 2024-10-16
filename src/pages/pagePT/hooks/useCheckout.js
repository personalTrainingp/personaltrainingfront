import { useState } from 'react';
import { cartSummary } from '../Checkout/data';

export default function useCheckout() {
	const [cart, setCart] = useState(cartSummary);

	/**
	 * Update the shipping cost
	 */
	const updateShipping = (shippingCost) => {
		var localCart = { ...cart };
		localCart['shipping'] = shippingCost;
		localCart['total'] = localCart['sub_total'] + shippingCost;
		setCart(localCart);
	};

	return { cart, updateShipping };
}
