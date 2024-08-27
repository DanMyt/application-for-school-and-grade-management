package sk.schoolmanagement.schoolmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.*;
import sk.schoolmanagement.schoolmanagement.entity.Assigments;
import sk.schoolmanagement.schoolmanagement.entity.Courses;
import sk.schoolmanagement.schoolmanagement.service.AssigmentsService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AssigmentsController {


    private final AssigmentsService assigmentsService;

    @RequestMapping("/testsandassigments/{id}")
    public ResponseEntity<List<AssigmentDto>> getAssigmentsForCourse(@PathVariable("id") Long courseId) {
        return ResponseEntity.ok(this.assigmentsService.listAssigmentsForCourse(courseId).stream().map(AssigmentDto::new).toList());
    }


    @PreAuthorize("hasRole('STUDENT')")
    @RequestMapping("/getAssigementsFiles/{id}")
    public ResponseEntity<List<AssigmentsStudentsFileDto>> getAssigmentsFilesForCourse(@PathVariable("id") Long courseId) {
        return ResponseEntity.ok(this.assigmentsService.listAssigmentsFilesForCourse(courseId).stream().map(AssigmentsStudentsFileDto::new).toList());
    }

    @PreAuthorize("hasRole('TEACHER')")
    @RequestMapping("/getTestsWithFileUpload/{id}")
    public ResponseEntity<List<AssigmentDto>> getTestsWithFileUpload(@PathVariable("id") Long courseId) {
        return ResponseEntity.ok(this.assigmentsService.listAssigmentsWithFileUploadForCourse(courseId).stream().map(AssigmentDto::new).toList());
    }

    @PreAuthorize("hasRole('TEACHER')")
    @RequestMapping("/getSubmittedOrNot/{id}")
    public ResponseEntity<List<CourseSubmittedViewDto>> getSubmittedOrNot(@PathVariable("id") Long courseId) {
        return ResponseEntity.ok(this.assigmentsService.listSubmittedOrNot(courseId));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/createAssigment")
    public ResponseEntity<AssigmentDto> addAssigment(@RequestBody AssigmentDto assigmentDto) {
        var result = this.assigmentsService.addAssigment(assigmentDto);
        return ResponseEntity.ok(new AssigmentDto(result));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @RequestMapping("/removeAssigment/{id}")
    public ResponseEntity<?> removeAssigmentById(@PathVariable("id") Long assigmentId) {
        assigmentsService.deleteById(assigmentId);
        return ResponseEntity.ok().build();
    }




}
