import React, { useState, useEffect } from 'react';

const SMILEYS = [
  { type: 'like', icon: '�', label: 'Like' }
];

const getDeviceId = () => {
  if (typeof window === 'undefined') return '';
  let deviceId = window.localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    window.localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

const SmileyLike = ({ sketchId }) => {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/sketches/${sketchId}/reactions`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCount(data.data.like || 0);
      });
    // Check localStorage for user's like status
    const deviceId = getDeviceId();
    const likedKey = `liked_${sketchId}_${deviceId}`;
    if (typeof window !== 'undefined') {
      setLiked(window.localStorage.getItem(likedKey) === 'true');
    }
  }, [sketchId]);

  const handleLikeClick = async () => {
    if (loading) return;
    setLoading(true);
    const deviceId = getDeviceId();
    const likedKey = `liked_${sketchId}_${deviceId}`;
    let newLiked = !liked;
    // Send action to backend: 'like' or 'unlike'
    await fetch(`/api/sketches/${sketchId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ smileyType: 'like', deviceId, action: newLiked ? 'like' : 'unlike' })
    });
    setLiked(newLiked);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(likedKey, newLiked ? 'true' : '');
    }
    // Refetch count
    fetch(`/api/sketches/${sketchId}/reactions`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCount(data.data.like || 0);
      });
    setLoading(false);
  };

  console.log('SmileyLike rendered for sketchId:', sketchId);
  return (
    <div style={{ display: 'inline-block', position: 'relative', border: '2px dashed red', padding: '0.5rem' }}>
      <button
        onClick={handleLikeClick}
        style={{ background: liked ? '#dbeafe' : '#f3f4f6', borderRadius: '999px', padding: '0.5rem 1rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', border: '2px solid #2563eb', color: liked ? '#2563eb' : '#374151', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
        aria-label={liked ? 'Unlike this sketch' : 'Like this sketch'}
        disabled={loading}
      >
        👍 {liked ? 'Liked' : 'Like'}
        <span style={{ fontSize: '1.2rem', color: '#2563eb', fontWeight: 600, marginLeft: '0.5rem' }}>{count}</span>
      </button>
    </div>
  );
};

export default SmileyLike;
