package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.PasswordResetToken;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);


    PasswordResetToken findTokenByUser(UserLogin userLogin);
}
