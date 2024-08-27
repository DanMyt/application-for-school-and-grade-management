package sk.schoolmanagement.schoolmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.Calendar;
import java.util.Date;

@Entity
@Getter
@Table(name = "password_reset_token")
public class PasswordResetToken {

    private static final  int EXPIRATION = 60 * 24;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;


    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_login_id")
    private UserLogin user;

    private Date expiryDate;

    public PasswordResetToken(String token, UserLogin user) {
        this.token = token;
        this.user = user;
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, EXPIRATION);
        this.expiryDate = calendar.getTime();
    }

    public PasswordResetToken() {

    }
}
