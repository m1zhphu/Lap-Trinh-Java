package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BannerDto;
import com.example.demo.service.BannerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/banners") // Đường dẫn cơ sở cho Banner API
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    // GET /api/banners - Lấy tất cả banner
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ADMIN
    public ResponseEntity<List<BannerDto>> getAllBanners() {
        List<BannerDto> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(banners);
    }

    // GET /api/banners/{id} - Lấy banner theo ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerDto> getBannerById(@PathVariable Long id) {
        BannerDto banner = bannerService.getBannerById(id);
        return ResponseEntity.ok(banner);
    }

    // POST /api/banners - Tạo banner mới
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerDto> createBanner(@RequestBody BannerDto bannerDTO) {
        BannerDto createdBanner = bannerService.createBanner(bannerDTO);
        // Trả về 201 Created cùng với banner đã tạo
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBanner); 
    }

    // PUT /api/banners/{id} - Cập nhật banner
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerDto> updateBanner(@PathVariable Long id, @RequestBody BannerDto bannerDTO) {
        BannerDto updatedBanner = bannerService.updateBanner(id, bannerDTO);
        return ResponseEntity.ok(updatedBanner);
    }

    // DELETE /api/banners/{id} - Xóa banner
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        // Trả về 204 No Content khi xóa thành công
        return ResponseEntity.noContent().build(); 
    }
}