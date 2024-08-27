package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.Assigments;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssigmentsRepository extends JpaRepository<Assigments,Long> {
    @Query("select a from Assigments a where a.courses.id = :courseId")
    List<Assigments> findAllByCourseId(@Param("courseId") Long courseId);
    Optional<Assigments> findById(Long assigementId);

    @Query("select a from Assigments a where a.courses.id = :courseId and a.withFileUploading = true ")
    List<Assigments> findAllByCourseIdWhereWithFileUploadingIsTrue(@Param("courseId") Long courseId);

    List<Assigments> findByDeadlineBetween(Date startOfDay, Date endOfDay);
}
