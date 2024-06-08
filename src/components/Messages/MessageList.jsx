import React from 'react';
import classNames from 'classnames';

const MessageList = ({ className, children }) => {
	return <div className={classNames('inbox-widget', className)}>{children}</div>;
};

export default MessageList;
