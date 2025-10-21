// src/pages/admin/banner/EditBanner.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import BannerService from "../../../services/BannerService";
import FileUploadService from "../../../services/FileUploadService";
import { ArrowLeft, RefreshCw } from "lucide-react";

// *** SỬA LẠI ĐƯỜNG DẪN NÀY CHO ĐÚNG ***
// Thêm "/images/" và sửa "banner/" thành "banners/" (số nhiều)
const IMAGE_BASE_URL = "http://localhost:8080/uploads/images/banners/"; 

export default function EditBanner() {
    const { id } = useParams(); // Lấy ID banner từ URL
    const navigate = useNavigate();

    const [banner, setBanner] = useState({ name: "", linkUrl: "", status: true, imageUrl: "" });
    const [selectedFile, setSelectedFile] = useState(null); // File ảnh MỚI người dùng chọn
    const [imagePreview, setImagePreview] = useState(null); // URL xem trước (ảnh mới hoặc cũ)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [loadingData, setLoadingData] = useState(true); // State để biết khi nào dữ liệu cũ đã tải xong

    // Tải dữ liệu banner cần sửa khi component mount
    useEffect(() => {
        const fetchBannerData = async () => {
            setLoadingData(true);
            try {
                const response = await BannerService.getById(id);
                setBanner(response.data); // Điền dữ liệu banner cũ vào state
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu banner:", err);
                setMessage("Không thể tải dữ liệu banner để chỉnh sửa.");
            } finally {
                setLoadingData(false); // Kết thúc tải
            }
        };
        fetchBannerData();
    }, [id]); // Phụ thuộc vào id, chạy lại nếu id thay đổi

    // Hàm xử lý thay đổi giá trị input (text, url, checkbox)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBanner((prevBanner) => ({
            ...prevBanner,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Hàm xử lý khi người dùng chọn file ảnh mới
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file); // Lưu file MỚI vào state
            setImagePreview(URL.createObjectURL(file)); // Tạo URL xem trước cho ảnh MỚI
        } else {
            setSelectedFile(null);
            // Hiển thị lại ảnh cũ nếu có
            setImagePreview(banner.imageUrl ? `${IMAGE_BASE_URL}${banner.imageUrl}` : null);
            if (file) { // Chỉ thông báo nếu người dùng thực sự chọn file không hợp lệ
                alert("Vui lòng chọn một file hình ảnh hợp lệ (jpg, png, gif...).");
            }
        }
    };

    // Hàm xử lý khi submit form cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!banner.name.trim()) {
            alert("Vui lòng nhập tên banner!");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            let finalImageName = banner.imageUrl; // Mặc định giữ lại tên ảnh cũ

            // Nếu người dùng đã chọn một file ảnh MỚI
            if (selectedFile) {
                // *** SỬA LẠI CÁCH GỌI UPLOAD ***
                // Gọi service upload với file MỚI và tên thư mục con "banners"
                const uploadResponse = await FileUploadService.upload(selectedFile, "banners");
                
                // Lấy tên file mới trả về từ server
                finalImageName = uploadResponse.data.fileName;
            }
            
            // Tạo dữ liệu banner cuối cùng để gửi đi cập nhật
            const updatedBannerData = { ...banner, imageUrl: finalImageName };
            
            // Gọi API cập nhật banner
            await BannerService.update(id, updatedBannerData);
            
            setMessage("Cập nhật banner thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/banners"), 2000);

        } catch (err) {
            console.error("Lỗi khi cập nhật banner:", err);
            const errorMsg = err.response?.data?.message || err.message || "Cập nhật banner thất bại! Vui lòng thử lại.";
            setMessage(errorMsg);
            setIsSubmitting(false);
        }
    };

    // Hiển thị trạng thái đang tải
    if (loadingData) {
        return <div className="text-center py-10"><p>Đang tải dữ liệu banner...</p></div>;
    }

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Chỉnh Sửa Banner</h1>
                    <p className="text-gray-500 mt-1">ID: {id}</p>
                </div>
                <button
                    onClick={() => navigate("/admin/banners")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
            </div>

            {/* Thông báo */}
            {message && (
                <div className={`mb-4 p-4 rounded-lg text-center font-medium ${message.includes("thành công") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {message}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Cột trái: Thông tin --- */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên Banner</label>
                            <input
                                type="text" id="name" name="name"
                                value={banner.name || ''} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required
                            />
                        </div>
                        <div>
                            <label htmlFor="linkUrl" className="block text-sm font-semibold text-gray-700 mb-2">Đường dẫn (Link URL)</label>
                            <input
                                type="url" id="linkUrl" name="linkUrl"
                                value={banner.linkUrl || ''} onChange={handleChange}
                                placeholder="https://vidu.com/khuyen-mai"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* --- Cột phải: Ảnh và Trạng thái --- */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh Banner</label>
                            <div className="mt-2 text-center">
                                <img 
                                    src={imagePreview || (banner.imageUrl ? `${IMAGE_BASE_URL}${banner.imageUrl}` : "https://via.placeholder.com/300x150")}
                                    alt="Xem trước" 
                                    className="mx-auto h-40 max-w-full object-contain rounded-md shadow-md mb-4 bg-gray-100"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x150"}}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-200">
                                    <RefreshCw size={18} />
                                    Thay đổi ảnh
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                {selectedFile && <p className="mt-2 text-sm text-gray-500">Đã chọn: {selectedFile.name}</p>}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Trạng thái hiển thị</label>
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${banner.status ? 'text-green-600' : 'text-gray-500'}`}>
                                    {banner.status ? 'Đang hiển thị' : 'Đang ẩn'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="status" className="sr-only peer" checked={banner.status} onChange={handleChange} />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút Submit */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || loadingData}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </>
    );
}