create sequence courses_seq;



create sequence student_id_seq;



create sequence "Grade_id_seq";



create sequence "Post_id_seq";



create sequence "Images_id_seq";



create sequence password_reset_token_seq
    increment by 50;


create table teacher
(
    name    varchar not null,
    surname varchar not null,
    id      serial
        constraint teacher_pk
            primary key,
    email   varchar not null
);



create unique index teacher_id_uindex
    on teacher (id);

create unique index teacher_email_uindex
    on teacher (email);

create table user_login
(
    mail        varchar     not null,
    password    varchar     not null,
    id          bigserial
        constraint user_login_pk
            primary key,
    first_name  varchar(30) not null,
    last_name   varchar(30) not null,
    approved_by varchar(255)
);



create unique index user_login_mail_uindex
    on user_login (mail);

create table courses
(
    course_name varchar                                         not null,
    id          bigint default nextval('courses_seq'::regclass) not null
        constraint courses_pk
            primary key,
    subject     varchar                                         not null,
    column_4    integer
);



alter sequence courses_seq owned by courses.id;

create unique index courses_id_uindex
    on courses (id);

create table students
(
    id         bigint default nextval('student_id_seq'::regclass) not null
        constraint student_pk
            primary key,
    first_name varchar                                            not null,
    last_name  varchar                                            not null,
    mail       varchar                                            not null
);



alter sequence student_id_seq owned by students.id;

create unique index student_id_uindex
    on students (id);

create unique index students_mail_uindex
    on students (mail);

create table student_to_course
(
    course_id  bigint not null
        constraint student_to_course_courses_id_fk
            references courses,
    student_id bigint not null
        constraint student_to_course_student_id_fk
            references students
);



create table teacher_to_course
(
    course_id  bigint not null,
    teacher_id bigint not null
);



create table if not exists assigments
(
    id                  bigserial,
    max_points          bigint                not null,
    name                varchar               not null,
    course_id           bigint                not null
        constraint courses___fk
            references courses,
    description         varchar(10000),
    with_file_uploading boolean default false not null,
    deadline            date,
    column_8            integer,
    constraint unique_course_id_name
        unique (course_id, name)
);



create unique index if not exists assigments_id_uindex
    on assigments (id);


create table grade
(
    id           bigint default nextval('"Grade_id_seq"'::regclass) not null,
    assigment_id bigint                                             not null
        constraint grade_assigments_id_fk
            references assigments (id),
    student_id   bigint                                             not null
        constraint grade_students_id_fk
            references students,
    grade        bigint
);



alter sequence "Grade_id_seq" owned by grade.id;

create unique index grade_id_uindex
    on grade (id);

create unique index index_name
    on grade (assigment_id, student_id);

create table email_templates
(
    template   varchar not null,
    id         bigserial
        constraint email_templates_pk
            primary key,
    teacher_id bigint  not null
        constraint email_templates_teacher_id_fk
            references teacher
);



create unique index email_templates_id_uindex
    on email_templates (id);

create table roles
(
    id   bigserial
        constraint roles_pk
            primary key,
    name varchar not null
);



create unique index roles_id_uindex
    on roles (id);

create table user_login_roles
(
    id            bigserial
        constraint user_login_roles_pk
            primary key,
    roles_id      integer not null,
    user_login_id integer not null
);


create unique index user_login_roles_id_uindex
    on user_login_roles (id);

create table ical_event
(
    id            bigserial
        constraint ical_event_pk
            primary key,
    content       varchar(10000) not null,
    user_login_id bigint
);



create unique index ical_event_id_uindex
    on ical_event (id);

create table uploaded_files
(
    uploaded_file  bytea        not null,
    student_id     bigint       not null
        constraint uploaded_files_students_id_fk
            references students,
    assigement_id  integer      not null
        constraint uploaded_files_assigments_id_fk
            references assigments (id),
    file_name      varchar(255) not null,
    id             bigserial
        constraint uploaded_files_pk
            primary key,
    date_of_upload date
);



create unique index uploaded_files_id_uindex
    on uploaded_files (id);

