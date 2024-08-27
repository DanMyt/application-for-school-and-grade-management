package sk.schoolmanagement.schoolmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sk.schoolmanagement.schoolmanagement.entity.Images;

@Getter
@Setter
@NoArgsConstructor
public class ImagesDtoResponse {
    private Long id;
    private byte[] image;
    private Long postId;

    public ImagesDtoResponse(Images images) {
        this.id = images.getId();
        this.image = images.getImage();
        this.postId = images.getPostId();;
    }
}
