package com.example.demo.service; // Hoặc package của bạn

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID; // Thêm import UUID

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageService {

    @Value("${upload.path.base}") // Sử dụng đường dẫn cơ sở
    private String baseUploadPath; // Ví dụ: ./uploads

    @PostConstruct
    public void init() {
        try {
            // Chỉ cần tạo thư mục cơ sở ở đây nếu muốn
            Files.createDirectories(Paths.get(baseUploadPath));
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục upload cơ sở!", e);
        }
    }

    // Hàm store nhận thêm subDirectory
    public String store(MultipartFile file, String subDirectory) { // subDirectory ví dụ: "products", "banners"
        if (file.isEmpty()) {
            throw new RuntimeException("File rỗng, không thể lưu trữ.");
        }

        try {
            // === SỬA ĐỔI CHÍNH Ở ĐÂY ===
            // 1. Tạo đường dẫn đến thư mục "images" bên trong baseUploadPath
            Path imageDirPath = Paths.get(this.baseUploadPath).resolve("images");

            // 2. Tạo đường dẫn đến thư mục con (products, banners) bên trong "images"
            Path subDirPath = imageDirPath.resolve(subDirectory); // Ví dụ: ./uploads/images/products

            // 3. Tự động tạo thư mục con nếu chưa có
            if (!Files.exists(subDirPath)) {
                Files.createDirectories(subDirPath);
            }
            // === KẾT THÚC SỬA ĐỔI ===


            // 4. Tạo tên file mới duy nhất (logic giữ nguyên)
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
             // Kiểm tra tên file hợp lệ (giữ nguyên)
             if (originalFileName.contains("..")) {
                 throw new RuntimeException("Tên file không hợp lệ: " + originalFileName);
             }
            String extension = StringUtils.getFilenameExtension(originalFileName);
            String uniqueFileName = UUID.randomUUID().toString() + "." + extension;

            // 5. Tạo đường dẫn đích hoàn chỉnh (sử dụng subDirPath đã tạo)
            Path destinationFile = subDirPath.resolve(uniqueFileName)
                                            .normalize()
                                            .toAbsolutePath();

            // 6. Copy file (logic giữ nguyên)
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // 7. Trả về tên file đã lưu
            return uniqueFileName;

        } catch (IOException e) {
            throw new RuntimeException("Lưu file thất bại!", e);
        }
    }

    // Hàm lấy extension (nếu chưa có)
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex + 1).toLowerCase();
        }
        return "";
    }
}