import httpAxios from "../api/httpAxios"; // Giả sử bạn dùng chung httpAxios

// === HÀM HỖ TRỢ ĐỂ LẤY TOKEN ===
const getToken = () => {
  return localStorage.getItem('adminToken');
};

// === HÀM HỖ TRỢ ĐỂ TẠO HEADER ===
const getAuthHeaders = () => {
  const token = getToken();
  if (token) {
    // Nếu có token, trả về header Authorization
    return { Authorization: `Bearer ${token}` };
  } else {
    // Nếu không có token, trả về object rỗng
    // Backend sẽ từ chối nếu API yêu cầu xác thực
    return {};
  }
};

const UserService = {
  /**
   * Lấy danh sách tất cả người dùng từ server.
   * Yêu cầu quyền ADMIN.
   * @returns {Promise} - Promise chứa response từ server (danh sách user).
   */
  getAllUsers: () => {
    return httpAxios.get("/users", { headers: getAuthHeaders() });
  },

  // Bạn có thể thêm các hàm khác ở đây sau này, ví dụ:
  // getUserById: (id) => httpAxios.get(`/users/${id}`, { headers: getAuthHeaders() }),
  // createUser: (userData) => httpAxios.post("/users", userData, { headers: getAuthHeaders() }),
  // updateUser: (id, userData) => httpAxios.put(`/users/${id}`, userData, { headers: getAuthHeaders() }),
  // deleteUser: (id) => httpAxios.delete(`/users/${id}`, { headers: getAuthHeaders() }),
};

export default UserService;