package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.AssigmentsStudentsFiles;
import sk.schoolmanagement.schoolmanagement.entity.CourseGradingView;

import java.util.Date;
import java.util.HashMap;

@Getter
@Setter
@NoArgsConstructor
public class CourseSubmittedViewDto {
    private Long id;
    private Long courseId;
    private Long studentId;
    private String firstName;
    private String lastName;
    private Date dateOfUpload;


    private HashMap<String, String> assignmentSubmittedOrNot = new HashMap<>();
    //private HashMap<String, HashMap<String, Date>> assignmentSubmittedOrNot = new HashMap<>();

    public CourseSubmittedViewDto(AssigmentsStudentsFiles assigmentsStudentsFiles) {
        this.id = assigmentsStudentsFiles.getId();
        this.courseId = assigmentsStudentsFiles.getCourseId();
        this.studentId = assigmentsStudentsFiles.getStudentId();
        this.firstName = assigmentsStudentsFiles.getFirstName();
        this.lastName = assigmentsStudentsFiles.getLastName();
    }
}
