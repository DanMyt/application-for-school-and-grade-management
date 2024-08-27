package sk.schoolmanagement.schoolmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.CoursesGridDto;
import sk.schoolmanagement.schoolmanagement.dto.PostDto;
import sk.schoolmanagement.schoolmanagement.dto.PostDtoRequest;
import sk.schoolmanagement.schoolmanagement.service.PostService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
public class PostController {
    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts() {
        return ResponseEntity.ok(this.postService.findAllPosts().stream().map(PostDto::new).toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<PostDto> createPost(@RequestBody PostDtoRequest postDto) {
        return ResponseEntity.ok(new PostDto(postService.savePost(postDto)));
    }

    @Transactional
    @RequestMapping("/remove/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> removePostById(@PathVariable("id") Long postId) {
        postService.deleteById(postId);
        return ResponseEntity.ok().build();
    }

}
