package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.EmailTemplates;

@Getter
@Setter
@NoArgsConstructor
public class EmailTemplatesDto {
    private Long id;
    private String template;

    public EmailTemplatesDto(EmailTemplates emailTemplates){
        this.id = emailTemplates.getId();
        this.template = emailTemplates.getTemplate();
    }
}
