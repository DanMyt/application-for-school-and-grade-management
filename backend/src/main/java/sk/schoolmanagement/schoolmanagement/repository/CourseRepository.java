package sk.schoolmanagement.schoolmanagement.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.dto.CoursesDto;
import sk.schoolmanagement.schoolmanagement.entity.Courses;
import sk.schoolmanagement.schoolmanagement.entity.Student;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Courses,Long> {

    Courses findCourseById(Long courseId);
    List<Courses> findByStudentsContaining(Student student);

}
