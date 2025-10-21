import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../../services/ProductService";
import CategoryService from "../../../services/CategoryService";
import FileUploadService from "../../../services/FileUploadService";
import { ArrowLeft, UploadCloud } from "lucide-react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    salePrice: "",
    description: "",
    quantity: "",
    categoryId: "",
    image: "",
    status: true, // Mặc định là hiển thị
  });

  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    CategoryService.getAll()
      .then((res) => setCategories(res.data))
      .catch((error) => console.error("Không thể tải danh sách danh mục!", error));
  }, []);

  // === SỬA LẠI HÀM handleChange CHO ĐÚNG ===
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (logic kiểm tra dữ liệu giữ nguyên) ...
    if (parseFloat(product.price) < 0) { alert("Giá sản phẩm không được là số âm!"); return; }
    if (product.salePrice && parseFloat(product.salePrice) < 0) { alert("Giá khuyến mãi không được là số âm!"); return; }
    if (product.salePrice && parseFloat(product.salePrice) >= parseFloat(product.price)) { alert("Giá khuyến mãi phải nhỏ hơn giá gốc!"); return; }
    if (parseInt(product.quantity, 10) < 0) { alert("Số lượng sản phẩm không được là số âm!"); return; }
    if (!product.categoryId) { alert("Vui lòng chọn một danh mục!"); return; }
    if (!selectedFile) { alert("Vui lòng chọn một hình ảnh cho sản phẩm!"); return; }

    setIsSubmitting(true);
    setMessage("");

    try {
            // ---- BỎ PHẦN TẠO formData Ở ĐÂY ----
            // const formData = new FormData();
            // formData.append("file", selectedFile);

            // 1. Gọi upload VỚI `selectedFile` (File object) và tên thư mục "products"
            const uploadResponse = await FileUploadService.upload(selectedFile, "products");

            // 2. Lấy tên file đã lưu
            const imageName = uploadResponse.data.fileName;

            // 3. Tạo product data và gọi API create (giữ nguyên)
            const productData = { ...product, image: imageName };
            await ProductService.create(productData);

            // 4. Thông báo và redirect (giữ nguyên)
            setMessage("Thêm sản phẩm thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/products"), 2000);

        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err); // Log lỗi chi tiết hơn
            // Hiển thị thông báo lỗi cụ thể hơn nếu có
            const errorMsg = err.response?.data?.message || err.message || "Thêm sản phẩm thất bại! Vui lòng thử lại.";
            setMessage(errorMsg);
            setIsSubmitting(false);
        }
    };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tạo sản phẩm mới</h1>
          <p className="text-gray-500 mt-1">Điền thông tin chi tiết cho sản phẩm của bạn.</p>
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg text-center font-medium ${message.includes("thành công") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin chính */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm</label>
              <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Giá gốc (VNĐ)</label>
                <input type="number" name="price" min="0" value={product.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
                <input type="number" name="salePrice" min="0" value={product.salePrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500 transition" placeholder="Bỏ trống nếu không giảm giá" />
              </div>
            </div>
            
            {/* === SỬA LẠI LAYOUT CHO SỐ LƯỢNG === */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng</label>
                <input type="number" name="quantity" min="0" value={product.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chi tiết</label>
              <textarea name="description" value={product.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" rows={5} />
            </div>
          </div>

          {/* Cột phải: Danh mục, Hình ảnh, và Trạng thái */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục sản phẩm</label>
              <select name="categoryId" value={product.categoryId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required>
                <option value="" disabled>-- Chọn danh mục --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* === THÊM CARD MỚI CHO TRẠNG THÁI === */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Trạng thái xuất bản</label>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${product.status ? 'text-green-600' : 'text-gray-500'}`}>
                  {product.status ? 'Công khai / Hiển thị' : 'Bản nháp / Ẩn'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="status" className="sr-only peer" checked={product.status} onChange={handleChange} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
              <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
                <div className="text-center">
                  {imagePreview ? ( <img src={imagePreview} alt="Xem trước" className="mx-auto h-40 w-40 object-cover rounded-md" /> ) : (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500">
                          <span>Tải ảnh lên</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="pl-1">hoặc kéo và thả</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
          </button>
        </div>
      </form>
    </>
  );
}