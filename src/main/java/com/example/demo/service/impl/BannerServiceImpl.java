package com.example.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.dto.BannerDto;
import com.example.demo.entity.Banner;
import com.example.demo.repository.BannerRepository;
import com.example.demo.service.BannerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    // Hàm tiện ích để chuyển đổi Entity sang DTO
    private BannerDto convertToDTO(Banner banner) {
        return new BannerDto(
                banner.getId(),
                banner.getName(),
                banner.getImageUrl(),
                banner.getLinkUrl(),
                banner.getStatus()
        );
    }

    // Hàm tiện ích để chuyển đổi DTO sang Entity (khi tạo/cập nhật)
    private Banner convertToEntity(BannerDto bannerDTO) {
        Banner banner = new Banner();
        banner.setId(bannerDTO.getId()); // Cần ID khi cập nhật
        banner.setName(bannerDTO.getName());
        banner.setImageUrl(bannerDTO.getImageUrl());
        banner.setLinkUrl(bannerDTO.getLinkUrl());
        banner.setStatus(bannerDTO.getStatus() != null ? bannerDTO.getStatus() : true); // Mặc định là true nếu DTO không có status
        return banner;
    }


    @Override
    public List<BannerDto> getAllBanners() {
        return bannerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BannerDto getBannerById(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy banner với ID: " + id));
        return convertToDTO(banner);
    }

    @Override
    public BannerDto createBanner(BannerDto bannerDTO) {
        // Đảm bảo không đặt ID khi tạo mới
        bannerDTO.setId(null); 
        Banner banner = convertToEntity(bannerDTO);
        Banner savedBanner = bannerRepository.save(banner);
        return convertToDTO(savedBanner);
    }

    @Override
    public BannerDto updateBanner(Long id, BannerDto bannerDTO) {
        // Kiểm tra xem banner có tồn tại không
        Banner existingBanner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy banner với ID: " + id));

        // Cập nhật các trường từ DTO
        existingBanner.setName(bannerDTO.getName());
        existingBanner.setImageUrl(bannerDTO.getImageUrl());
        existingBanner.setLinkUrl(bannerDTO.getLinkUrl());
        existingBanner.setStatus(bannerDTO.getStatus() != null ? bannerDTO.getStatus() : existingBanner.getStatus()); // Chỉ cập nhật nếu DTO có status

        Banner updatedBanner = bannerRepository.save(existingBanner);
        return convertToDTO(updatedBanner);
    }

    @Override
    public void deleteBanner(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy banner với ID: " + id);
        }
        bannerRepository.deleteById(id);
    }
}