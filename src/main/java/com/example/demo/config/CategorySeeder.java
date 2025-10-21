package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order; // Import Order
import org.springframework.stereotype.Component;

import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;

@Component
@Order(1) // 1. ĐÁNH DẤU ƯU TIÊN: Chạy file này đầu tiên
public class CategorySeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public CategorySeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            Category ao = Category.builder().name("Áo").description("Các loại áo thời trang nam và nữ").build();
            Category quan = Category.builder().name("Quần").description("Các loại quần jeans, kaki, quần tây").build();
            Category vayDam = Category.builder().name("Váy Đầm").description("Váy dạo phố và đầm dự tiệc").build();
            Category giayDep = Category.builder().name("Giày Dép").description("Giày thể thao, giày cao gót, sandal").build();
            Category phuKien = Category.builder().name("Phụ Kiện").description("Túi xách, kính mát, thắt lưng").build();

            categoryRepository.save(ao);
            categoryRepository.save(quan);
            categoryRepository.save(vayDam);
            categoryRepository.save(giayDep);
            categoryRepository.save(phuKien);
            
            System.out.println(">>>> Seed dữ liệu cho Categories thành công!");
        }
    }
}