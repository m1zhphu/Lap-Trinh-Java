import httpAxios from "../api/httpAxios"; // Hoặc axios instance của bạn

// === 1. THÊM CÁC HÀM HỖ TRỢ (Giống như ProductService) ===
// Hàm lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Hàm tạo các header cần thiết cho việc upload file
const getAuthHeadersForUpload = () => {
  const token = getToken();
  const headers = {
    // Header này là bắt buộc khi upload file bằng FormData
    'Content-Type': 'multipart/form-data', 
  };
  if (token) {
    // Thêm header Authorization nếu có token
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// === 2. CẬP NHẬT HÀM UPLOAD ===
const FileUploadService = {
  /**
   * Tải một file lên server vào thư mục con được chỉ định.
   * @param {File} file - File object cần upload. // <-- Sửa: Nhận File object
   * @param {string} subDirectory - Tên thư mục con (vd: "products", "banners"). // <-- Thêm tham số này
   * @returns {Promise} - Promise chứa phản hồi từ server.
   */
  upload: (file, subDirectory) => { // <-- Sửa: Nhận 'file' và 'subDirectory'
    // Tạo FormData bên trong hàm upload
    const formData = new FormData(); 
    formData.append("file", file);         // Thêm file vào FormData
    formData.append("dir", subDirectory);  // <-- Thêm thư mục con vào FormData

    // Gửi formData và headers
    return httpAxios.post("/files/upload", formData, { headers: getAuthHeadersForUpload() });
  },

  // (Các hàm khác nếu có)
};

export default FileUploadService;