import React, { useState, useEffect, useRef } from 'react';
import { getFeed, toggleLike } from './services/api';
import ReelCard from './components/ReelCard';

const USER_ID = 'user_001';

function App() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // When user is 2 reels away from the end, load more
      if (distanceFromBottom < clientHeight * 2 && !isFetching) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isFetching, reels]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const data = await getFeed(USER_ID, 10);
      setReels(data.feed);
    } catch (err) {
      setError('Failed to load feed. Make sure your API is running on port 5002.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (isFetching) return;
    try {
      setIsFetching(true);
      const data = await getFeed(USER_ID, 10);
      setReels((prev) => [...prev, ...data.feed]);
    } catch (err) {
      console.error('Failed to load more reels:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLike = async (reelId) => {
    try {
      const result = await toggleLike(USER_ID, reelId);
      setReels((prev) =>
        prev.map((reel) =>
          reel.reel_id === reelId
            ? {
                ...reel,
                did_i_like: result.action === 'liked',
                like_count: result.new_like_count,
              }
            : reel
        )
      );
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.message}>Loading reels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centered}>
        <p style={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container} ref={containerRef}>
      {reels.map((reel, index) => (
        <ReelCard
          key={`${reel.reel_id}_${index}`}
          reel={reel}
          userId={USER_ID}
          onLike={handleLike}
        />
      ))}
      {isFetching && (
        <div style={styles.centered}>
          <p style={styles.message}>Loading more...</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    backgroundColor: '#111',
  },
  centered: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  message: {
    color: '#fff',
    fontSize: '18px',
    fontFamily: 'monospace',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: '16px',
    fontFamily: 'monospace',
    textAlign: 'center',
    padding: '20px',
  },
};

export default App;