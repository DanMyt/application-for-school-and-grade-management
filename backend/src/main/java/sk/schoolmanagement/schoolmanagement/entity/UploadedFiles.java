package sk.schoolmanagement.schoolmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Entity
@Table(name = "uploaded_files", schema = "public")
@Getter
@Setter
public class UploadedFiles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "uploaded_file")
    private byte[] uploadedFile;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "date_of_upload")
    private Date dateOfUpload;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigement_id")
    private Assigments assigement;

}
