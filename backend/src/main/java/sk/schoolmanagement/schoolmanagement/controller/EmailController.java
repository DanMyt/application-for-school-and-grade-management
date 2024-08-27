package sk.schoolmanagement.schoolmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sk.schoolmanagement.schoolmanagement.dto.CoursesDto;
import sk.schoolmanagement.schoolmanagement.dto.MailDto;
import sk.schoolmanagement.schoolmanagement.service.EmailService;

@RestController
public class EmailController {
    @Autowired
    private EmailService emailService;



}
