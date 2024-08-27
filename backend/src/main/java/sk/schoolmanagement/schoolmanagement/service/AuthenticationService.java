package sk.schoolmanagement.schoolmanagement.service;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sk.schoolmanagement.schoolmanagement.config.JwtService;
import sk.schoolmanagement.schoolmanagement.dto.*;
import sk.schoolmanagement.schoolmanagement.entity.PasswordResetToken;
import sk.schoolmanagement.schoolmanagement.entity.Roles;
import sk.schoolmanagement.schoolmanagement.entity.Teacher;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.repository.PasswordResetTokenRepository;
import sk.schoolmanagement.schoolmanagement.repository.RolesRepository;
import sk.schoolmanagement.schoolmanagement.repository.TeacherRepository;
import sk.schoolmanagement.schoolmanagement.repository.UserLoginRepository;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserLoginRepository userLoginRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RolesRepository rolesRepository;
    private final AuthenticationManager authenticationManager;
    private final TeacherRepository teacherRepository;
    private final EmailService emailService;

    public AuthenticationResponse register(RegisterRequest request) throws NoSuchAlgorithmException, InvalidKeySpecException {
        UserLogin userLogin1 = new UserLogin(passwordEncoder.encode(request.getPassword()), request.getMail(), request.getFirstName(), request.getLastName(), null);
        Teacher teacher = new Teacher(request.getFirstName(), request.getLastName(), request.getMail());
        Roles teacherRole = rolesRepository.findByName("TEACHER").orElseThrow(() -> new RuntimeException("Role not found"));
        userLogin1.setRoles(Collections.singletonList(teacherRole));
        userLoginRepository.save(userLogin1);
        teacherRepository.save(teacher);
        List<String> list = new ArrayList<>();
        list.add(userLogin1.getFirstName());
        list.add(userLogin1.getLastName());
        var jwtToken = jwtService.generateToken(userLogin1);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .roles(userLogin1.getRoles().stream().map(Roles::getName).collect(Collectors.toList()))
                .info(list)
                .build();
    }
    public void registerStudents(RegisterRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();

        UserLogin userLogin = userLoginRepository.findUserByMail(request.getMail());
        Roles studentRole = rolesRepository.findByName("STUDENT").orElseThrow(() -> new RuntimeException("Role not found"));
        if (userLogin != null) {
            userLogin.setPassword(passwordEncoder.encode(request.getPassword()));
            userLogin.setMail(request.getMail());
            userLogin.setFirstName(request.getFirstName());
            userLogin.setLastName(request.getLastName());
        } else {
            userLogin = new UserLogin(passwordEncoder.encode(request.getPassword()), request.getMail(), request.getFirstName(), request.getLastName(), principal.getMail());
            userLogin.setRoles(Collections.singletonList(studentRole));

        }
        userLoginRepository.save(userLogin);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws NoSuchAlgorithmException, InvalidKeySpecException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getMail(),
                        request.getPassword()
                )
        );

        UserLogin userLogin = userLoginRepository.findUserByMail(request.getMail());
        if (userLogin.getApprovedBy() == null) {
            throw new RuntimeException("User not approved for authentication.");
        }

        List<String> list = new ArrayList<>();
        list.add(userLogin.getFirstName());
        list.add(userLogin.getLastName());
        var jwtToken = jwtService.generateToken(userLogin);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .roles(userLogin.getRoles().stream().map(Roles::getName).collect(Collectors.toList()))
                .info(list)
                .build();

    }

    public PasswordChangeResponse changePassword(PasswordChangeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();


        if (passwordEncoder.matches(request.getOldPassword(), principal.getPassword())) {
            if (request.getNewPassword().equals(request.getNewPasswordAgain())) {
                principal.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userLoginRepository.save(principal);
                return PasswordChangeResponse.builder()
                        .changeResponse("Heslo zmenené")
                        .build();
            }
        }

        return PasswordChangeResponse.builder()
                .changeResponse("Heslo nezmenené")
                .build();
    }

    public List<UserLogin> getAllPendings() {
        return userLoginRepository.findUserLoginsWithoutStudent();
    }


    public UserLogin approve(PendingDto pendingDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();

        UserLogin userLogin = userLoginRepository.findUserByMail(pendingDto.getMail());
        userLogin.setApprovedBy(principal.getMail());

        userLoginRepository.save(userLogin);
        return userLogin;
    }

    public void delete(PendingDto pendingDto) {
        UserLogin userLogin = userLoginRepository.findUserByMail(pendingDto.getMail());
        userLoginRepository.delete(userLogin);
        teacherRepository.delete(teacherRepository.findByEmail(pendingDto.getMail()));
    }

    public void notApproved(PendingDto pendingDto) {
        UserLogin userLogin = userLoginRepository.findUserByMail(pendingDto.getMail());
        userLogin.setApprovedBy(null);
        userLoginRepository.save(userLogin);
    }

    public void resetPassword(PasswordResetRequest request) {
        UserLogin userLogin = userLoginRepository.findUserByMail(request.getMail());
        if (userLogin == null) {
            throw new UsernameNotFoundException("user not found");
        }

        String token = UUID.randomUUID().toString();

        createPasswordResetTokenForUser(userLogin, token);
        String url = "http://localhost:3000/pages/newPass/forgotPassword/" + token;
        emailService.sendSimpleEmail(userLogin.getMail(),"zmena hesla",url);

    }

    private void createPasswordResetTokenForUser(UserLogin userLogin, String token) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findTokenByUser(userLogin);
        if (passwordResetToken != null) {
            passwordResetTokenRepository.delete(passwordResetToken);
        }
        PasswordResetToken myToken = new PasswordResetToken(token, userLogin);
        passwordResetTokenRepository.save(myToken);

    }

    public String validatePasswordResetToken(String token) {
        final PasswordResetToken passToken = passwordResetTokenRepository.findByToken(token);

        return !isTokenFound(passToken) ? "invalidToken"
                : isTokenExpired(passToken) ? "expired"
                : null;
    }

    private boolean isTokenFound(PasswordResetToken passToken) {
        return passToken != null;
    }

    private boolean isTokenExpired(PasswordResetToken passToken) {
        final Calendar cal = Calendar.getInstance();
        return passToken.getExpiryDate().before(cal.getTime());
    }

    public PasswordResetResponse changePasswordReset(ChangePasswordDto request) {
        final PasswordResetToken passToken = passwordResetTokenRepository.findByToken(request.getToken());
        if (passToken == null) return null;
        UserLogin userLogin = passToken.getUser();
        userLogin.setPassword(passwordEncoder.encode(request.getPassword()));
        userLoginRepository.save(userLogin);
        passwordResetTokenRepository.delete(passToken);
        return PasswordResetResponse.builder()
                .message("changed").build();

    }
}
