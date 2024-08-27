package sk.schoolmanagement.schoolmanagement.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.CoursesGridDto;
import sk.schoolmanagement.schoolmanagement.dto.EmailTemplatesDto;
import sk.schoolmanagement.schoolmanagement.dto.InfoForEmailDto;
import sk.schoolmanagement.schoolmanagement.dto.MailDto;
import sk.schoolmanagement.schoolmanagement.entity.EmailTemplates;
import sk.schoolmanagement.schoolmanagement.service.EmailService;
import sk.schoolmanagement.schoolmanagement.service.EmailTemplateService;
import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
@RequestMapping("/api/templates")
public class EmailTemplatesController {

    private final EmailTemplateService emailTemplateService;
    private final EmailService emailService;

    @RequestMapping("/allTemplates")
    public ResponseEntity<List<EmailTemplatesDto>> getAllUsersTemplates() {
        return ResponseEntity.ok(this.emailTemplateService.findAllTeachersTemplates().stream().map(EmailTemplatesDto::new).toList());
    }

    @PostMapping("/createTemplate")
    public ResponseEntity<EmailTemplatesDto> addTemplate(@RequestBody EmailTemplatesDto emailTemplatesDto) {
        EmailTemplates emailTemplates = emailTemplateService.addTemplate(emailTemplatesDto);
        return ResponseEntity.ok(new EmailTemplatesDto(emailTemplates));

    }



    @PostMapping("/updateTemplate")
    public ResponseEntity<EmailTemplatesDto> updateTemplate(@RequestBody EmailTemplatesDto emailTemplatesDto) {
        var result = this.emailTemplateService.updateTemplateById(emailTemplatesDto);
        return ResponseEntity.ok(new EmailTemplatesDto(result));
    }


    @RequestMapping("/removeCourse/{id}")
    public ResponseEntity<?> removeCourseById(@PathVariable("id") Long emailTemplateId) {
        this.emailTemplateService.deleteById(emailTemplateId);
        return ResponseEntity.ok().build();
    }

    @RequestMapping("/template/content/{id}")
    public ResponseEntity<EmailTemplatesDto> getCourseById(@PathVariable("id") Long emailTemplateId) {
        return ResponseEntity.ok(new EmailTemplatesDto(emailTemplateService.findEmailTemplateById(emailTemplateId)));
    }

    @PostMapping("/sendInfoForEmail")
    public ResponseEntity<?> sendEmail(@RequestBody InfoForEmailDto infoForEmailDto) {
        this.emailTemplateService.sendEmail(infoForEmailDto);
        return ResponseEntity.ok().build();

    }

    @PostMapping("/sendEmailToStudent")
    public String sendEmail(@RequestBody MailDto mailDto) {
        emailService.sendMailTo(mailDto);
        return "Email sent successfully";
    }
}
