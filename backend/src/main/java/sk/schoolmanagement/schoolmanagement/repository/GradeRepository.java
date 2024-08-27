package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.Assigments;
import sk.schoolmanagement.schoolmanagement.entity.Grade;

import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    Grade findByAssigmentsAndStudentId(Optional<Assigments> assigments, Long studentId);


    void deleteByStudentId(Long studentId);
}
