package sk.schoolmanagement.schoolmanagement.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.schoolmanagement.schoolmanagement.dto.CoursesDto;
import sk.schoolmanagement.schoolmanagement.dto.PostDto;
import sk.schoolmanagement.schoolmanagement.dto.PostDtoRequest;
import sk.schoolmanagement.schoolmanagement.entity.*;
import sk.schoolmanagement.schoolmanagement.repository.CourseRepository;
import sk.schoolmanagement.schoolmanagement.repository.PostRepository;
import sk.schoolmanagement.schoolmanagement.repository.StudentRepository;
import sk.schoolmanagement.schoolmanagement.repository.TeacherRepository;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final ImagesService imageService;

    public Set<Post> findAllPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        System.out.println(principal.getRoles().get(0).getName());
        Set<Courses> courses;
        Set<Post> posts = new HashSet<>();
        if (principal.getRoles().get(0).getName().equals("TEACHER")) {
            Teacher teacher = this.teacherRepository.findFirstByEmail(principal.getMail()).orElseThrow();
            courses = teacher.getCourses();
            for (Courses courses1 : courses) {
                List<Post> post = postRepository.findByCoursesContaining(courses1);
                if (post != null) {
                    posts.addAll(post);
                }
            }
        } else {
            Student student = this.studentRepository.findFirstByMail(principal.getMail()).orElseThrow();
            courses = student.getCourses();
            for (Courses courses1 : courses) {
                List<Post> post = postRepository.findByCoursesContaining(courses1);
                if (post != null) {
                    posts.addAll(post);
                }
            }
        }
        return posts;

    }


    @Transactional
    public Post savePost(PostDtoRequest postDto) {
        Post post = new Post();
        post.setContent(postDto.getContent());
        post.setCreatedAt(new Date());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        Teacher teacher = this.teacherRepository.findFirstByEmail(principal.getMail()).orElseThrow();
        post.setTeacher(teacher);
        for(CoursesDto courseDto : postDto.getCourses()) {
            Courses course = courseRepository.findCourseById(courseDto.getId());
            System.out.println(course.getCourseName());
            post.getCourses().add(course);
            course.getPosts().add(post);
        }


        return postRepository.save(post);
    }

    public void deleteById(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("Post not found"));
        post.getCourses().forEach(course -> course.getPosts().remove(post));
        postRepository.save(post);
        imageService.deleteByPostId(postId);
        postRepository.deleteById(postId);
    }
}
