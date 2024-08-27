package sk.schoolmanagement.schoolmanagement.service;


import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.schoolmanagement.schoolmanagement.dto.AssigmentDto;
import sk.schoolmanagement.schoolmanagement.dto.CourseSubmittedViewDto;
import sk.schoolmanagement.schoolmanagement.entity.*;
import sk.schoolmanagement.schoolmanagement.repository.AssigmentsRepository;
import sk.schoolmanagement.schoolmanagement.repository.AssigmentsStudentsFilesRepository;
import sk.schoolmanagement.schoolmanagement.repository.CourseRepository;
import sk.schoolmanagement.schoolmanagement.repository.StudentRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssigmentsService {
    private final AssigmentsRepository assigmentsRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final AssigmentsStudentsFilesRepository assigmentsStudentsFilesRepository;
    private final EmailService emailService;


    @Scheduled(cron = "0 0 11 * * ?")
    public void checkAssignmentsDueTomorrow() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 1);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        Date startOfDay = cal.getTime();
        cal.add(Calendar.DATE, 1);
        Date endOfDay = cal.getTime();

        List<Assigments> assignmentsDueTomorrow = assigmentsRepository.findByDeadlineBetween(startOfDay, endOfDay);
        if (!assignmentsDueTomorrow.isEmpty()) {
            for (Assigments assigments : assignmentsDueTomorrow) {
                Courses courses = courseRepository.findCourseById(assigments.getCourses().getId());
                Set<Student> students = courses.getStudents();
                for (Student student : students) {
                    String message = "UPOZORNENIE: " + "blíži sa odovzdávka zadania " + assigments.getName();
                    emailService.sendSimpleEmail(student.getMail(), "Odovzdávka zadania", message);
                }
            }
        }
        if (!assignmentsDueTomorrow.isEmpty()) {
            assignmentsDueTomorrow.forEach(assignment ->
                    System.out.println("Assignment due tomorrow: " + assignment.getName()));
        }
    }

    @Transactional(readOnly = true)
    public List<Assigments> findAll() {
        return assigmentsRepository.findAll();
    }

    @Transactional
    public Assigments addAssigment(AssigmentDto assigmentInfo) {
        if (assigmentInfo.getId() == null) {
            Assigments assigments = new Assigments();
            assigments.setName(assigmentInfo.getName());
            assigments.setMaxPoints(assigmentInfo.getMaxPoints());
            assigments.setDescription(assigmentInfo.getDescription());
            assigments.setWithFileUploading(assigmentInfo.getWithFileUploading());
            assigments.setCourses(this.courseRepository.getReferenceById(assigmentInfo.getCourseId()));
            assigments.setDeadline(assigmentInfo.getDeadline());
            return this.assigmentsRepository.save(assigments);
        } else {
            Optional<Assigments> assigments = assigmentsRepository.findById(assigmentInfo.getId());
            Assigments assigments1 = assigments.get();
            assigments1.setDeadline(assigmentInfo.getDeadline());
            assigments1.setDescription(assigmentInfo.getDescription());
            assigments1.setName(assigmentInfo.getName());
            assigments1.setWithFileUploading(assigmentInfo.getWithFileUploading());
            assigments1.setMaxPoints(assigmentInfo.getMaxPoints());
            assigments1.setCourses(this.courseRepository.getReferenceById(assigmentInfo.getCourseId()));
            return this.assigmentsRepository.save(assigments1);

        }

    }

    public List<Assigments> listAssigmentsForCourse(Long courseId) {
        return assigmentsRepository.findAllByCourseId(courseId);
    }

    public List<AssigmentsStudentsFiles> listAssigmentsFilesForCourse(Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        return assigmentsStudentsFilesRepository.findAllByCourseIdAndStudentMail(courseId, principal.getMail());
    }

    public List<Assigments> listAssigmentsWithFileUploadForCourse(Long courseId) {
        return  assigmentsRepository.findAllByCourseIdWhereWithFileUploadingIsTrue(courseId);
    }


    //@Transactional(readOnly = true)
    // public List<CourseGradingViewDto> listGradingsForCourse(Long courseId) {
    //   List<CourseGradingView> gradingsForCourse = this.courseGradingViewRepository.findAllByCourseId(courseId);

    //   Map<Long, List<CourseGradingView>> groupedByStudents = gradingsForCourse
    //           .stream()
    //           .filter(g -> g.getStudentId() != null)
    //            .collect(Collectors.groupingBy(CourseGradingView::getStudentId));


    //     List<CourseGradingViewDto> result = new ArrayList<>();
    //    for (var studentEntry : groupedByStudents.entrySet()) {
    //      List<CourseGradingView> assignments = studentEntry.getValue();

    //      CourseGradingViewDto studentDto = new CourseGradingViewDto(assignments.get(0));
    //      for (CourseGradingView assignment : assignments) {
    //            if (assignment.getAssignmentId() != null) {
        //                studentDto.getAssignmentGrade().put(assignment.getAssignmentName(), assignment.getGrade());
    //           }
    //       }

    //        result.add(studentDto);
    //   }

    //     return result;
    //}

    @Transactional(readOnly = true)
    public List<CourseSubmittedViewDto> listSubmittedOrNot(Long courseId) {
        List<AssigmentsStudentsFiles> listSubmittedOrNot = this.assigmentsStudentsFilesRepository.findAllByCourseId(courseId);

        Map<Long, List<AssigmentsStudentsFiles>> groupedByStudents = listSubmittedOrNot
                .stream()
                .filter(g -> g.getStudentId() != null)
                .collect(Collectors.groupingBy(AssigmentsStudentsFiles::getStudentId));

        List<CourseSubmittedViewDto> result = new ArrayList<>();
        for (var studentEntry : groupedByStudents.entrySet()) {
            List<AssigmentsStudentsFiles> assignments = studentEntry.getValue();

            CourseSubmittedViewDto studentDto = new CourseSubmittedViewDto(assignments.get(0));

            for (AssigmentsStudentsFiles assignment : assignments) {
                if (assignment.getAssignmentId() != null) {
                    String text = assignment.getUloadedFileId() != null ? "Odovzdané" : "Bez odovzdávky";
                    if (assignment.getDeadline() != null && assignment.getDateOfUpload() != null && assignment.getDateOfUpload().after(assignment.getDeadline())) {
                        text = "Odovzdané neskoro";
                    }
                    System.out.println(text);
                    //HashMap<String, Date> assignmentDetail = new HashMap<>();
                    //assignmentDetail.put(text,assignment.getDateOfUpload());
                    studentDto.getAssignmentSubmittedOrNot().put(assignment.getAssignmentName(),text);
                }
            }
            result.add(studentDto);
        }
        return result;
    }

    public void deleteById(Long assigmentId) {
        assigmentsRepository.deleteById(assigmentId);
    }
}
