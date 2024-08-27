package sk.schoolmanagement.schoolmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sk.schoolmanagement.schoolmanagement.dto.UploadedFilesDto;
import sk.schoolmanagement.schoolmanagement.service.UploadedFilesService;

import java.io.IOException;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UploadedFilesController {
    private final UploadedFilesService uploadedFilesService;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/uploadFile")
    public ResponseEntity<UploadedFilesDto> addAssigment(
            @RequestParam(value = "file", required = false) MultipartFile multipartFile,
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("fileName") String fileName) throws IOException {
        var result = this.uploadedFilesService.addUploadedFile(multipartFile, assignmentId, fileName);
        return ResponseEntity.ok(new UploadedFilesDto(result));
    }

    @GetMapping("/getFileByStudent/{assigementId}/{studentId}")
    public ResponseEntity<UploadedFilesDto> getFileByStudentIdAndAssigementId(@PathVariable("assigementId") Long assigementId, @PathVariable("studentId") Long studentId ) {
        var result = this.uploadedFilesService.getFileByStudentIdAndAssigementId(assigementId, studentId);
        return ResponseEntity.ok(new UploadedFilesDto(result));
    }

    @GetMapping("/getFile/{id}")
    public ResponseEntity<UploadedFilesDto> getFile(@PathVariable("id") Long fileId) {
        var result = this.uploadedFilesService.getFileById(fileId);
        return ResponseEntity.ok(new UploadedFilesDto(result));
    }
}
