package sk.schoolmanagement.schoolmanagement.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.ImagesDtoRequest;
import sk.schoolmanagement.schoolmanagement.dto.ImagesDtoResponse;
import sk.schoolmanagement.schoolmanagement.entity.Images;
import sk.schoolmanagement.schoolmanagement.service.ImagesService;


import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
public class ImagesController {
    private final ImagesService imagesService;

    @GetMapping
    public ResponseEntity<List<ImagesDtoResponse>> getAllImages() {
        return ResponseEntity.ok(this.imagesService.findAllImages().stream().map(ImagesDtoResponse::new).toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<String> addImage(@RequestBody ImagesDtoRequest imagesDto) {
        byte[] data = Base64.getDecoder().decode(imagesDto.getImage());
        Images image = new Images();
        image.setImage(data);
        image.setPostId(imagesDto.getPostId());
        imagesService.addImage(image);
        return ResponseEntity.ok("Image uploaded successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagesDtoResponse> getImageById(@PathVariable Long id) {
        return ResponseEntity.ok(new ImagesDtoResponse(this.imagesService.findImageByPostId(id))) ;

    }
}
