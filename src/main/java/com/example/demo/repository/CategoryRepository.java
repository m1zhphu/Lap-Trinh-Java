package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Category; // 1. Thêm import này

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // 2. THÊM PHƯƠNG THỨC NÀY VÀO
    /**
     * Spring Data JPA sẽ tự động tạo câu lệnh "SELECT * FROM categories WHERE name = ?"
     * từ tên của phương thức này.
     */
    Optional<Category> findByName(String name);

}