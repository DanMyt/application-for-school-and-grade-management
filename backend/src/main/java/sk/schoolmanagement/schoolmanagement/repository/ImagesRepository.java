package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.Images;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
    Images findImageById(Long id);

    Images findImageByPostId(Long postId);

    void deleteByPostId(Long postId);
}
