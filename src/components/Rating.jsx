import classNames from 'classnames';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Rating = ({ tag = 'p', className, value }) => {
  const rating = Math.floor(value || 0);
  const emptyStars = Math.floor(rating < 5 ? 5 - rating : 0);
  const Tag = tag;

  return (
    <Tag className={classNames('font-16', className)} id="rating-container">
      {[...Array(rating)].map((x, index) => (
        <OverlayTrigger
          key={index.toString()}
          placement="right"
          overlay={<Tooltip id="button-tooltip">{value || 0}</Tooltip>}
        >
          <span className="text-warning mdi mdi-star"></span>
        </OverlayTrigger>
      ))}
      {[...Array(emptyStars)].map((x, index) => (
        <OverlayTrigger
          key={index.toString()}
          placement="right"
          overlay={<Tooltip id="button-tooltip">{value || 0}</Tooltip>}
        >
          <span className="text-warning mdi mdi-star-outline"></span>
        </OverlayTrigger>
      ))}
    </Tag>
  );
};

export default Rating;
