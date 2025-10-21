package com.example.demo.mapper;

import com.example.demo.dto.CategoryDto;
import com.example.demo.entity.Category;

public class CategoryMapper {

    /**
     * Chuyển đổi từ Category Entity sang CategoryDto.
     * Dùng để gửi dữ liệu rút gọn (chỉ ID và tên) về cho frontend.
     *
     * @param category Đối tượng Category từ database.
     * @return Đối tượng CategoryDto.
     */
    public static CategoryDto toDto(Category category) {
        // Kiểm tra nếu đối tượng đầu vào là null thì trả về null
        if (category == null) {
            return null;
        }

        // Tạo một đối tượng DTO mới
        CategoryDto dto = new CategoryDto();
        
        // Sao chép dữ liệu từ Entity sang DTO
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        // Trả về đối tượng DTO đã hoàn chỉnh
        return dto;
    }
}