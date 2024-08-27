package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.CourseGradingView;

import java.util.List;

@Repository
public interface CourseGradingViewRepository extends JpaRepository<CourseGradingView, Long> {

    List<CourseGradingView> findAllByCourseId(Long courseId);

    List<CourseGradingView> findAllByCourseIdAndStudentId(Long courseId, Long id);
}
