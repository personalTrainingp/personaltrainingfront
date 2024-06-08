import React from 'react';
import classNames from 'classnames';

const Timeline = ({ className, children, tag = 'div' }) => {
  const Tag = tag;

  return <Tag className={classNames('timeline-alt', 'py-0', className)}>{children}</Tag>;
};

export default Timeline;
