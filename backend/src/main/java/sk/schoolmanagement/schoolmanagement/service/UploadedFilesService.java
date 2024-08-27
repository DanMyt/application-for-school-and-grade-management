package sk.schoolmanagement.schoolmanagement.service;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sk.schoolmanagement.schoolmanagement.entity.Student;
import sk.schoolmanagement.schoolmanagement.entity.UploadedFiles;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.repository.AssigmentsRepository;
import sk.schoolmanagement.schoolmanagement.repository.StudentRepository;
import sk.schoolmanagement.schoolmanagement.repository.UploadedFilesRepository;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UploadedFilesService {
    private final UploadedFilesRepository uploadedFilesRepository;
    private final AssigmentsRepository assigmentsRepository;
    private final StudentRepository studentRepository;


    @Transactional
    public UploadedFiles addUploadedFile(MultipartFile multipartFile, Long assigmentId, String fileName) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        Student student = this.studentRepository.findFirstByMail(principal.getMail()).orElseThrow();


        UploadedFiles uploadedFiles;
        if (multipartFile == null) {
            UploadedFiles uploadedFiles1 = this.uploadedFilesRepository.findByAssigementIdAndStudentId(assigmentId, student.getId()).orElseThrow();
            this.uploadedFilesRepository.delete(uploadedFiles1);
            return uploadedFiles1;
        } else {
            Optional<UploadedFiles> uploadedFiles1 = this.uploadedFilesRepository.findByAssigementIdAndStudentId(assigmentId, student.getId());
            if (uploadedFiles1.isPresent()) {
                uploadedFiles = uploadedFiles1.get();
            } else {
                uploadedFiles = new UploadedFiles();
            }
            uploadedFiles.setUploadedFile(multipartFile.getBytes());
            uploadedFiles.setAssigement(this.assigmentsRepository.getReferenceById(assigmentId));
            uploadedFiles.setFileName(fileName);
            uploadedFiles.setStudent(student);
            uploadedFiles.setDateOfUpload(new Date());
        }

        return uploadedFilesRepository.save(uploadedFiles);

    }

    public UploadedFiles getFileById(Long fileId) {
        return uploadedFilesRepository.getReferenceById(fileId);
    }

    public UploadedFiles getFileByStudentIdAndAssigementId(Long assigementId, Long studentId) {
        return  uploadedFilesRepository.findByAssigementIdAndStudentId(assigementId,studentId).orElseThrow();
    }
}
