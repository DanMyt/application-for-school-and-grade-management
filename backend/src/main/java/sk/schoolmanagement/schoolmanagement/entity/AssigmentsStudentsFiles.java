package sk.schoolmanagement.schoolmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "assigments_students_files", schema = "public")
@Getter
public class AssigmentsStudentsFiles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "assignment_id")
    private Long assignmentId;

    @Column(name = "assignment_name")
    private String assignmentName;

    @Column(name = "assignment_description")
    private String assignmentDescription;

    @Column(name = "deadline")
    private Date deadline;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "student_mail")
    private String studentMail;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "uploaded_file_id")
    private Long uloadedFileId;

    @Column(name = "date_of_upload")
    private Date dateOfUpload;


}
