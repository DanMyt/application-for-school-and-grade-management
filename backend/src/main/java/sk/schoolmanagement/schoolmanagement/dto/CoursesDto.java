package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.Courses;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
public class CoursesDto {
    private Long id;
    private String courseName;
    private String subject;
    private List<StudentDto> students;
    private List<TeacherDto> teachers;


    public CoursesDto(Courses courses) {
        this.id = courses.getId();
        this.courseName = courses.getCourseName();
        this.subject = courses.getSubject();
        this.students = courses.getStudents().stream().map(StudentDto::new).toList();
        this.teachers = courses.getTeachers().stream().map(TeacherDto::new).toList();
    }
}
