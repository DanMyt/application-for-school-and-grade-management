package sk.schoolmanagement.schoolmanagement.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.CourseGradingViewDto;
import sk.schoolmanagement.schoolmanagement.dto.CoursesDto;
import sk.schoolmanagement.schoolmanagement.dto.GradeDto;
import sk.schoolmanagement.schoolmanagement.entity.Courses;
import sk.schoolmanagement.schoolmanagement.entity.Grade;
import sk.schoolmanagement.schoolmanagement.service.GradeService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GradeController {

    private final GradeService gradeService;

    @RequestMapping("/grades")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<Grade>> getAllGrades() {
        return ResponseEntity.ok(gradeService.findAll());
    }

    @PostMapping("/addGrade")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> addGrade(@RequestBody GradeDto gradeInfo) {
        this.gradeService.addGrade(gradeInfo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/gradings/course/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<CourseGradingViewDto>> listGradingsForCourse(@PathVariable("id") Long courseId) {
        return ResponseEntity.ok(this.gradeService.listGradingsForCourse(courseId));
    }

    @GetMapping("/gradings/course/student/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseGradingViewDto>> listGradingsForStudent(@PathVariable("id") Long courseId) {
        return ResponseEntity.ok(this.gradeService.listGradingsForStudent(courseId));
    }


}
