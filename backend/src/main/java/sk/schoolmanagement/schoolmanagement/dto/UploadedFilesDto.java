package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.UploadedFiles;

@Getter
@Setter
@NoArgsConstructor
public class UploadedFilesDto {
    private Long id;
    private byte[] uploadedFile;
    private String fileName;
    private Long assigementId;
    private Long studentId;

    public UploadedFilesDto(UploadedFiles uploadedFiles) {
        this.id = uploadedFiles.getId();
        this.uploadedFile = uploadedFiles.getUploadedFile();
        this.fileName = uploadedFiles.getFileName();
        this.assigementId = uploadedFiles.getAssigement().getId();
        this.studentId = uploadedFiles.getStudent().getId();
    }

}
