package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class InfoForEmailDto {
    private Long templateId;
    private List<Long> studentsIds;
    private List<Long> assigementsIds;
}
