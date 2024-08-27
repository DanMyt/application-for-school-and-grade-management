package sk.schoolmanagement.schoolmanagement.service;


import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;
import sk.schoolmanagement.schoolmanagement.entity.Teacher;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.repository.UserLoginRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserLoginService {

    private final UserLoginRepository userLoginRepository;

    public UserLogin findUserLogin(String mail, String password) {
      return  userLoginRepository.findByMailAndPassword(mail,password);
    }

    public UserLogin findUserByMail(String mail) {
        return  userLoginRepository.findUserByMail(mail);
    }
     public UserLogin save(UserLogin userLogin) {
        return userLoginRepository.save(userLogin);
    }
}
