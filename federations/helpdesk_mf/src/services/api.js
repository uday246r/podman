const BASE_URL = import.meta.env.VITE_API_URL || 'https://helpdesk-n6cw.onrender.com/api';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    // Decode base64url payload
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('helpdesk_user');
  return user ? JSON.parse(user) : { username: 'john_doe', role: 'Operator' };
};

export const setCurrentUser = (username, role) => {
  localStorage.setItem('helpdesk_user', JSON.stringify({ username, role }));
  // Force token refresh on user change
  localStorage.removeItem('helpdesk_token');
};

export const getAuthToken = async () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const getHeaders = async () => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (endpoint, options = {}) => {
  const headers = await getHeaders();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('helpdesk_token');
  }

  if (!res.ok) {
    throw new Error(await res.text() || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return;
  }

  return res.json();
};

export const api = {
  getTickets: async (filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    
    return request(`/ticket?${params.toString()}`);
  },

  getTicket: async (id) => {
    return request(`/ticket/${id}`);
  },

  createTicket: async (ticket) => {
    return request(`/ticket`, {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  },

  updateTicket: async (id, ticket) => {
    return request(`/ticket/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticket),
    });
  },

  deleteTicket: async (id) => {
    return request(`/ticket/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id, status) => {
    return request(`/ticket/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  assignTicket: async (id, assignedTo) => {
    return request(`/ticket/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo }),
    });
  },

  addComment: async (ticketId, commentText) => {
    return request(`/ticket/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ commentText }),
    });
  },

  getComments: async (ticketId) => {
    return request(`/ticket/${ticketId}/comments`);
  },

  getHistory: async (ticketId) => {
    return request(`/ticket/${ticketId}/history`);
  },
};
