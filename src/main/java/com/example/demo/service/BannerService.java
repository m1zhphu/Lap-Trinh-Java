package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.BannerDto;

public interface BannerService {
    List<BannerDto> getAllBanners();
    BannerDto getBannerById(Long id);
    BannerDto createBanner(BannerDto bannerDTO);
    BannerDto updateBanner(Long id, BannerDto bannerDTO);
    void deleteBanner(Long id);
}