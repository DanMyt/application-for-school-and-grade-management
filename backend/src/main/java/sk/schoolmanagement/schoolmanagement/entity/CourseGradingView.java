package sk.schoolmanagement.schoolmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(schema = "public", name = "course_grading_view")
@Getter @Setter
public class CourseGradingView {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    // Student
    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    // Grade
    @Column(name = "grade_id")
    private Long gradeId;

    @Column(name = "grade")
    private Long grade;

    // Assignment
    @Column(name = "assignment_id")
    private Long assignmentId;

    @Column(name = "max_points")
    private Integer maxPoints;

    @Column(name = "name")
    private String assignmentName;
}
