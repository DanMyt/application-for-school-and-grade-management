package sk.schoolmanagement.schoolmanagement.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.CoursesDto;
import sk.schoolmanagement.schoolmanagement.dto.CoursesGridDto;
import sk.schoolmanagement.schoolmanagement.dto.StudentDto;
import sk.schoolmanagement.schoolmanagement.entity.Courses;
import sk.schoolmanagement.schoolmanagement.entity.Student;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.repository.StudentRepository;
import sk.schoolmanagement.schoolmanagement.service.CourseService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@PreAuthorize("hasRole('TEACHER')")
public class CourseController {

    private final CourseService courseService;

    @RequestMapping("/courses")
    public ResponseEntity<List<CoursesGridDto>> getAllCourses() {
        return ResponseEntity.ok(this.courseService.getTeacherCourses().stream().map(CoursesGridDto::new).toList());
        //return courseService.findAll().stream().map(CoursesGridDto::new).toList();
    }

    @RequestMapping("/courses/content/{id}")
    public ResponseEntity<CoursesDto> getCourseById(@PathVariable("id") Long courseId) {
        return ResponseEntity.ok(new CoursesDto(courseService.findCourseById(courseId)));
    }

    @PostMapping("/createCourse")
    public ResponseEntity<CoursesDto> addOrChangeCourse(@RequestBody CoursesDto courseInfo) {
        var result = this.courseService.addCourse(courseInfo);
        return ResponseEntity.ok(new CoursesDto(result));
    }

    @RequestMapping("/removeCourse/{id}")
    public ResponseEntity<?> removeCourseById(@PathVariable("id") Long courseId) {
        courseService.deleteById(courseId);
        return ResponseEntity.ok().build();
    }
}
