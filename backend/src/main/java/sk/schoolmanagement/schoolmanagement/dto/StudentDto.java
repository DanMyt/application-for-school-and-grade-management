package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.Student;

@Getter
@Setter
@NoArgsConstructor
public class StudentDto {
    private Long id;
    private String mail;
    private String firstName;
    private String lastName;

    public StudentDto(Student student) {
        this.id = student.getId();
        this.mail = student.getMail();
        this.firstName = student.getFirstName();
        this.lastName = student.getLastName();
    }
}
