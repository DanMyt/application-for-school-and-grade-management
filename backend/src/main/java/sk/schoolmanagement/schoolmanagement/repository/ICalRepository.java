package sk.schoolmanagement.schoolmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.schoolmanagement.schoolmanagement.entity.ICalEvent;

import java.util.List;

public interface ICalRepository extends JpaRepository<ICalEvent,Long> {

}
