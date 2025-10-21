package com.example.demo.service;

import java.util.List; // Import DTO

import com.example.demo.dto.CategoryDto;
import com.example.demo.entity.Category;

public interface CategoryService {
    
    // THAY ĐỔI KIỂU TRẢ VỀ Ở ĐÂY
    List<CategoryDto> getAllCategories(); 

    // Các phương thức khác có thể giữ nguyên để quản lý category sau này
    Category getCategoryById(Integer id);
    Category addCategory(Category category);
    Category updateCategory(Integer id, Category category);
    void deleteCategory(Integer id);
}