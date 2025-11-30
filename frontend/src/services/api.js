// API Service with JWT Token Management
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getAuthHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // AUTH ENDPOINTS
  async register(name, email, password, businessName, businessType) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        businessName,
        businessType
      })
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(updates) {
    return this.request('/auth/updateprofile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async logout() {
    this.setToken(null);
    return this.request('/auth/logout', { method: 'POST' });
  }

  // ANALYSIS ENDPOINTS
  async performInitialAnalysis(description, businessType, apiProvider = 'claude') {
    return this.request('/analyze/initial', {
      method: 'POST',
      body: JSON.stringify({
        description,
        businessType,
        apiProvider
      })
    });
  }

  async refineAnalysis(analysisId, message, apiProvider) {
    return this.request('/analyze/refine', {
      method: 'POST',
      body: JSON.stringify({
        analysisId,
        message,
        apiProvider
      })
    });
  }

  async getAnalysis(id) {
    return this.request(`/analyze/${id}`);
  }

  async getAnalyses(limit = 10, skip = 0) {
    return this.request(`/analyze?limit=${limit}&skip=${skip}`);
  }

  async deleteAnalysis(id) {
    return this.request(`/analyze/${id}`, { method: 'DELETE' });
  }
}

export default new APIClient();
