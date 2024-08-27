package sk.schoolmanagement.schoolmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.dto.StudentDto;

import java.lang.reflect.Type;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses", schema = "public")
@Getter
@Setter
public class Courses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "course_name")
    private String courseName;

    @Column(name = "subject")
    private String subject;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "student_to_course",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> students = new HashSet<>();


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "teacher_to_course",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    private Set<Teacher> teachers = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "courses", orphanRemoval = true)
    private Set<Assigments> assigments = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "post_to_course",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private Set<Post> posts = new HashSet<>();
    public Courses(String courseName, String subject) {
        this.courseName = courseName;
        this.subject = subject;
    }


    public Courses() {

    }

    @Override
    public String toString() {
        return "Courses{" +
                "id=" + id +
                ", courseName='" + courseName + '\'' +
                ", subject='" + subject + '\'' +
                '}';
    }
}
