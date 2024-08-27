package sk.schoolmanagement.schoolmanagement.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.*;
import sk.schoolmanagement.schoolmanagement.entity.PasswordResetToken;
import sk.schoolmanagement.schoolmanagement.service.AuthenticationService;
import sk.schoolmanagement.schoolmanagement.service.CourseService;
import sk.schoolmanagement.schoolmanagement.service.UserLoginService;

import java.net.URI;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.Locale;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final CourseService courseService;

    private final AuthenticationService authenticationService;

    @PostMapping("/authentication")
    public ResponseEntity<AuthenticationResponse> authentication(@RequestBody AuthenticationRequest request) throws NoSuchAlgorithmException, InvalidKeySpecException {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }



    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registration(@RequestBody RegisterRequest request) throws NoSuchAlgorithmException, InvalidKeySpecException {
        return  ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok().build();

    }

    @PostMapping("/changePassword")
    public ResponseEntity<PasswordResetResponse> changePassword(@RequestBody ChangePasswordDto request) {
        return ResponseEntity.ok(authenticationService.changePasswordReset(request));

    }

    @RequestMapping("/courses")
    public ResponseEntity<List<CoursesGridDto>> getAllCourses() {
        return ResponseEntity.ok(this.courseService.findAll().stream().map(CoursesGridDto::new).toList());
    }

    @RequestMapping("/user/changePassword/{token}")
    public ShowChangePasswordPageResponse showChangePasswordPage(@PathVariable("token") String token) {
        String result = authenticationService.validatePasswordResetToken(token);
        if(result != null) {
           return new ShowChangePasswordPageResponse(false);
        } else {
            return new ShowChangePasswordPageResponse(true);
        }
    }




}
