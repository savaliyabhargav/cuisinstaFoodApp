import React, { useState, useEffect, useRef } from 'react';
import { getFeed, toggleLike, recordWatchTime } from '../../services/api';
import ReelCard from '../../components/ReelCard';

const USER_ID = 'user_001';

function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = useRef(null);
  const watchStartTime = useRef(null);
  const currentReelIndex = useRef(0);

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start watch timer when feed loads
    watchStartTime.current = Date.now();

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      // Calculate which reel is currently visible
      const newIndex = Math.round(scrollTop / clientHeight);

      // If user scrolled to a new reel
      if (newIndex !== currentReelIndex.current) {

        // Record watch time for the reel they just left
        const secondsWatched = (Date.now() - watchStartTime.current) / 1000;
        const watchedReel = reels[currentReelIndex.current];

        if (watchedReel && secondsWatched > 0.5) {
          recordWatchTime(USER_ID, watchedReel.category, secondsWatched)
            .catch((err) => console.error('Watch time error:', err));
        }

        // Reset timer for new reel
        watchStartTime.current = Date.now();
        currentReelIndex.current = newIndex;
      }

      // Load more when 2 reels away from end
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom < clientHeight * 2 && !isFetching) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isFetching, reels]);

  // Record watch time when user leaves the reels page
  useEffect(() => {
    return () => {
      const secondsWatched = (Date.now() - watchStartTime.current) / 1000;
      const watchedReel = reels[currentReelIndex.current];
      if (watchedReel && secondsWatched > 0.5) {
        recordWatchTime(USER_ID, watchedReel.category, secondsWatched)
          .catch((err) => console.error('Watch time error:', err));
      }
    };
  }, [reels]);

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
        <div style={styles.loadingMore}>
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
    backgroundColor: '#0a0a0a',
  },
  centered: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
  },
  loadingMore: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
  },
  message: {
    color: '#fff',
    fontSize: '18px',
    fontFamily: 'monospace',
  },
  errorMessage: {
    color: '#ff4757',
    fontSize: '16px',
    fontFamily: 'monospace',
    textAlign: 'center',
    padding: '20px',
  },
};

export default Reels;