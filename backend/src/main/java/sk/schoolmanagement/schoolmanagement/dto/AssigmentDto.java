package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;
import sk.schoolmanagement.schoolmanagement.entity.Assigments;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class AssigmentDto {

    private Long maxPoints;
    private String name;
    private Long courseId;
    private String description;
    private Long id;
    private Boolean withFileUploading;
    private Date deadline;


    public AssigmentDto (Assigments assigments) {
        this.maxPoints = assigments.getMaxPoints();
        this.name = assigments.getName();
        this.courseId = assigments.getCourses().getId();
        this.id = assigments.getId();
        this.description = assigments.getDescription();
        this.withFileUploading = assigments.getWithFileUploading();
        this.deadline = assigments.getDeadline();

    }
}


