package sk.schoolmanagement.schoolmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sk.schoolmanagement.schoolmanagement.dto.PasswordChangeRequest;
import sk.schoolmanagement.schoolmanagement.dto.PasswordChangeResponse;
import sk.schoolmanagement.schoolmanagement.dto.PasswordResetRequest;
import sk.schoolmanagement.schoolmanagement.service.AuthenticationService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/password")
public class PasswordChangeController {
    private final AuthenticationService authenticationService;
    @PostMapping("/passwordChange")
    public ResponseEntity<PasswordChangeResponse> passwordChange(@RequestBody PasswordChangeRequest request) {
        return ResponseEntity.ok(authenticationService.changePassword(request));
    }



}
