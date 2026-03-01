import React from 'react';

function ReelCard({ reel, userId, onLike }) {
  return (
    <div style={styles.card}>
      
      {/* Center Area — Reel ID */}
      <div style={styles.reelIdBox}>
        <span style={styles.reelIdText}>{reel.reel_id}</span>
      </div>

      {/* Bottom Info */}
      <div style={styles.bottomInfo}>
        <div style={styles.restaurantRow}>
          <div style={styles.avatar}>
            {reel.restaurant.name.charAt(0)}
          </div>
          <span style={styles.restaurantName}>{reel.restaurant.name}</span>
        </div>
        <span style={styles.category}>#{reel.category}</span>
      </div>

      {/* Right Side Actions */}
      <div style={styles.actions}>
        <button style={styles.likeBtn} onClick={() => onLike(reel.reel_id)}>
          {reel.did_i_like ? '❤️' : '🤍'}
          <span style={styles.likeCount}>{reel.like_count}</span>
        </button>
      </div>

    </div>
  );
}

const styles = {
  card: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    scrollSnapAlign: 'start',
    borderBottom: '1px solid #222',
  },
  reelIdBox: {
    backgroundColor: '#222',
    padding: '24px 40px',
    borderRadius: '16px',
    border: '1px solid #444',
  },
  reelIdText: {
    color: '#fff',
    fontSize: '28px',
    fontFamily: 'monospace',
    letterSpacing: '2px',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: '80px',
    left: '20px',
  },
  restaurantRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  restaurantName: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  category: {
    color: '#aaa',
    fontSize: '14px',
    marginLeft: '50px',
  },
  actions: {
    position: 'absolute',
    right: '20px',
    bottom: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  likeBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '4px',
  },
  likeCount: {
    color: '#fff',
    fontSize: '13px',
  },
};

export default ReelCard;