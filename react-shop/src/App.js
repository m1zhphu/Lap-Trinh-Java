import React from "react";
// 1. Bỏ BrowserRouter khỏi đây (nó nên ở index.js)
import { Routes, Route } from "react-router-dom"; 

// 2. Import Layout
import AdminLayout from "./layouts/AdminLayout"; 

// 3. Import các trang
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ProductList from "./pages/admin/product/ProductList";
import CategoryList from "./pages/admin/category/CategoryList";
import AddProduct from "./pages/admin/product/AddProduct";
import EditProduct from "./pages/admin/product/EditProduct";
import AddCategory from "./pages/admin/category/AddCategory";
import EditCategory from "./pages/admin/category/EditCategory";
import UserList from "./pages/admin/user/UserList";
import BannerList from "./pages/admin/banner/BannerList";
import AddBanner from "./pages/admin/banner/AddBanner";
import EditBanner from "./pages/admin/banner/EditBanner";
// 4. Import trang Đăng nhập và Đăng ký
import AdminLogin from "./components/AdminLogin"; // (Hoặc nơi bạn lưu file)
import Register from "./components/Register";   // (Hoặc nơi bạn lưu file)

export default function App() {
  return (
    // <BrowserRouter> nên bọc <App /> trong file index.js
    <Routes>
      
      {/* === TUYẾN ĐƯỜNG CÔNG KHAI === */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/register" element={<Register />} />

      {/* === TUYẾN ĐƯỜNG ĐƯỢC BẢO VỆ === */}
      {/* AdminLayout sẽ là "người gác cổng" */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} /> 

        <Route path="products" element={<ProductList />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />

        <Route path="categories" element={<CategoryList />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="edit-category/:id" element={<EditCategory />} />

        <Route path="banners" element={<BannerList />} />
        <Route path="add-banner" element={<AddBanner />} />
        <Route path="edit-banner/:id" element={<EditBanner />} />
        <Route path="users" element={<UserList />} />
      </Route>

      {/* Các route cho người dùng (HomePage, v.v...) */}
      {/* <Route path="/" element={<HomePage />} /> */}
      
    </Routes>
  );
}