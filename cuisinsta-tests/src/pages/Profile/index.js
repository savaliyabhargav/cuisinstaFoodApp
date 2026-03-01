import React, { useState, useEffect } from 'react';
import { getFeed } from '../../services/api';

const USER_ID = 'user_001';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await getFeed(USER_ID, 1);
      setUserData(data);
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.message}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Header Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerGradient} />
      </div>

      {/* Avatar & Name */}
      <div style={styles.profileSection}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>U</span>
        </div>
        <h2 style={styles.username}>user_001</h2>
        <p style={styles.userHandle}>@foodlover</p>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>128</span>
            <span style={styles.statLabel}>Liked</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNumber}>34</span>
            <span style={styles.statLabel}>Saved</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNumber}>12</span>
            <span style={styles.statLabel}>Reviews</span>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🍽️ Your Food Interests</h3>
        <div style={styles.interestsRow}>
          {userData?.interests && userData.interests.length > 0 ? (
            userData.interests.map((interest) => (
              <span key={interest} style={styles.interestChip}>
                {interest}
              </span>
            ))
          ) : (
            <p style={styles.noInterests}>
              No interests yet — start liking reels to build your taste profile!
            </p>
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚙️ Settings</h3>
        <div style={styles.settingsList}>
          {[
            { icon: '🔔', label: 'Notifications' },
            { icon: '🔒', label: 'Privacy' },
            { icon: '🎨', label: 'Appearance' },
            { icon: '❓', label: 'Help & Support' },
            { icon: '🚪', label: 'Log Out' },
          ].map((item) => (
            <div key={item.label} style={styles.settingsItem}>
              <span style={styles.settingsIcon}>{item.icon}</span>
              <span style={styles.settingsLabel}>{item.label}</span>
              <span style={styles.settingsArrow}>›</span>
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
  centered: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
  },
  message: {
    color: '#fff',
    fontSize: '18px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  banner: {
    height: '180px',
    backgroundColor: '#1a1a1a',
    position: 'relative',
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 50%, #c0392b 100%)',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '-50px',
    paddingBottom: '24px',
    borderBottom: '1px solid #1f1f1f',
  },
  avatar: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#ff4757',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #0a0a0a',
    marginBottom: '12px',
  },
  avatarText: {
    color: '#fff',
    fontSize: '36px',
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '800',
    margin: '0 0 4px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  userHandle: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 24px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statNumber: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '800',
    fontFamily: "'Segoe UI', sans-serif",
  },
  statLabel: {
    color: '#666',
    fontSize: '12px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  statDivider: {
    width: '1px',
    height: '30px',
    backgroundColor: '#2a2a2a',
  },
  section: {
    padding: '24px 20px',
    borderBottom: '1px solid #1f1f1f',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  interestsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  interestChip: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #ff4757',
    color: '#ff4757',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontFamily: "'Segoe UI', sans-serif",
    textTransform: 'capitalize',
  },
  noInterests: {
    color: '#555',
    fontSize: '14px',
    fontFamily: "'Segoe UI', sans-serif",
    fontStyle: 'italic',
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  settingsItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    cursor: 'pointer',
    gap: '14px',
  },
  settingsIcon: {
    fontSize: '18px',
  },
  settingsLabel: {
    color: '#ddd',
    fontSize: '15px',
    flex: 1,
    fontFamily: "'Segoe UI', sans-serif",
  },
  settingsArrow: {
    color: '#444',
    fontSize: '20px',
  },
};

export default Profile;