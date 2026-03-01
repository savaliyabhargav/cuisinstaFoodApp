import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/reels', icon: '🎬', label: 'Reels' },
  { path: '/map', icon: '🗺️', label: 'Map' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            style={{
              ...styles.navItem,
              ...(isActive ? styles.activeItem : {}),
            }}
            onClick={() => navigate(item.path)}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span
              style={{
                ...styles.label,
                ...(isActive ? styles.activeLabel : {}),
              }}
            >
              {item.label}
            </span>
            {isActive && <div style={styles.activeDot} />}
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid #1f1f1f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1000,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 20px',
    borderRadius: '16px',
    position: 'relative',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  activeItem: {
    backgroundColor: '#1a1a1a',
  },
  icon: {
    fontSize: '22px',
  },
  label: {
    fontSize: '11px',
    color: '#555',
    fontFamily: "'Segoe UI', sans-serif",
    fontWeight: '500',
    letterSpacing: '0.5px',
  },
  activeLabel: {
    color: '#ff4757',
  },
  activeDot: {
    position: 'absolute',
    bottom: '4px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#ff4757',
  },
};

export default Navbar;