import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../../services/CategoryService";
import { ArrowLeft } from "lucide-react"; // Import icon

export default function AddCategory() {
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await CategoryService.create(category);
      setMessage("Thêm danh mục thành công! Sẽ tự động quay lại sau 2 giây.");
      setTimeout(() => navigate("/admin/categories"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Thêm danh mục thất bại! Vui lòng thử lại.");
      setIsSubmitting(false); // Cho phép người dùng thử lại nếu có lỗi
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tạo danh mục mới</h1>
          <p className="text-gray-500 mt-1">Điền thông tin cho danh mục sản phẩm của bạn.</p>
        </div>
        <button 
            onClick={() => navigate("/admin/categories")} // Sửa lại đường dẫn
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

      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên danh mục</label>
            <input
              id="name"
              type="text"
              name="name"
              value={category.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Ví dụ: Áo Thun, Quần Jeans..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={category.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={4}
              placeholder="Mô tả ngắn về các sản phẩm trong danh mục này..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Đang lưu...' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}