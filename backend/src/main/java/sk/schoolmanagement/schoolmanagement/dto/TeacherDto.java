package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.Teacher;

@Getter
@Setter
@NoArgsConstructor
public class TeacherDto {
    private Long id;
    private String name;
    private String surname;
    private String email;

    public TeacherDto(Teacher teacher) {
        this.id = teacher.getId();
        this.name = teacher.getName();
        this.surname = teacher.getSurname();
        this.email = teacher.getEmail();
    }
}
