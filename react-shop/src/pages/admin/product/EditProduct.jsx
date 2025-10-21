import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../../../services/ProductService";
import CategoryService from "../../../services/CategoryService";
import FileUploadService from "../../../services/FileUploadService";
import { ArrowLeft, RefreshCw } from "lucide-react";

// *** SỬA LẠI ĐƯỜNG DẪN NÀY CHO ĐÚNG ***
// Thêm "/images/" để khớp với cấu trúc thư mục uploads/images/products
const IMAGE_BASE_URL = "http://localhost:8080/uploads/images/products/";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "", price: "", salePrice: "", description: "", quantity: "", categoryId: "", image: "", status: true
  });

  const [categories, setCategories] = useState([]);
  const [newSelectedFile, setNewSelectedFile] = useState(null); // File ảnh MỚI người dùng chọn
  const [imagePreview, setImagePreview] = useState(null); // URL xem trước (ảnh mới hoặc cũ)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // State để biết khi nào dữ liệu sản phẩm cũ đã tải xong

  // Tải dữ liệu sản phẩm cần sửa và danh sách danh mục khi component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu tải
      setMessage(""); // Xóa thông báo cũ
      try {
        const [productRes, categoriesRes] = await Promise.all([
          ProductService.getById(id),
          CategoryService.getAll(),
        ]);
        setProduct(productRes.data); // Điền dữ liệu sản phẩm cũ vào state
        setCategories(categoriesRes.data); // Điền danh sách danh mục
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setMessage("Không thể tải dữ liệu sản phẩm hoặc danh mục!");
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };
    fetchData();
  }, [id]); // Phụ thuộc vào id, chạy lại nếu id thay đổi

  // Hàm xử lý thay đổi giá trị input (text, number, select, checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      // Nếu là checkbox thì lấy giá trị checked, ngược lại lấy value
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Hàm xử lý khi người dùng chọn file ảnh mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewSelectedFile(file); // Lưu file MỚI vào state riêng
      setImagePreview(URL.createObjectURL(file)); // Tạo URL xem trước cho ảnh MỚI
    } else {
      // Nếu chọn file không hợp lệ hoặc hủy chọn
      setNewSelectedFile(null);
      // Hiển thị lại ảnh cũ nếu có, nếu không thì không hiển thị gì
      setImagePreview(product.image ? `${IMAGE_BASE_URL}${product.image}` : null);
      if (file) { // Chỉ thông báo nếu người dùng thực sự chọn file không hợp lệ
        alert("Vui lòng chọn một file hình ảnh hợp lệ (jpg, png, gif...).");
      }
    }
  };

  // Hàm xử lý khi submit form cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- Validation --- (Kiểm tra dữ liệu nhập vào)
    if (!product.name.trim()) { alert("Tên sản phẩm không được để trống!"); return; }
    if (!product.price || parseFloat(product.price) < 0) { alert("Giá sản phẩm không hợp lệ!"); return; }
    if (product.salePrice && parseFloat(product.salePrice) < 0) { alert("Giá khuyến mãi không được là số âm!"); return; }
    if (product.salePrice && parseFloat(product.salePrice) >= parseFloat(product.price)) { alert("Giá khuyến mãi phải nhỏ hơn giá gốc!"); return; }
    if (!product.quantity || parseInt(product.quantity, 10) < 0) { alert("Số lượng sản phẩm không hợp lệ!"); return; }
    if (!product.categoryId) { alert("Vui lòng chọn một danh mục!"); return; }
    // Không cần kiểm tra file ảnh ở đây nữa vì có thể người dùng không muốn đổi ảnh

    setIsSubmitting(true);
    setMessage("");

    try {
      let finalImageName = product.image; // Mặc định giữ lại tên ảnh cũ

      // Nếu người dùng đã chọn một file ảnh MỚI
      if (newSelectedFile) {
        // *** SỬA LẠI CÁCH GỌI UPLOAD ***
        // Gọi service upload với file MỚI và tên thư mục con "products"
        const uploadResponse = await FileUploadService.upload(newSelectedFile, "products");

        // Lấy tên file mới trả về từ server
        finalImageName = uploadResponse.data.fileName;

        // TODO (Nâng cao): Nếu muốn xóa ảnh cũ trên server khi upload ảnh mới,
        // bạn cần gọi một API xóa file ở đây, truyền vào product.image (tên ảnh cũ).
      }

      // Tạo dữ liệu sản phẩm cuối cùng để gửi đi cập nhật
      const finalProductData = { ...product, image: finalImageName };

      // Gọi API cập nhật sản phẩm
      await ProductService.update(id, finalProductData);

      setMessage("Cập nhật sản phẩm thành công! Sẽ tự động quay lại sau 2 giây.");
      setTimeout(() => navigate("/admin/products"), 2000); // Chuyển hướng về trang danh sách

    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      const errorMsg = err.response?.data?.message || err.message || "Cập nhật thất bại! Vui lòng thử lại.";
      setMessage(errorMsg);
      setIsSubmitting(false); // Cho phép submit lại nếu có lỗi
    }
  };

  // Hiển thị trạng thái đang tải dữ liệu sản phẩm ban đầu
  if (loading) {
    return <div className="text-center p-10">Đang tải dữ liệu sản phẩm...</div>;
  }

  // --- Render Form ---
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
          <p className="text-gray-500 mt-1">Cập nhật thông tin chi tiết cho sản phẩm ID: {id}.</p>
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          <ArrowLeft size={20} />
          Quay lại danh sách
        </button>
      </div>

      {/* Thông báo */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg text-center font-medium ${message.includes("thành công") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Cột trái: Thông tin chính --- */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6">
            {/* Tên sản phẩm */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm</label>
              <input type="text" id="name" name="name" value={product.name || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            {/* Giá */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">Giá gốc (VNĐ)</label>
                <input type="number" id="price" name="price" min="0" value={product.price || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
              </div>
              <div>
                <label htmlFor="salePrice" className="block text-sm font-semibold text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
                <input type="number" id="salePrice" name="salePrice" min="0" value={product.salePrice || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500 transition" placeholder="Bỏ trống nếu không giảm giá" />
              </div>
            </div>
            {/* Số lượng */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">Số lượng</label>
              <input type="number" id="quantity" name="quantity" min="0" value={product.quantity || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            {/* Mô tả */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chi tiết</label>
              <textarea id="description" name="description" value={product.description || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" rows={5} />
            </div>
          </div>

          {/* --- Cột phải: Danh mục, Trạng thái, Hình ảnh --- */}
          <div className="lg:col-span-1 space-y-8">
            {/* Danh mục */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">Danh mục sản phẩm</label>
              <select id="categoryId" name="categoryId" value={product.categoryId || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required>
                <option value="" disabled>-- Chọn danh mục --</option>
                {categories.map((category) => (<option key={category.id} value={category.id}>{category.name}</option>))}
              </select>
            </div>

            {/* Trạng thái */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Trạng thái xuất bản</label>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${product.status ? 'text-green-600' : 'text-gray-500'}`}>
                  {product.status ? 'Công khai / Hiển thị' : 'Bản nháp / Ẩn'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="status" className="sr-only peer" checked={product.status || false} onChange={handleChange} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Hình ảnh */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
              <div className="mt-2 text-center">
                {/* Hiển thị ảnh preview (nếu có) hoặc ảnh cũ */}
                <img
                  src={imagePreview || (product.image ? `${IMAGE_BASE_URL}${product.image}` : "https://via.placeholder.com/150")}
                  alt="Xem trước"
                  className="mx-auto h-40 w-40 object-cover rounded-md shadow-md mb-4 bg-gray-100" // Thêm bg-gray-100
                  // Xử lý lỗi nếu ảnh cũ không tải được
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150" }}
                />
                {/* Nút chọn file */}
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-200">
                  <RefreshCw size={18} />
                  Thay đổi ảnh
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
                {/* Hiển thị tên file mới nếu đã chọn */}
                {newSelectedFile && <p className="mt-2 text-sm text-gray-500">Đã chọn: {newSelectedFile.name}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Nút Submit */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || loading} // Disable cả khi đang tải dữ liệu ban đầu
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </>
  );
}