import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const restaurants = [
  { id: 'rest_001', name: 'Pizza Palace', category: 'Pizza', emoji: '🍕', distance: '0.3 km', rating: 4.8, reels: 12 },
  { id: 'rest_002', name: 'Burger Barn', category: 'Burgers', emoji: '🍔', distance: '0.7 km', rating: 4.5, reels: 8 },
  { id: 'rest_003', name: 'Sushi Station', category: 'Sushi', emoji: '🍣', distance: '1.1 km', rating: 4.9, reels: 15 },
  { id: 'rest_004', name: 'Taco Town', category: 'Tacos', emoji: '🌮', distance: '1.4 km', rating: 4.3, reels: 6 },
  { id: 'rest_005', name: 'Pasta Place', category: 'Pasta', emoji: '🍝', distance: '1.8 km', rating: 4.6, reels: 10 },
  { id: 'rest_006', name: 'Biryani House', category: 'Biryani', emoji: '🍛', distance: '2.1 km', rating: 4.7, reels: 18 },
  { id: 'rest_007', name: 'Curry Corner', category: 'Curry', emoji: '🍜', distance: '2.4 km', rating: 4.4, reels: 9 },
  { id: 'rest_008', name: 'Ramen Republic', category: 'Ramen', emoji: '🍜', distance: '2.9 km', rating: 4.8, reels: 14 },
];

function Map() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const filters = ['All', 'Pizza', 'Sushi', 'Burgers', 'Curry', 'Biryani'];

  const filtered = filter === 'All'
    ? restaurants
    : restaurants.filter((r) => r.category === filter);

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📍 Nearby</h1>
        <p style={styles.subtitle}>Restaurants around you</p>
      </div>

      {/* Map Placeholder */}
      <div style={styles.mapBox}>
        <div style={styles.mapInner}>
          {restaurants.map((r, i) => (
            <button
              key={r.id}
              style={{
                ...styles.mapPin,
                top: `${15 + (i % 3) * 28}%`,
                left: `${10 + (i % 4) * 22}%`,
                backgroundColor: selected?.id === r.id ? '#ff4757' : '#1a1a1a',
                border: selected?.id === r.id ? '2px solid #fff' : '2px solid #ff4757',
              }}
              onClick={() => setSelected(r)}
            >
              <span style={styles.pinEmoji}>{r.emoji}</span>
            </button>
          ))}
          <p style={styles.mapLabel}>🗺️ Map View</p>
        </div>
      </div>

      {/* Filter Row */}
      <div style={styles.filterRow}>
        {filters.map((f) => (
          <button
            key={f}
            style={{
              ...styles.filterChip,
              backgroundColor: filter === f ? '#ff4757' : '#1a1a1a',
              color: filter === f ? '#fff' : '#888',
              border: filter === f ? '1px solid #ff4757' : '1px solid #2a2a2a',
            }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Selected Restaurant Card */}
      {selected && (
        <div style={styles.selectedCard}>
          <div style={styles.selectedLeft}>
            <div style={styles.selectedEmoji}>{selected.emoji}</div>
            <div>
              <p style={styles.selectedName}>{selected.name}</p>
              <p style={styles.selectedMeta}>#{selected.category} • ⭐ {selected.rating} • 📍 {selected.distance}</p>
            </div>
          </div>
          <button
            style={styles.viewReelsBtn}
            onClick={() => navigate('/reels')}
          >
            View Reels
          </button>
        </div>
      )}

      {/* Restaurant List */}
      <div style={styles.listSection}>
        <h3 style={styles.listTitle}>All Restaurants</h3>
        <div style={styles.list}>
          {filtered.map((r) => (
            <div
              key={r.id}
              style={{
                ...styles.listItem,
                border: selected?.id === r.id ? '1px solid #ff4757' : '1px solid #2a2a2a',
              }}
              onClick={() => setSelected(r)}
            >
              <div style={styles.listEmoji}>{r.emoji}</div>
              <div style={styles.listInfo}>
                <p style={styles.listName}>{r.name}</p>
                <p style={styles.listMeta}>📍 {r.distance} • ⭐ {r.rating} • 🎬 {r.reels} reels</p>
              </div>
              <button
                style={styles.reelsBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/reels');
                }}
              >
                🎬
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom padding for navbar */}
      <div style={{ height: '90px' }} />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    overflowY: 'auto',
  },
  header: {
    padding: '60px 20px 20px 20px',
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '800',
    margin: '0 0 4px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  mapBox: {
    margin: '0 20px 20px 20px',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid #2a2a2a',
  },
  mapInner: {
    height: '220px',
    backgroundColor: '#111',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLabel: {
    color: '#333',
    fontSize: '16px',
    fontFamily: "'Segoe UI', sans-serif",
    position: 'absolute',
    bottom: '10px',
    right: '14px',
  },
  mapPin: {
    position: 'absolute',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pinEmoji: {
    fontSize: '18px',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    padding: '0 20px 20px 20px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  filterChip: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: "'Segoe UI', sans-serif",
    transition: 'all 0.2s ease',
  },
  selectedCard: {
    margin: '0 20px 20px 20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #ff4757',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  selectedEmoji: {
    fontSize: '32px',
  },
  selectedName: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  selectedMeta: {
    color: '#888',
    fontSize: '12px',
    margin: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  viewReelsBtn: {
    backgroundColor: '#ff4757',
    border: 'none',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', sans-serif",
  },
  listSection: {
    padding: '0 20px',
  },
  listTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 14px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#1a1a1a',
    borderRadius: '14px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  listEmoji: {
    fontSize: '28px',
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  listMeta: {
    color: '#666',
    fontSize: '12px',
    margin: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  reelsBtn: {
    background: 'none',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '8px 10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Map;