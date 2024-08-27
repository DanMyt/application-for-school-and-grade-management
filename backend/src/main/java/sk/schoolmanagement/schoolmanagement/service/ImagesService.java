package sk.schoolmanagement.schoolmanagement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sk.schoolmanagement.schoolmanagement.entity.Images;
import sk.schoolmanagement.schoolmanagement.repository.ImagesRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ImagesService {
    private final ImagesRepository imagesRepository;
    public Set<Images> findAllImages() {
        List<Images> imagesList = imagesRepository.findAll();
        return new HashSet<>(imagesList);
    }

    public Images addImage(Images imagesDto) {
        return imagesRepository.save(imagesDto);
    }

    public Images findImageByPostId(Long id) {
        return imagesRepository.findImageByPostId(id);
    }

    public void deleteByPostId(Long postId) {
        imagesRepository.deleteByPostId(postId);
    }
}
