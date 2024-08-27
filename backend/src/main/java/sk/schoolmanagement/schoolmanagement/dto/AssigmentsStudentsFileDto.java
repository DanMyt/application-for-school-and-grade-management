package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.AssigmentsStudentsFiles;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class AssigmentsStudentsFileDto {
    private Long id;
    private String name;
    private Long courseId;
    private String description;
    private Long assigementId;
    private Long studentId;
    private String studentMail;
    private String firstName;
    private String lastName;
    private Long uploadedFileId;

    private Date deadline;

    public AssigmentsStudentsFileDto(AssigmentsStudentsFiles assigmentsStudentsFiles) {
        this.id = assigmentsStudentsFiles.getId();
        this.name = assigmentsStudentsFiles.getAssignmentName();
        this.courseId = assigmentsStudentsFiles.getCourseId();
        this.description = assigmentsStudentsFiles.getAssignmentDescription();
        this.assigementId = assigmentsStudentsFiles.getAssignmentId();
        this.studentMail = assigmentsStudentsFiles.getStudentMail();
        this.studentId = assigmentsStudentsFiles.getStudentId();
        this.uploadedFileId = assigmentsStudentsFiles.getUloadedFileId();
        this.firstName = assigmentsStudentsFiles.getFirstName();
        this.lastName = assigmentsStudentsFiles.getLastName();
        this.deadline = assigmentsStudentsFiles.getDeadline();
    }
}
