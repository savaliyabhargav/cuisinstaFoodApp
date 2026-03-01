import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Reels from './pages/Reels';
import Map from './pages/Map';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        <div style={styles.pageContainer}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/map" element={<Map />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </BrowserRouter>
  );
}

const styles = {
  appContainer: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#0a0a0a',
    position: 'relative',
    overflow: 'hidden',
  },
  pageContainer: {
    height: '100vh',
    width: '100%',
    overflowY: 'auto',
  },
};

export default App;