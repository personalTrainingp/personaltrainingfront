import { useState } from 'react';
import * as yup from 'yup'

/*
* form validation schema
*/
export const chatMessageSchema = yup.object({
	message: yup.string().required('Please enter your messsage'),
})

export default function useChatList(chatMessages) {
	const [messages, setMessages] = useState(chatMessages);

	/**
	 * Handle new message posted
	 */
	const handleNewMessagePosted = (message) => {
		setMessages(
			messages.concat({
				id: messages.length + 1,
				userName: 'Geneva',
				text: message.message,
				postedOn: new Date().getHours() + ':' + new Date().getMinutes(),
			})
		);
	};

	return {
		messages,
		handleNewMessagePosted,
	};
}
