import React from 'react';

export function StatusBadge({ status }) {
  const formatted = (status || 'pending').replace('_', ' ');
  return (
    <span className={`badge badge-${status}`}>
      {formatted}
    </span>
  );
}
