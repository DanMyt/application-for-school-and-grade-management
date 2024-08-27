package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


@Repository
public interface UserLoginRepository  extends JpaRepository<UserLogin, Long> {
    @Query("SELECT ul FROM UserLogin ul LEFT JOIN Student st ON ul.mail = st.mail WHERE st.id IS NULL")
    List<UserLogin> findUserLoginsWithoutStudent();
    UserLogin findByMailAndPassword(String mail, String password);
    UserLogin findUserByMail(String mail);

    void deleteByMail(String mail);


}
