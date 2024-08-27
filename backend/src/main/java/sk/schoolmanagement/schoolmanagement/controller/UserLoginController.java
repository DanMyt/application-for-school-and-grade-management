package sk.schoolmanagement.schoolmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.service.UserLoginService;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/userLogin")
public class UserLoginController {

    private final UserLoginService userLoginService;
    @PostMapping
    public UserLogin addUser(@RequestBody UserLogin userLogin) {
        return userLoginService.save(userLogin);
    }

    @GetMapping("/{mail}")
    public UserLogin findUserLogin(@PathVariable("mail") String mail, @RequestParam("password") String password) {
        return userLoginService.findUserLogin(mail, password);
    }
}
