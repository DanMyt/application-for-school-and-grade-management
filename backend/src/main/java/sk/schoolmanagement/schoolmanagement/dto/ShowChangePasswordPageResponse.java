package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ShowChangePasswordPageResponse {
    private Boolean show;

    public ShowChangePasswordPageResponse(Boolean show) {
        this.show = show;
    }
}
