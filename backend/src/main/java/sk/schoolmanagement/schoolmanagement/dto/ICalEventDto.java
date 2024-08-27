package sk.schoolmanagement.schoolmanagement.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.ICalEvent;

@Getter
@Setter
@NoArgsConstructor
public class ICalEventDto {
    private Long id;
    private String content;

    public ICalEventDto (ICalEvent iCalEvent) {
        this.id = iCalEvent.getId();
        this.content = iCalEvent.getContent();
    }
}
