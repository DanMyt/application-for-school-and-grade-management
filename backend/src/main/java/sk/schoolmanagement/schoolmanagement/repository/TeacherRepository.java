package sk.schoolmanagement.schoolmanagement.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.Teacher;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Teacher findByEmail(String email);
    Optional<Teacher> findByName(String name);

    Optional<Teacher> findFirstByEmail(String mail);
}
