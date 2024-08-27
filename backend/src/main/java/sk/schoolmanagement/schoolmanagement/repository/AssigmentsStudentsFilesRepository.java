package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.AssigmentsStudentsFiles;

import java.util.List;

@Repository
public interface AssigmentsStudentsFilesRepository extends JpaRepository<AssigmentsStudentsFiles,Long> {
    List<AssigmentsStudentsFiles> findAllByCourseIdAndStudentMail(Long courseId, String studentMail);

    List<AssigmentsStudentsFiles> findAllByCourseId(Long courseId);
}
