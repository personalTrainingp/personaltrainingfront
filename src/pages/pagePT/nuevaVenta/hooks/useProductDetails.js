import { useState } from 'react';
import productImg1 from '@/assets/images/products/product-5.jpg';

export default function useProductDetails() {
	const [selectedProductImg, setSelectedProductImg] = useState(productImg1);

	const product= {
		name: 'Amazing Modern Chair (Orange)',
		addedOn: '09/12/2018',
		status: 'Instock',
		price: '$139.58',
		description:
			"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
		stock: '1,784',
		noOfOrders: '5,458',
		revenue: '$8,57,014',
		rating: 4.5,
	};

	/**
	 * Handles the image changes
	 */
	const handleImgChange = (
		e,
		selectedImg
	) => {
		e.preventDefault();
		setSelectedProductImg(selectedImg);
		return false;
	};

	return { selectedProductImg, handleImgChange, product };
}
