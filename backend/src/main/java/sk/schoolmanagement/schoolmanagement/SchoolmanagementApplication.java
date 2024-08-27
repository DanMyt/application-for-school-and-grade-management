package sk.schoolmanagement.schoolmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SchoolmanagementApplication {
	public static void main(String[] args) {
		SpringApplication.run(SchoolmanagementApplication.class, args);
	}
}
