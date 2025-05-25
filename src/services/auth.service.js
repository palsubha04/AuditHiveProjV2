import api from './axios.config';

export const authService = {
  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async forgotPassword(data) {
    await api.post('/auth/forgot-password', data);
  },

  logout() {
    // Clear all auth-related data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Force reload to clear any cached state
    window.location.href = '/login';
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },  

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
}; 