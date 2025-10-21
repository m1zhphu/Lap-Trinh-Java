import httpAxios from "../api/httpAxios";

// === 1. ADD HELPER FUNCTIONS (Copy from ProductService.js) ===
// Function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Function to create Authorization header
const getAuthHeaders = () => {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {}; 
  }
};

// === 2. UPDATE API CALLS ===
const CategoryService = {
  // Add { headers: getAuthHeaders() } to every call
  getAll: () => httpAxios.get("/categories", { headers: getAuthHeaders() }),
  getById: (id) => httpAxios.get(`/categories/${id}`, { headers: getAuthHeaders() }),
  create: (data) => httpAxios.post("/categories", data, { headers: getAuthHeaders() }),
  update: (id, data) => httpAxios.put(`/categories/${id}`, data, { headers: getAuthHeaders() }),
  remove: (id) => httpAxios.delete(`/categories/${id}`, { headers: getAuthHeaders() }),
};

export default CategoryService;