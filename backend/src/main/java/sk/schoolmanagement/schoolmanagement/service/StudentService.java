package sk.schoolmanagement.schoolmanagement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.schoolmanagement.schoolmanagement.dto.InfoForLoginSendDto;
import sk.schoolmanagement.schoolmanagement.dto.RegisterRequest;
import sk.schoolmanagement.schoolmanagement.dto.StudentDto;
import sk.schoolmanagement.schoolmanagement.entity.Courses;
import sk.schoolmanagement.schoolmanagement.entity.Student;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.repository.CourseRepository;
import sk.schoolmanagement.schoolmanagement.repository.GradeRepository;
import sk.schoolmanagement.schoolmanagement.repository.StudentRepository;
import sk.schoolmanagement.schoolmanagement.repository.UserLoginRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final String PASSWORD_SET = "QWERTZUIOPASDFGHJKLYXCVBNMqwertzuiopasdfghjklyxcvbnm1234567890`@#$~^&*{}/(";

    private final StudentRepository studentRepository;
    private final EmailService emailService;
    private final UserLoginRepository userLoginRepository;
    private final CourseRepository courseRepository;
    private final AuthenticationService authenticationService;
    private final GradeRepository gradeRepository;

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Set<Courses> getStudentCourses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();

        Student student = this.studentRepository.findFirstByMail(principal.getMail()).orElseThrow();
        return student.getCourses();
    }


    public void sendLoginToStudents(InfoForLoginSendDto infoForLoginSendDto) {
        List<Long> ids = infoForLoginSendDto.getStudentsIds();


        for (var studentId : ids) {
            System.out.println("toto je id " + studentId);
            Optional<Student> student = studentRepository.findById(studentId);
            String firstName = student.get().getFirstName();

            String secondName = student.get().getLastName();
            String email = student.get().getMail();


            Random random = new Random();
            StringBuilder generatedPassword = new StringBuilder(10);

            for (int i = 0; i<10; i++) {
                int index = random.nextInt(PASSWORD_SET.length());
                generatedPassword.append(PASSWORD_SET.charAt(index));
            }

            RegisterRequest request = new RegisterRequest();
            request.setFirstName(firstName);
            request.setLastName(secondName);
            request.setMail(email);
            request.setPassword(generatedPassword.toString());
            System.out.println("Toto je email" + email);
            System.out.println("Toto je password" + generatedPassword.toString());

            authenticationService.registerStudents(request);

            String text = "Dobrý deň, vaše prihlasovacie údaje sú: login: " + email + " password: " + generatedPassword;
            emailService.sendSimpleEmail(email,"Prihlasovacie údaje do systému SchoolNet", text);
        }
    }

    @Transactional
    public Student saveStudent(StudentDto studentDto) {
        Student student;
        if (studentDto.getId() == null || studentDto.getId() <= 0) {
            // create new
            student = new Student(studentDto.getMail(), studentDto.getFirstName(), studentDto.getLastName());
        } else {
            // update
            student = studentRepository.findById(studentDto.getId()).orElseThrow();
            student.setFirstName(studentDto.getFirstName());
            student.setLastName(studentDto.getLastName());
            student.setMail(studentDto.getMail());
        }

        return studentRepository.save(student);
    }

    public void deleteById(Long studentId) {
        Optional<Student> student = studentRepository.findById(studentId);
        Student student1;
        if(student.isPresent()) {
            student1 = student.get();
            List<Courses> coursesContainingStudent = courseRepository.findByStudentsContaining(student1);
            coursesContainingStudent.forEach(course -> course.getStudents().remove(student1));
            courseRepository.saveAll(coursesContainingStudent);
            gradeRepository.deleteByStudentId(studentId);
            userLoginRepository.deleteByMail(student1.getMail());
            studentRepository.deleteById(studentId);
        }
    }
}
