import React from 'react';

const CommentCountBadge = ({ count }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', background: '#f3f4f6', color: '#374151', fontWeight: 600,
    borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '1rem', position: 'absolute', bottom: '0.5rem', left: '0.5rem', zIndex: 2,
    boxShadow: '0 1px 4px #0001'
  }}>
    💬 {count}
  </span>
);

export default CommentCountBadge;
