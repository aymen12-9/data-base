// Fichier : frontend/src/services/api.ts

import axios from 'axios';
import { getRuntimeApiUrl } from './runtimeConfig';

// API base URL is read at runtime using getRuntimeApiUrl
export const getApiBaseUrl = () => getRuntimeApiUrl() || '';

// Base URL for health check (API root without '/api')
const getHealthBaseUrl = () => {
  const base = getApiBaseUrl();
  return base ? base.replace(/\/api\/?$/, '') : '';
};

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeApi = {
  // Collections
  getCollections: () => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/collections`);
  },

  // Employees CRUD
  getAllEmployees: () => {
    if (!getApiBaseUrl()) {
      return Promise.reject(new Error('VITE_API_URL is not configured'));
    }
    return api.get(`${getApiBaseUrl()}/employees`).then((res) => {
      // Normaliser la réponse : certains backend renvoient { employees: [...] }
      const data = Array.isArray(res.data) ? res.data : (res.data.employees || res.data);
      return { ...res, data };
    });
  },
  countEmployees: () => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/employees/count`);
  },
  addEmployee: (employee: any) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.post(`${getApiBaseUrl()}/employees`, employee);
  },

  // Queries
  findByNamePattern: (
    pattern: string,
    position: 'start' | 'end' | 'any' = 'start'
  ) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/employees/name/${pattern}?position=${position}`);
  },

  findByNameLength: (pattern: string, length: number) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/employees/name-length/${pattern}/${length}`);
  },

  findBySeniority: (years: number) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/employees/seniority/${years}`);
  },
  findWithStreet: () => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/employees/with-street`);
  },

  incrementPrime: (amount: number = 200) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.post(`${getApiBaseUrl()}/employees/increment-prime`, { amount });
  },

  getOldestEmployees: (limit: number = 10) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/employees/oldest/${limit}`);
  },

  groupByCity: (city: string) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/employees/city/${city}`);
  },

  searchEmployees: (namePattern: string, cities: string[]) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL is not configured'));
    return api.get(`${getApiBaseUrl()}/employees/search?name=${namePattern}&cities=${cities.join(',')}`);
  },

  // Analytics
  getVilleStats: () => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.'));
    return api.get(`${getApiBaseUrl()}/analytics/ville-stats`);
  },
  getDoublons: () => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.'));
    return api.get(`${getApiBaseUrl()}/analytics/doublons`);
  },
  // Update and delete
  updateEmployee: (id: string, data: any) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.'));
    return api.put(`${getApiBaseUrl()}/employees/${id}`, data);
  },
  deleteEmployee: (id: string) => {
    if (!getApiBaseUrl()) return Promise.reject(new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.'));
    return api.delete(`${getApiBaseUrl()}/employees/${id}`);
  },
  // Health check against the API base root (not /api)
  healthCheck: () => {
    if (!getHealthBaseUrl()) {
      return Promise.reject(new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.'));
    }
    return axios.get(`${getHealthBaseUrl()}/`);
  },
};

export default api;
