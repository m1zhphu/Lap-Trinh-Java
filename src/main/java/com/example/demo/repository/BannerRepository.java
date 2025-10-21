package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Banner;

// Không cần thêm phương thức nào đặc biệt, JpaRepository đủ dùng
public interface BannerRepository extends JpaRepository<Banner, Long> {
}