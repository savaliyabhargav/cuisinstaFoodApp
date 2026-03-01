import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🍣', label: 'Sushi' },
  { emoji: '🍔', label: 'Burgers' },
  { emoji: '🍜', label: 'Ramen' },
  { emoji: '🌮', label: 'Tacos' },
  { emoji: '🍛', label: 'Curry' },
  { emoji: '🥗', label: 'Salads' },
  { emoji: '🍩', label: 'Desserts' },
];

const trending = [
  { id: 'reel_011', title: 'Biryani House', category: 'Biryani', likes: 400 },
  { id: 'reel_012', title: 'Biryani House', category: 'Biryani', likes: 380 },
  { id: 'reel_003', title: 'Pizza Palace', category: 'Pizza', likes: 350 },
  { id: 'reel_021', title: 'Burger Barn', category: 'Burgers', likes: 340 },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.greeting}>Good morning 👋</p>
          <h1 style={styles.title}>What are you <br /><span style={styles.highlight}>craving today?</span></h1>
        </div>
        <div style={styles.avatarBox}>
          <span style={styles.avatarText}>U</span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.searchInput}
          placeholder="Search food, restaurants..."
        />
      </div>

      {/* Categories */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Categories</h2>
      </div>
      <div style={styles.categoriesRow}>
        {categories.map((cat) => (
          <button
            key={cat.label}
            style={styles.categoryChip}
            onClick={() => navigate('/reels')}
          >
            <span style={styles.categoryEmoji}>{cat.emoji}</span>
            <span style={styles.categoryLabel}>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Trending Reels */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>🔥 Trending Now</h2>
        <button style={styles.seeAll} onClick={() => navigate('/reels')}>See all</button>
      </div>
      <div style={styles.trendingGrid}>
        {trending.map((item) => (
          <div
            key={item.id}
            style={styles.trendingCard}
            onClick={() => navigate('/reels')}
          >
            <div style={styles.trendingThumb}>
              <span style={styles.trendingId}>{item.id}</span>
            </div>
            <div style={styles.trendingInfo}>
              <p style={styles.trendingTitle}>{item.title}</p>
              <p style={styles.trendingMeta}>#{item.category} • ❤️ {item.likes}</p>
            </div>
          </div>
        ))}
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
    padding: '0 20px',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: '60px',
    paddingBottom: '24px',
  },
  greeting: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '6px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '800',
    lineHeight: '1.3',
    fontFamily: "'Segoe UI', sans-serif",
    margin: 0,
  },
  highlight: {
    color: '#ff4757',
  },
  avatarBox: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: '#ff4757',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '14px 18px',
    marginBottom: '30px',
    border: '1px solid #2a2a2a',
    gap: '10px',
  },
  searchIcon: {
    fontSize: '16px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '15px',
    width: '100%',
    fontFamily: "'Segoe UI', sans-serif",
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  seeAll: {
    background: 'none',
    border: 'none',
    color: '#ff4757',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', sans-serif",
  },
  categoriesRow: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '20px',
    scrollbarWidth: 'none',
    marginBottom: '10px',
  },
  categoryChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '14px 16px',
    cursor: 'pointer',
    minWidth: '70px',
    transition: 'all 0.2s ease',
  },
  categoryEmoji: {
    fontSize: '24px',
  },
  categoryLabel: {
    color: '#aaa',
    fontSize: '11px',
    fontFamily: "'Segoe UI', sans-serif",
    whiteSpace: 'nowrap',
  },
  trendingGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  trendingCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #2a2a2a',
    cursor: 'pointer',
  },
  trendingThumb: {
    height: '120px',
    backgroundColor: '#222',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #2a2a2a',
  },
  trendingId: {
    color: '#555',
    fontFamily: 'monospace',
    fontSize: '13px',
  },
  trendingInfo: {
    padding: '10px 12px',
  },
  trendingTitle: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  trendingMeta: {
    color: '#666',
    fontSize: '11px',
    margin: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default Home;