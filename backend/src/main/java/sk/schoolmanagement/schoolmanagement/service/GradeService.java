package sk.schoolmanagement.schoolmanagement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.schoolmanagement.schoolmanagement.dto.CourseGradingViewDto;
import sk.schoolmanagement.schoolmanagement.dto.GradeDto;
import sk.schoolmanagement.schoolmanagement.entity.CourseGradingView;
import sk.schoolmanagement.schoolmanagement.entity.Grade;
import sk.schoolmanagement.schoolmanagement.entity.Student;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.repository.AssigmentsRepository;
import sk.schoolmanagement.schoolmanagement.repository.CourseGradingViewRepository;
import sk.schoolmanagement.schoolmanagement.repository.GradeRepository;
import sk.schoolmanagement.schoolmanagement.repository.StudentRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;
    private final AssigmentsRepository assigmentsRepository;
    private final StudentRepository studentRepository;
    private final CourseGradingViewRepository courseGradingViewRepository;


    @Transactional(readOnly = true)
    public List<Grade> findAll() {
        return gradeRepository.findAll();
    }

    @Transactional
    public Grade addGrade(GradeDto gradeInfo) {
        Grade grade = gradeRepository.findByAssigmentsAndStudentId(Optional.of(assigmentsRepository.getReferenceById(gradeInfo.getAssigmentId())), gradeInfo.getStudentId());
        if (grade != null) {
            grade.setGrade(gradeInfo.getGrade());
            return this.gradeRepository.save(grade);
        }
        grade = new Grade();
        grade.setGrade(gradeInfo.getGrade());
        grade.setAssigments(assigmentsRepository.getReferenceById(gradeInfo.getAssigmentId()));
        grade.setStudent(studentRepository.getReferenceById(gradeInfo.getStudentId()));
        return this.gradeRepository.save(grade);
    }

    @Transactional(readOnly = true)
    public List<CourseGradingViewDto> listGradingsForCourse(Long courseId) {
        List<CourseGradingView> gradingsForCourse = this.courseGradingViewRepository.findAllByCourseId(courseId);

        Map<Long, List<CourseGradingView>> groupedByStudents = gradingsForCourse
                .stream()
                .filter(g -> g.getStudentId() != null)
                .collect(Collectors.groupingBy(CourseGradingView::getStudentId));


        List<CourseGradingViewDto> result = new ArrayList<>();
        for (var studentEntry : groupedByStudents.entrySet()) {
            List<CourseGradingView> assignments = studentEntry.getValue();

            CourseGradingViewDto studentDto = new CourseGradingViewDto(assignments.get(0));
            for (CourseGradingView assignment : assignments) {
                if (assignment.getAssignmentId() != null) {
                    studentDto.getAssignmentGrade().put(assignment.getAssignmentName(), assignment.getGrade());
                }
            }

            result.add(studentDto);
        }

        return result;
    }

    public List<CourseGradingViewDto> listGradingsForStudent(Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();

        Student student = this.studentRepository.findFirstByMail(principal.getMail()).orElseThrow();

        List<CourseGradingView> gradingsForCourse = this.courseGradingViewRepository.findAllByCourseIdAndStudentId(courseId, student.getId());

        Map<Long, List<CourseGradingView>> groupedByStudents = gradingsForCourse
                .stream()
                .filter(g -> g.getStudentId() != null)
                .collect(Collectors.groupingBy(CourseGradingView::getStudentId));

        List<CourseGradingViewDto> result = new ArrayList<>();
        for (var studentEntry : groupedByStudents.entrySet()) {
            List<CourseGradingView> assignments = studentEntry.getValue();
            CourseGradingViewDto studentDto = new CourseGradingViewDto(assignments.get(0));
            for (CourseGradingView assignment : assignments) {
                if (assignment.getAssignmentId() != null) {
                    studentDto.getAssignmentGrade().put(assignment.getAssignmentName(), assignment.getGrade());
                }
            }
            result.add(studentDto);

        }

        return result;

    }
}
