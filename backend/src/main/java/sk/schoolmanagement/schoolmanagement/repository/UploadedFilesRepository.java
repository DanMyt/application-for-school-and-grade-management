package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.UploadedFiles;

import java.util.Optional;

@Repository
public interface UploadedFilesRepository extends JpaRepository<UploadedFiles, Long> {
    Optional<UploadedFiles> findByAssigementIdAndStudentId(Long assigementId, Long studentId);
}
