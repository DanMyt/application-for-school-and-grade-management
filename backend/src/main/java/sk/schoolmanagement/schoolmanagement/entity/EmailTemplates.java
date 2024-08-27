package sk.schoolmanagement.schoolmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "email_templates", schema = "public")
@Getter
@Setter
public class EmailTemplates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "template")
    private String template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    public EmailTemplates(String template) {
        this.template = template;
    }

    public EmailTemplates(Long id, String template) {
        this.template = template;
        this.id = id;
    }

    public EmailTemplates() {

    }
}
