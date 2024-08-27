package sk.schoolmanagement.schoolmanagement.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import sk.schoolmanagement.schoolmanagement.entity.Student;
import sk.schoolmanagement.schoolmanagement.entity.Teacher;
import sk.schoolmanagement.schoolmanagement.repository.TeacherRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public List<Teacher> findAll() {
        return teacherRepository.findAll();
    }

    public Teacher findTeacher(String email) {
        return teacherRepository.findByEmail(email);
    }

    public Teacher save(Teacher teacher) {
        return teacherRepository.save(teacher);
    }
}
