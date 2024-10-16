import { useState } from 'react';

export default function useAddEditEvent(eventData, isEditable, onUpdateEvent, onAddEvent) {
	// event state
	const [event] = useState({
		title: eventData?.title || '',
		className: eventData?.className || '',
	});

	// /*

	/*
	 * handle form submission
	 */
	const onSubmitEvent = (data) => {
		isEditable ? onUpdateEvent(data) : onAddEvent(data);
	};

	return {
		event,
		onSubmitEvent,
	};
}
