import React, { useState } from 'react';

function ReelCard({ reel, onLike }) {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(reel.reel_id);
    setIsLiking(false);
  };

  return (
    <div style={styles.card}>

      {/* Background Gradient */}
      <div style={styles.bgGradient} />

      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.categoryBadge}>
          <span style={styles.categoryText}>#{reel.category}</span>
        </div>
      </div>

      {/* Center — Reel ID */}
      <div style={styles.centerContent}>
        <div style={styles.reelIdBox}>
          <p style={styles.reelLabel}>NOW PLAYING</p>
          <p style={styles.reelId}>{reel.reel_id}</p>
        </div>
      </div>

      {/* Bottom Info */}
      <div style={styles.bottomSection}>
        <div style={styles.bottomLeft}>

          {/* Restaurant Row */}
          <div style={styles.restaurantRow}>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>
                {reel.restaurant.name.charAt(0)}
              </span>
            </div>
            <div>
              <p style={styles.restaurantName}>{reel.restaurant.name}</p>
              <p style={styles.restaurantId}>{reel.restaurant.restaurant_id}</p>
            </div>
            <button style={styles.followBtn}>Follow</button>
          </div>

          {/* Category Tag */}
          <p style={styles.categoryTag}>
            🍽️ {reel.category.replace(/_/g, ' ')}
          </p>

        </div>

        {/* Right Actions */}
        <div style={styles.actions}>

          {/* Like */}
          <button
            style={styles.actionBtn}
            onClick={handleLike}
          >
            <span style={{
              ...styles.actionIcon,
              transform: isLiking ? 'scale(1.4)' : 'scale(1)',
              transition: 'transform 0.15s ease',
            }}>
              {reel.did_i_like ? '❤️' : '🤍'}
            </span>
            <span style={styles.actionCount}>{reel.like_count}</span>
          </button>

          {/* Share */}
          <button style={styles.actionBtn}>
            <span style={styles.actionIcon}>📤</span>
            <span style={styles.actionCount}>Share</span>
          </button>

          {/* Save */}
          <button style={styles.actionBtn}>
            <span style={styles.actionIcon}>🔖</span>
            <span style={styles.actionCount}>Save</span>
          </button>

        </div>
      </div>

      {/* Bottom Fade */}
      <div style={styles.bottomFade} />

    </div>
  );
}

const styles = {
  card: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#0d0d0d',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    scrollSnapAlign: 'start',
    overflow: 'hidden',
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at center, #1a0a0a 0%, #0d0d0d 70%)',
    zIndex: 0,
  },
  topBar: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
    border: '1px solid #ff4757',
    borderRadius: '20px',
    padding: '6px 14px',
  },
  categoryText: {
    color: '#ff4757',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: "'Segoe UI', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  centerContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  reelIdBox: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  reelLabel: {
    color: '#555',
    fontSize: '11px',
    letterSpacing: '3px',
    fontFamily: 'monospace',
    margin: 0,
  },
  reelId: {
    color: '#fff',
    fontSize: '42px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: '4px',
    margin: 0,
    textShadow: '0 0 40px rgba(255,71,87,0.4)',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
    zIndex: 5,
  },
  bottomSection: {
    position: 'absolute',
    bottom: '80px',
    left: 0,
    right: 0,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  bottomLeft: {
    flex: 1,
    marginRight: '16px',
  },
  restaurantRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#ff4757',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #fff',
    flexShrink: 0,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  restaurantName: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    margin: '0 0 2px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  restaurantId: {
    color: '#888',
    fontSize: '11px',
    margin: 0,
    fontFamily: 'monospace',
  },
  followBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', sans-serif",
    marginLeft: '4px',
  },
  categoryTag: {
    color: '#ccc',
    fontSize: '14px',
    margin: '0 0 0 0',
    fontFamily: "'Segoe UI', sans-serif",
    textTransform: 'capitalize',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    paddingBottom: '4px',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '4px',
    padding: 0,
  },
  actionIcon: {
    fontSize: '28px',
    display: 'block',
  },
  actionCount: {
    color: '#fff',
    fontSize: '12px',
    fontFamily: "'Segoe UI', sans-serif",
    fontWeight: '600',
  },
};

export default ReelCard;