create unique index unique_assignment_student
    on uploaded_files (student_id, assigement_id);

create table post
(
    id         bigint default nextval('"Post_id_seq"'::regclass) not null
        constraint post_pk
            primary key,
    content    varchar(1000000),
    created_at date                                              not null,
    teacher_id bigint                                            not null
        constraint post_teacher_id_fk
            references teacher
);



alter sequence "Post_id_seq" owned by post.id;

create unique index post_id_uindex
    on post (id);

create table images
(
    id      bigint default nextval('"Images_id_seq"'::regclass) not null
        constraint images_pk
            primary key,
    post_id bigint                                              not null
        constraint images_post_id_fk
            references post,
    image   bytea                                               not null
);



alter sequence "Images_id_seq" owned by images.id;

create unique index images_id_uindex
    on images (id);

create table post_to_course
(
    id        bigserial
        constraint post_to_course_pk
            primary key,
    post_id   bigint not null
        constraint post_to_course_post_id_fk
            references post,
    course_id integer
        constraint post_to_course_courses_id_fk
            references courses
);



create unique index post_to_course_id_uindex
    on post_to_course (id);

create table password_reset_token
(
    id            bigint default nextval('password_reset_token_seq'::regclass) not null
        constraint password_reset_token_pk
            primary key,
    token         varchar,
    user_login_id bigint,
    expiry_date   date
);



alter sequence password_reset_token_seq owned by password_reset_token.id;

create unique index password_reset_token_id_uindex
    on password_reset_token (id);

create view course_grading_view
            (id, course_id, student_id, first_name, last_name, assignment_id, max_points, name, grade_id, grade) as
SELECT row_number() OVER () AS id,
       c.id                 AS course_id,
       s.id                 AS student_id,
       s.first_name,
       s.last_name,
       ass.id               AS assignment_id,
       ass.max_points,
       ass.name,
       g.id                 AS grade_id,
       g.grade
FROM courses c
         JOIN student_to_course stc ON c.id = stc.course_id
         JOIN students s ON stc.student_id = s.id
         LEFT JOIN assigments ass ON c.id = ass.course_id
         LEFT JOIN grade g ON g.assigment_id = ass.id AND g.student_id = s.id;



create view assigments_students_files
            (id, course_id, assignment_id, assignment_name, deadline, assignment_description, student_id, student_mail,
             first_name, last_name, uploaded_file_id, date_of_upload)
as
SELECT row_number() OVER () AS id,
       c.id                 AS course_id,
       a.id                 AS assignment_id,
       a.name               AS assignment_name,
       a.deadline,
       a.description        AS assignment_description,
       s.id                 AS student_id,
       s.mail               AS student_mail,
       s.first_name,
       s.last_name,
       uf.id                AS uploaded_file_id,
       uf.date_of_upload
FROM courses c
         LEFT JOIN assigments a ON c.id = a.course_id
         LEFT JOIN student_to_course stc ON c.id = stc.course_id
         LEFT JOIN students s ON stc.student_id = s.id
         LEFT JOIN uploaded_files uf ON a.id = uf.assigement_id AND s.id = uf.student_id
WHERE a.with_file_uploading = true;



INSERT INTO roles (name) VALUES
                             ('TEACHER'),
                             ('STUDENT');

INSERT INTO user_login (mail, password, first_name, last_name, approved_by)
VALUES ('admin', '$2a$10$V408Pr2PvvPNF/UR4KvuWOVlMAvNGv8w67WdZdIxiv/.ljx1Z3Lza', 'admin', 'admin', 'admin');

INSERT INTO teacher (name, surname, email)
VALUES ('admin', 'admin', 'admin');

WITH teacher_role AS (
    SELECT id AS role_id
    FROM roles
    WHERE name = 'TEACHER'
),
     admin_user AS (
         SELECT id AS user_id
         FROM user_login
         WHERE mail = 'admin'
     )
INSERT INTO user_login_roles (roles_id, user_login_id)
SELECT teacher_role.role_id, admin_user.user_id
FROM teacher_role, admin_user;