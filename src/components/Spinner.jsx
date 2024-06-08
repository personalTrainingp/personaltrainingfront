import React from 'react';
import classNames from 'classnames';

const Spinner = ({
  tag = 'div',
  type = 'bordered',
  className,
  color,
  size,
  children,
}) => {
  const Tag = tag || 'div';

  return (
    <Tag
      role="status"
      className={classNames(
        {
          'spinner-border': type === 'bordered',
          'spinner-grow': type === 'grow',
        },
        color ? `text-${color}` : `text-secondary`,
        { [`avatar-${size}`]: size },
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default Spinner;
