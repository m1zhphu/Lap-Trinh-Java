import httpAxios from "../api/httpAxios";

// === 1. THÊM CÁC HÀM HỖ TRỢ ===
// Hàm lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Hàm tạo header Authorization
const getAuthHeaders = () => {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    // Nếu không có token, trả về object rỗng
    // Backend sẽ tự động từ chối nếu API yêu cầu xác thực
    return {}; 
  }
};

// === 2. CẬP NHẬT CÁC HÀM GỌI API ===
const ProductService = {
  // ======== CRUD cơ bản ========
  getAll: () => httpAxios.get("/products", { headers: getAuthHeaders() }), // Thêm header
  getById: (id) => httpAxios.get(`/products/${id}`, { headers: getAuthHeaders() }), // Thêm header
  create: (data) => httpAxios.post("/products", data, { headers: getAuthHeaders() }), // Thêm header
  update: (id, data) => httpAxios.put(`/products/${id}`, data, { headers: getAuthHeaders() }), // Thêm header
  remove: (id) => httpAxios.delete(`/products/${id}`, { headers: getAuthHeaders() }), // Thêm header

  // ======== 3 truy vấn mở rộng ========

  // 1️⃣ Tìm kiếm theo tên (keyword) - Giả sử API này cũng cần ADMIN
  searchByName: (keyword) =>
    httpAxios.get(`/products/search?keyword=${encodeURIComponent(keyword)}`, { headers: getAuthHeaders() }), // Thêm header

  // 2️⃣ Lọc theo khoảng giá - Giả sử API này cũng cần ADMIN
  filterByPrice: (min, max) =>
    httpAxios.get(`/products/filter?min=${min}&max=${max}`, { headers: getAuthHeaders() }), // Thêm header

  // 3️⃣ Lọc theo danh mục - Giả sử API này cũng cần ADMIN
  filterByCategory: (cateId) => httpAxios.get(`/products/category/${cateId}`, { headers: getAuthHeaders() }), // Thêm header
};

export default ProductService;