package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;

@Getter
@Setter
@NoArgsConstructor
public class PendingDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String mail;
    private String approvedBy;

    public PendingDto(UserLogin userLogin) {
        this.firstName = userLogin.getFirstName();
        this.lastName = userLogin.getLastName();
        this.approvedBy = userLogin.getApprovedBy();
        this.mail = userLogin.getMail();
        this.id = userLogin.getId();
    }

    @Override
    public String toString() {
        return "PendingDto{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", mail='" + mail + '\'' +
                ", approvedBy='" + approvedBy + '\'' +
                '}';
    }
}
