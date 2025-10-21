package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.FileStorageService;

@RestController
@RequestMapping("/api/files")
// @CrossOrigin(origins = "*") // Có thể bỏ nếu đã cấu hình CORS toàn cục
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    // 1. Thêm @RequestParam("dir") để nhận thư mục con từ request
    // defaultValue đặt thư mục mặc định nếu frontend không gửi
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam(value = "dir", defaultValue = "misc") String subDirectory) { 
        try {
            // 2. Truyền cả file và subDirectory vào service
            String generatedFileName = fileStorageService.store(file, subDirectory); 

            Map<String, String> response = Map.of("fileName", generatedFileName);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Lỗi khi upload file: " + e.getMessage());
        }
    }
}