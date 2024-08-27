package sk.schoolmanagement.schoolmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sk.schoolmanagement.schoolmanagement.dto.PendingDto;
import sk.schoolmanagement.schoolmanagement.service.AuthenticationService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
@RequestMapping("/api/pending")
public class PendingController {
    private final AuthenticationService authenticationService;

    @RequestMapping("/getAll")
    public ResponseEntity<List<PendingDto>> getAllPendings() {
        return ResponseEntity.ok(this.authenticationService.getAllPendings().stream().map(PendingDto::new).toList());
    }

    @PostMapping("/approve")
    public ResponseEntity<PendingDto> approve(@RequestBody PendingDto pendingDto) {
         return ResponseEntity.ok(new PendingDto(this.authenticationService.approve(pendingDto)));

    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody PendingDto pendingDto) {
        this.authenticationService.delete(pendingDto);
        return ResponseEntity.ok().build();

    }

    @PostMapping("/notApproved")
    public ResponseEntity<?> notApproved(@RequestBody PendingDto pendingDto) {
        this.authenticationService.notApproved(pendingDto);
        return ResponseEntity.ok().build();

    }
}
