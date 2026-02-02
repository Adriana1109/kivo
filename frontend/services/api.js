// API Configuration
export const API_URL = "http://localhost:3001";

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  
  return data;
}

// Auth API
export const auth = {
  async register(email, password, nombre) {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nombre }),
    });
  },
  
  async login(email, password) {
    const data = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  async me() {
    return apiCall('/api/auth/me');
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

// Materias API
export const materias = {
  async list() {
    return apiCall('/api/materias');
  },
  
  async get(id) {
    return apiCall(`/api/materias/${id}`);
  },
  
  async create(data) {
    return apiCall('/api/materias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async update(id, data) {
    return apiCall(`/api/materias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id) {
    return apiCall(`/api/materias/${id}`, {
      method: 'DELETE',
    });
  },
};

// Apuntes API
export const apuntes = {
  async list(materiaId = null) {
    const query = materiaId ? `?materia_id=${materiaId}` : '';
    return apiCall(`/api/apuntes${query}`);
  },
  
  async get(id) {
    return apiCall(`/api/apuntes/${id}`);
  },
  
  async create(data) {
    return apiCall('/api/apuntes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async update(id, data) {
    return apiCall(`/api/apuntes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id) {
    return apiCall(`/api/apuntes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Sesiones API
export const sesiones = {
  async list(options = {}) {
    const params = new URLSearchParams();
    if (options.materiaId) params.append('materia_id', options.materiaId);
    if (options.limit) params.append('limit', options.limit);
    const query = params.toString() ? `?${params}` : '';
    return apiCall(`/api/sesiones${query}`);
  },
  
  async getStats(periodo = null) {
    const query = periodo ? `?periodo=${periodo}` : '';
    return apiCall(`/api/sesiones/stats${query}`);
  },
  
  async create(data) {
    return apiCall('/api/sesiones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id) {
    return apiCall(`/api/sesiones/${id}`, {
      method: 'DELETE',
    });
  },
};

// Calendario API
export const calendario = {
  async list(options = {}) {
    const params = new URLSearchParams();
    if (options.tipo) params.append('tipo', options.tipo);
    if (options.fechaInicio) params.append('fecha_inicio', options.fechaInicio);
    if (options.fechaFin) params.append('fecha_fin', options.fechaFin);
    const query = params.toString() ? `?${params}` : '';
    return apiCall(`/api/calendario${query}`);
  },
  
  async create(data) {
    return apiCall('/api/calendario', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async update(id, data) {
    return apiCall(`/api/calendario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async toggle(id) {
    return apiCall(`/api/calendario/${id}/toggle`, {
      method: 'PATCH',
    });
  },
  
  async delete(id) {
    return apiCall(`/api/calendario/${id}`, {
      method: 'DELETE',
    });
  },
};
