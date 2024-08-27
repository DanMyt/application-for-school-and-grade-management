package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.schoolmanagement.schoolmanagement.entity.Courses;
import sk.schoolmanagement.schoolmanagement.entity.EmailTemplates;

import java.util.Set;

public interface EmailTemplateRepository extends JpaRepository<EmailTemplates,Long> {

    EmailTemplates findEmailTemplateById(Long emailTemplateId);

    Set<EmailTemplates> findByTeacherId(Long userId);
}
