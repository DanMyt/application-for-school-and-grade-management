package sk.schoolmanagement.schoolmanagement.service;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.schoolmanagement.schoolmanagement.dto.CoursesDto;
import sk.schoolmanagement.schoolmanagement.dto.StudentDto;
import sk.schoolmanagement.schoolmanagement.dto.TeacherDto;
import sk.schoolmanagement.schoolmanagement.entity.Courses;
import sk.schoolmanagement.schoolmanagement.entity.Student;
import sk.schoolmanagement.schoolmanagement.entity.Teacher;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.repository.CourseRepository;
import sk.schoolmanagement.schoolmanagement.repository.StudentRepository;
import sk.schoolmanagement.schoolmanagement.repository.TeacherRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;


    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;


    @Transactional(readOnly = true)
    public List<Courses> findAll() {
        return courseRepository.findAll();
    }

    @Transactional
    public Courses addCourse(CoursesDto courseInfo) {
        if (courseInfo.getId() != null) {
            Courses changedCourse = courseRepository.findCourseById(courseInfo.getId());
            changedCourse.setCourseName(courseInfo.getCourseName());
            changedCourse.setSubject(courseInfo.getSubject());
            this.courseRepository.save(changedCourse);
            changedCourse.getStudents().clear();
            changedCourse.getTeachers().clear();

            for (StudentDto student : courseInfo.getStudents()) {
                Student studentEntity = this.studentRepository.findById(student.getId()).orElseThrow();
                changedCourse.getStudents().add(studentEntity);
            }

            for (TeacherDto teacher : courseInfo.getTeachers()) {
                Teacher teacherEntity = this.teacherRepository.findById(teacher.getId()).orElseThrow();
                changedCourse.getTeachers().add(teacherEntity);
            }

            return changedCourse;
        } else {
            Courses course = new Courses(courseInfo.getCourseName(), courseInfo.getSubject());
            this.courseRepository.save(course);

            for (StudentDto student : courseInfo.getStudents()) {
                Student studentEntity = this.studentRepository.findById(student.getId()).orElseThrow();
                course.getStudents().add(studentEntity);
            }

            for (TeacherDto teacher : courseInfo.getTeachers()) {
                Teacher teacherEntity = this.teacherRepository.findById(teacher.getId()).orElseThrow();
                course.getTeachers().add(teacherEntity);
            }

            return course;
        }

    }

    public Courses findCourseById(Long courseId) {
        return courseRepository.findCourseById(courseId);
    }


    //public void sendEmails(Long idTemplate, Set<Long> studentsIds) {
    //    for (var studentId : studentsIds) {
    //        var student = this.studentRepository.findById(studentId).orElseThrow();

       //     Map<String, Object> params = new HashMap<>();
       //     params
       // }
    //}


    @Transactional
    public void deleteById(Long courseId) {
       courseRepository.deleteById(courseId);
    }

    public Set<Courses> getTeacherCourses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        Teacher teacher = this.teacherRepository.findFirstByEmail(principal.getMail()).orElseThrow();
        return teacher.getCourses();
    }
}
