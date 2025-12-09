// Fichier : frontend/src/services/api.ts

import axios from 'axios';

// Avec Vite, utilisez import.meta.env au lieu de process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeApi = {
  // Collections
  getCollections: () => api.get('/collections'),
  
  // Employees CRUD
  getAllEmployees: () => api.get('/employees'),
  countEmployees: () => api.get('/employees/count'),
  addEmployee: (employee: any) => api.post('/employees', employee),
  
  // Query endpoints
  findByNamePattern: (pattern: string, position: 'start' | 'end' | 'any' = 'start') => 
    api.get(`/employees/name/${pattern}?position=${position}`),
  
  findByNameLength: (pattern: string, length: number) =>
    api.get(`/employees/name-length/${pattern}/${length}`),
  
  findBySeniority: (years: number) => api.get(`/employees/seniority/${years}`),
  
  findWithStreet: () => api.get('/employees/with-street'),
  
  incrementPrime: (amount: number = 200) => 
    api.post('/employees/increment-prime', { amount }),
  
  getOldestEmployees: (limit: number = 10) => 
    api.get(`/employees/oldest/${limit}`),
  
  groupByCity: (city: string) => api.get(`/employees/city/${city}`),
  
  searchEmployees: (namePattern: string, cities: string[]) =>
    api.get(`/employees/search?name=${namePattern}&cities=${cities.join(',')}`),
  
  // Analytics
  getVilleStats: () => api.get('/analytics/ville-stats'),
  getDoublons: () => api.get('/analytics/doublons'),
};

export default api;