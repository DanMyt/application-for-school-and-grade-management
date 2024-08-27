package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.CourseGradingView;

import java.util.HashMap;

@Getter @Setter
@NoArgsConstructor
public class CourseGradingViewDto {

    private Long id;
    private Long courseId;
    private Long studentId;
    private String firstName;
    private String lastName;


    private HashMap<String, Long> assignmentGrade = new HashMap<>();

    public CourseGradingViewDto(CourseGradingView courseGradingView) {
        this.id = courseGradingView.getId();
        this.courseId = courseGradingView.getCourseId();
        this.studentId = courseGradingView.getStudentId();
        this.firstName = courseGradingView.getFirstName();
        this.lastName = courseGradingView.getLastName();
    }
}
