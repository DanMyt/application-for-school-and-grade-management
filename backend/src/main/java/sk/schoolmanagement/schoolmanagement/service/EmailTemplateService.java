package sk.schoolmanagement.schoolmanagement.service;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.schoolmanagement.schoolmanagement.dto.EmailTemplatesDto;
import sk.schoolmanagement.schoolmanagement.dto.InfoForEmailDto;
import sk.schoolmanagement.schoolmanagement.entity.*;
import sk.schoolmanagement.schoolmanagement.repository.*;

import java.io.StringReader;
import java.io.StringWriter;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;
    private final AssigmentsRepository assigmentsRepository;
    private final TeacherRepository teacherRepository;
    private final EmailService emailService;


    @Transactional(readOnly = true)
    public List<EmailTemplates> findAll() {
        return this.emailTemplateRepository.findAll();
    }

    public EmailTemplates addTemplate(EmailTemplatesDto emailTemplatesDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        Optional<Teacher> teacher = teacherRepository.findFirstByEmail(principal.getMail());
        Teacher teacher1 = teacher.get();
        EmailTemplates emailTemplates = new EmailTemplates(emailTemplatesDto.getTemplate());
        emailTemplates.setTeacher(teacher1);
        return this.emailTemplateRepository.save(emailTemplates);
    }

    public void deleteById(Long emailTemplateId) {
        this.emailTemplateRepository.deleteById(emailTemplateId);
    }

    public EmailTemplates findEmailTemplateById(Long emailTemplateId) {
        return this.emailTemplateRepository.findEmailTemplateById(emailTemplateId);
    }

    public EmailTemplates updateTemplateById(EmailTemplatesDto emailTemplatesDto) {
        EmailTemplates emailTemplates = this.emailTemplateRepository.findEmailTemplateById(emailTemplatesDto.getId());
        emailTemplates.setTemplate(emailTemplatesDto.getTemplate());
        return this.emailTemplateRepository.save(emailTemplates);
    }

    public Set<EmailTemplates> findAllTeachersTemplates() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        Optional<Teacher> teacher = teacherRepository.findFirstByEmail(principal.getMail());
        return emailTemplateRepository.findByTeacherId(teacher.get().getId());
    }

    public void sendEmail(InfoForEmailDto infoForEmailDto) {
        Long templateId = infoForEmailDto.getTemplateId();
        List<Long> studentsIds = infoForEmailDto.getStudentsIds();
        List<Long> assigementsIds = infoForEmailDto.getAssigementsIds();

        EmailTemplates emailTemplates = emailTemplateRepository.findEmailTemplateById(templateId);

        for (var studentId : studentsIds) {
            Optional<Student> student = studentRepository.findById(studentId);
            LocalDate localDate = LocalDate.now();
            for (var assigementId : assigementsIds) {
                Optional<Assigments> assigments = assigmentsRepository.findById(assigementId);
                Grade grade = gradeRepository.findByAssigmentsAndStudentId(assigments,studentId);
                Map<String,Object> params = new HashMap<>();
                params.put("student.firstName",student.get().getFirstName());
                params.put("student.secondName", student.get().getLastName());
                if (grade != null) params.put("grade.grade", grade.getGrade());
                params.put("date", localDate);
                params.put("assignment.name", assigments.get().getName());

                MustacheFactory mf = new DefaultMustacheFactory();
                Mustache mustache = mf.compile(new StringReader(emailTemplates.getTemplate()), "example");
                StringWriter stringWriter = new StringWriter();
                mustache.execute(stringWriter,params);
                System.out.println(stringWriter.toString());
                emailService.sendSimpleEmail("dadamitnikova@gmail.com","skola",stringWriter.toString());
            }
        }
    }
}
