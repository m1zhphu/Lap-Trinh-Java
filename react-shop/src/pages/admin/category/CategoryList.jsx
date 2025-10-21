import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../../services/CategoryService"; // Import service Category
import { PlusCircle, Tags, Search, Edit, Trash2 } from "lucide-react"; // Icons

export default function CategoryList() {
    const [categories, setCategories] = useState([]); // Danh sách gốc
    const [filteredCategories, setFilteredCategories] = useState([]); // Danh sách hiển thị
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(""); // Thông báo xóa
    const [searchTerm, setSearchTerm] = useState(""); // State cho tìm kiếm
    const navigate = useNavigate();

    // Hàm tải dữ liệu
    const fetchData = async () => {
        setLoading(true);
        setError(null); // Xóa lỗi cũ khi tải lại
        setMessage(""); // Xóa thông báo cũ
        try {
            const res = await CategoryService.getAll();
            setCategories(res.data);
            setFilteredCategories(res.data); // Ban đầu hiển thị tất cả
        } catch (err) {
            setError("Không thể tải dữ liệu danh mục!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Hàm tìm kiếm (theo tên danh mục)
    const handleSearch = () => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        if (!lowerCaseSearchTerm) {
            setFilteredCategories(categories); // Hiển thị tất cả nếu rỗng
            setError(null); // Xóa lỗi nếu tìm kiếm rỗng
            return;
        }
        const results = categories.filter(category =>
            category.name && category.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredCategories(results);
        if (results.length === 0) {
             setError("Không tìm thấy danh mục phù hợp."); // Thông báo nếu không có kết quả
        } else {
             setError(null); // Xóa lỗi nếu có kết quả
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Hàm reset tìm kiếm
    const handleReset = () => {
        setSearchTerm("");
        setFilteredCategories(categories);
        setError(null);
    };

    // Hàm xóa danh mục
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này? Việc này có thể ảnh hưởng đến các sản phẩm liên quan.")) return;
        try {
            await CategoryService.remove(id);
            setMessage("Xóa danh mục thành công!"); // Đặt thông báo thành công
            // Tải lại danh sách sau khi xóa thành công
            fetchData();
        } catch (err) {
            setMessage(""); // Xóa thông báo thành công (nếu có)
            setError("Lỗi khi xóa danh mục! Có thể danh mục này vẫn còn sản phẩm."); // Đặt thông báo lỗi
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <> {/* Sử dụng Fragment */}
            {/* Header */}
            {/* Bọc toàn bộ header trong flex */}
            <div className="flex justify-between items-center mb-6 gap-4"> {/* Thêm gap */}
                {/* Phần tiêu đề bên trái (giữ nguyên) */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Tags size={32} className="text-blue-600" />
                        Danh Sách Danh Mục
                    </h1>
                    <p className="text-gray-500 mt-1">Xem, thêm, sửa, xóa các danh mục sản phẩm.</p>
                </div>

                {/* Phần bên phải: Chứa cả Tìm kiếm và Nút Thêm */}
                <div className="flex items-center gap-4"> {/* Bọc tìm kiếm và nút thêm */}

                    {/* --- Card Tìm kiếm (thu nhỏ và đặt ở đây) --- */}
                    <div className="bg-white p-3 rounded-xl shadow-md"> {/* Giảm padding */}
                        <div className="flex items-center gap-2"> {/* Cho các phần tử nằm ngang */}
                            <div className="relative flex-grow">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm danh mục..." // Ngắn gọn hơn
                                    className="border border-gray-300 rounded-lg p-2 pl-9 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-60" // Giảm padding, đặt chiều rộng cố định (w-60)
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                            {/* Nút Tìm và Reset thu nhỏ */}
                            <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition duration-200 text-sm">Tìm</button>
                            <button onClick={handleReset} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-lg transition duration-200 text-sm">Reset</button>
                        </div>
                    </div>
                    {/* --- Kết thúc Card Tìm kiếm --- */}

                    {/* Nút Thêm Danh Mục */}
                    <button
                        onClick={() => navigate("/admin/add-category")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 whitespace-nowrap" // Thêm whitespace-nowrap
                    >
                        <PlusCircle size={20} />
                        Thêm danh mục
                    </button>
                </div>
                {/* === KẾT THÚC SỬA ĐỔI HEADER === */}
            </div>

            {/* Thông báo Lỗi hoặc Thành công (Giữ nguyên) */}
            {(error || message) && (
                <div className={`mb-4 p-4 rounded-lg text-center font-medium ${error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {error || message}
                </div>
            )}

            {/* Bảng Danh mục */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600 w-16">ID</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Tên danh mục</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Mô tả</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600 w-40">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center p-6 text-gray-500">Đang tải dữ liệu...</td></tr>
                        ) : filteredCategories.length > 0 ? (
                            // Render danh sách đã lọc
                            filteredCategories.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 border-b text-center text-gray-600">{c.id}</td>
                                    <td className="p-3 border-b font-medium text-gray-800">{c.name}</td>
                                    {/* Sử dụng truncate để giới hạn độ dài mô tả */}
                                    <td className="p-3 border-b text-gray-600 truncate max-w-sm">{c.description || 'Chưa có mô tả'}</td>
                                    <td className="p-3 border-b">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Nút Sửa */}
                                            <button
                                                onClick={() => navigate(`/admin/edit-category/${c.id}`)}
                                                className="flex items-center gap-1 text-blue-500 hover:text-blue-700 font-semibold py-1 px-2 rounded transition duration-200 text-sm"
                                            >
                                                <Edit size={14} /> Sửa
                                            </button>
                                            {/* Nút Xóa */}
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold py-1 px-2 rounded transition duration-200 text-sm"
                                            >
                                                <Trash2 size={14} /> Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Hiển thị khi không có kết quả tìm kiếm hoặc không có danh mục
                            <tr><td colSpan="4" className="text-center p-6 text-gray-500">{searchTerm ? 'Không tìm thấy danh mục phù hợp.' : 'Chưa có danh mục nào.'}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}