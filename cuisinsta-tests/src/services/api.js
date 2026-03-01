import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

export const getFeed = async (userId, count = 10) => {
  const response = await axios.get(`${BASE_URL}/feed/${userId}`, {
    params: { count },
  });
  return response.data;
};

export const toggleLike = async (userId, reelId) => {
  const response = await axios.post(`${BASE_URL}/like`, {
    user_id: userId,
    reel_id: reelId,
  });
  return response.data;
};