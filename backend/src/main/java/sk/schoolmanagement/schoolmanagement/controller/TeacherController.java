package sk.schoolmanagement.schoolmanagement.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.TeacherDto;
import sk.schoolmanagement.schoolmanagement.entity.Student;
import sk.schoolmanagement.schoolmanagement.entity.Teacher;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.service.TeacherService;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teachers")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    private final TeacherService teacherService;

    @RequestMapping("/teachers")
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.findAll().stream().map(TeacherDto::new).toList());
    }

    @GetMapping("/{email}")
    public ResponseEntity<TeacherDto> findTeacher(@PathVariable("email") String email) {
        return ResponseEntity.ok(new TeacherDto(teacherService.findTeacher(email)));
    }

    @PostMapping
    public ResponseEntity<TeacherDto> addTeacher(@RequestBody Teacher teacher) {
        return ResponseEntity.ok(new TeacherDto(teacherService.save(teacher)));
    }


}