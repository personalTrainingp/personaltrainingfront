import React from 'react';
import classNames from 'classnames';

const MessageItem = ({ className, children }) => {
  return <div className={classNames('inbox-item', className)}>{children}</div>;
};

export default MessageItem;
