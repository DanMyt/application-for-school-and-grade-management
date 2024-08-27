package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.Courses;

@Getter
@Setter
@NoArgsConstructor
public class CoursesGridDto {
    private Long id;
    private String courseName;
    private String subject;

    public CoursesGridDto(Courses courses) {
        this.id = courses.getId();
        this.courseName = courses.getCourseName();
        this.subject = courses.getSubject();
    }
}
