package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.Post;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class PostDto {
    private Long id;
    private String content;
    private Date createdAt;
    private Long teacherId;
    private String teacherFirstName;
    private String teacherLastName;

    public PostDto(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.createdAt = post.getCreatedAt();
        this.teacherId = post.getTeacher().getId();
        this.teacherFirstName = post.getTeacher().getName();
        this.teacherLastName = post.getTeacher().getSurname();
    }
}
