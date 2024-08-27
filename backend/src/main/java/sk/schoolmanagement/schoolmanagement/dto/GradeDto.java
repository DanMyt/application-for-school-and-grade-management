package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.Grade;

@Getter
@Setter
@NoArgsConstructor
public class GradeDto {
    private Long assigmentId;
    private Long studentId;
    private Long grade;
}
