import React from 'react';
import classNames from 'classnames';

const TimelineItem = ({ className, children, tag = 'div' }) => {
	const Tag= tag;

	return <Tag className={classNames('timeline-item', className)}>{children}</Tag>;
};

export default TimelineItem;
