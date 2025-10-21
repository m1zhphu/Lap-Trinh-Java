import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../../services/ProductService";
import { PlusCircle, Search, ShoppingCart, Edit, Trash2 } from "lucide-react"; // Import icon

const IMAGE_BASE_URL = "http://localhost:8080/uploads/images/products/";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ProductService.getAll();
      setProducts(res.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu sản phẩm!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!keyword.trim()) {
      fetchData();
      return;
    }
    ProductService.searchByName(keyword)
      .then(res => setProducts(res.data))
      .catch(() => {
        setError("Không tìm thấy sản phẩm với tên này!");
        setProducts([]);
      });
  };

  const handleFilterByPrice = () => {
    if (!minPrice || !maxPrice) {
      alert("Vui lòng nhập cả giá trị tối thiểu và tối đa!");
      return;
    }
    ProductService.filterByPrice(minPrice, maxPrice)
      .then(res => setProducts(res.data))
      .catch(() => {
        setError("Không tìm thấy sản phẩm trong khoảng giá này!");
        setProducts([]);
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await ProductService.remove(id);
      fetchData();
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm!");
    }
  };

  const handleReset = () => {
    setKeyword("");
    setMinPrice("");
    setMaxPrice("");
    fetchData();
  };
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* Bọc toàn bộ header trong flex */}
      <div className="flex justify-between items-center mb-6 gap-4">
        {/* Phần tiêu đề bên trái (giữ nguyên) */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={32} className="text-blue-600" />
            Danh sách sản phẩm
          </h1>
          <p className="text-gray-500 mt-1">Quản lý toàn bộ sản phẩm của bạn tại đây.</p>
        </div>

        {/* Phần bên phải: Chứa cả Tìm kiếm/Lọc và Nút Thêm */}
        <div className="flex items-start gap-4"> {/* Đổi items-center thành items-start nếu cần */}

          {/* --- Card Tìm kiếm và Lọc (Gộp lại và thu nhỏ) --- */}
          {/* Giảm padding, đặt max-w */}
          <div className="bg-white p-3 rounded-xl shadow-md w-full max-w-lg">
            {/* Phần tìm kiếm */}
            <div className="flex items-center gap-2 mb-2"> {/* Thêm mb-2 */}
              <div className="relative flex-grow">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  className="border border-gray-300 rounded-lg p-2 pl-9 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-full" // Giảm padding
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
              {/* Nút Tìm thu nhỏ */}
              <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition duration-200 text-sm whitespace-nowrap">Tìm kiếm</button>
            </div>
            {/* Phần lọc giá */}
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Giá từ" className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Giá đến" className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              {/* Nút Lọc và Reset thu nhỏ */}
              <button onClick={handleFilterByPrice} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition duration-200 text-sm whitespace-nowrap">Lọc giá</button>
              <button onClick={handleReset} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-lg transition duration-200 text-sm">Reset</button>
            </div>
          </div>
          {/* --- Kết thúc Card Tìm kiếm và Lọc --- */}

          {/* Nút Thêm sản phẩm */}
          <button
            onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 whitespace-nowrap" // Thêm whitespace-nowrap
          >
            <PlusCircle size={20} />
            Thêm sản phẩm
          </button>
        </div>
        {/* === KẾT THÚC SỬA ĐỔI HEADER === */}
      </div>

      {/* Thông báo lỗi (Giữ nguyên) */}
      {error && <p className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 text-center">{error}</p>}

      {/* Bảng sản phẩm */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full">
          {/* ... thead và tbody giữ nguyên ... */}
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Hình ảnh</th>
              <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Tên sản phẩm</th>
              <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Giá gốc</th>
              <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Giá KM</th>
              <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Số lượng</th>
              <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Danh mục</th>
              <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="text-center p-4 text-gray-500">Đang tải dữ liệu sản phẩm...</td></tr>
            ) : products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{p.id}</td>
                  <td className="p-3 border-b">
                    {p.image ? (
                      <img src={`${IMAGE_BASE_URL}${p.image}`} alt={p.name} className="h-12 w-12 object-cover rounded-md" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Img</div>
                    )}
                  </td>
                  <td className="p-3 border-b font-medium text-gray-800">{p.name}</td>
                  <td className={`p-3 border-b text-gray-600 ${p.salePrice && p.salePrice > 0 ? 'line-through text-red-400' : ''}`}>{p.price.toLocaleString()} VNĐ</td>
                  <td className="p-3 border-b font-semibold text-green-600">{p.salePrice && p.salePrice > 0 ? `${p.salePrice.toLocaleString()} VNĐ` : '—'}</td>
                  <td className="p-3 border-b text-center text-gray-600">{p.quantity}</td>
                  <td className="p-3 border-b text-gray-600">{p.categoryName}</td>
                  <td className="p-3 border-b text-center">
                    {p.status ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Hiển thị</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Đang ẩn</span>
                    )}
                  </td>
                  <td className="p-3 border-b text-center">
                    <button onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                      className="text-blue-500 hover:text-blue-700 font-semibold py-1 px-3 mr-2 rounded transition duration-200">
                      <Edit size={16} className="inline-block" /> Sửa
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:text-red-700 font-semibold py-1 px-3 rounded transition duration-200">
                      <Trash2 size={16} className="inline-block" /> Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="text-center p-4 text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}