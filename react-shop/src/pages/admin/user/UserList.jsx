import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../../services/UserService";
import { PlusCircle, Users, Search } from "lucide-react";

export default function UserList() {
    const [users, setUsers] = useState([]); // Danh sách gốc từ API
    const [filteredUsers, setFilteredUsers] = useState([]); // Danh sách để hiển thị
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm tải dữ liệu gốc
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await UserService.getAllUsers();
            setUsers(res.data);
            setFilteredUsers(res.data); // Ban đầu, danh sách hiển thị là toàn bộ danh sách
        } catch (err) {
            console.error("Lỗi khi tải danh sách user:", err);
            setError("Không thể tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Hàm áp dụng tất cả các bộ lọc hiện tại
    const applyFilters = () => {
        setError(null);
        let tempUsers = [...users]; // Luôn bắt đầu lọc từ danh sách gốc

        // Lọc theo keyword (username, name, email)
        const lowerKeyword = keyword.toLowerCase().trim();
        if (lowerKeyword) {
            tempUsers = tempUsers.filter(
                (u) =>
                    u.username.toLowerCase().includes(lowerKeyword) ||
                    (u.email && u.email.toLowerCase().includes(lowerKeyword)) ||
                    (u.name && u.name.toLowerCase().includes(lowerKeyword))
            );
        }

        // Lọc theo role
        if (roleFilter) {
            tempUsers = tempUsers.filter((u) => u.role === roleFilter);
        }

        setFilteredUsers(tempUsers); // Cập nhật danh sách sẽ được hiển thị

        if (tempUsers.length === 0) {
            setError("Không tìm thấy người dùng phù hợp.");
        }
    };
    
    // Hàm xử lý khi nhấn nút Tìm hoặc Lọc
    const handleFilterAndSearch = () => {
        applyFilters();
    };

    // Hàm xử lý khi nhấn Enter
    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleFilterAndSearch();
        }
    };

    // Hàm reset bộ lọc
    const handleReset = () => {
        setKeyword("");
        setRoleFilter("");
        setFilteredUsers(users); // Reset danh sách hiển thị về danh sách gốc
        setError(null);
    };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 gap-4">
                {/* Phần tiêu đề bên trái */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Users size={32} className="text-blue-600" />
                        Danh Sách Người Dùng
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Quản lý toàn bộ tài khoản người dùng tại đây.
                    </p>
                </div>

                {/* Phần bên phải: Chứa Bộ lọc/Tìm kiếm và Nút Thêm */}
                <div className="flex items-center gap-4">
                    {/* --- Card Tìm kiếm và Lọc (gộp lại) --- */}
                    <div className="bg-white p-3 rounded-xl shadow-md flex items-center gap-3 border border-gray-200">
                        {/* Ô tìm kiếm */}
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="border border-gray-300 rounded-md p-2 pl-9 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-48"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>

                        {/* Dropdown lọc Role */}
                        <select
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-36"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">-- Lọc Role --</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                        </select>
                        
                        {/* Nút Lọc/Tìm */}
                        <button onClick={handleFilterAndSearch} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition duration-200 text-sm whitespace-nowrap">Lọc</button>

                        {/* Nút Reset */}
                        <button
                            onClick={handleReset}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-md transition duration-200 text-sm"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Nút Thêm người dùng */}
                    <button
                        onClick={() => navigate("/admin/add-user")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 whitespace-nowrap"
                    >
                        <PlusCircle size={20} />
                        Thêm người dùng
                    </button>
                </div>
            </div>

            {/* Thông báo Lỗi */}
            {error && (
                <p className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 text-center">
                    {error}
                </p>
            )}

            {/* Bảng danh sách người dùng */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                       <tr>
                           <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600 w-16">STT</th>
                           <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Username</th>
                           <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Họ tên</th>
                           <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Email</th>
                           <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Số điện thoại</th>
                           <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Địa chỉ</th>
                           <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Vai trò</th>
                           {/* Thêm cột Hành động nếu cần */}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center p-6 text-gray-500">Đang tải dữ liệu...</td></tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((u, index) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b text-center">{index + 1}</td>
                                    <td className="p-3 border-b font-medium">{u.username}</td>
                                    <td className="p-3 border-b">{u.name || "-"}</td>
                                    <td className="p-3 border-b">{u.email || "-"}</td>
                                    <td className="p-3 border-b">{u.phoneNumber || "-"}</td>
                                    <td className="p-3 border-b truncate max-w-xs">{u.address || "-"}</td>
                                    <td className="p-3 border-b text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ u.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700" }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center p-6 text-gray-500">Không tìm thấy người dùng nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}