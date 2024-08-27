package sk.schoolmanagement.schoolmanagement.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.CoursesGridDto;
import sk.schoolmanagement.schoolmanagement.dto.InfoForLoginSendDto;
import sk.schoolmanagement.schoolmanagement.dto.StudentDto;
import sk.schoolmanagement.schoolmanagement.service.StudentService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    @RequestMapping("/allCourses/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CoursesGridDto>> getAllCourses() {
        return ResponseEntity.ok(studentService.getStudentCourses().stream().map(CoursesGridDto::new).toList());
    }

    @PostMapping("/save-student")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<StudentDto> saveStudent(@RequestBody StudentDto studentDto) {
        var result = studentService.saveStudent(studentDto);
        return ResponseEntity.ok(new StudentDto(result));
    }


    @RequestMapping("/students")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.findAll().stream().map(StudentDto::new).toList());
    }

    @PostMapping("/students/sendLoginPassword")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> sendLoginToStudents(@RequestBody InfoForLoginSendDto infoForLoginSendDto) {
        studentService.sendLoginToStudents(infoForLoginSendDto);
        return ResponseEntity.status(HttpStatus.OK).body("");
    }


    @Transactional
    @RequestMapping("/removeStudent/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> removeStudentById(@PathVariable("id") Long studentId) {
        studentService.deleteById(studentId);
        return ResponseEntity.ok().build();
    }


}
