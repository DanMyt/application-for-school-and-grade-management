package sk.schoolmanagement.schoolmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sk.schoolmanagement.schoolmanagement.dto.GradeDto;
import sk.schoolmanagement.schoolmanagement.dto.ICalEventDto;
import sk.schoolmanagement.schoolmanagement.entity.ICalEvent;
import sk.schoolmanagement.schoolmanagement.repository.ICalRepository;
import sk.schoolmanagement.schoolmanagement.service.ICalService;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ical")
public class ICalController {

    private final ICalService iCalService;

    @PostMapping("/upload")
    public ResponseEntity<?> addICalContent(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        this.iCalService.addICal(multipartFile);
        return ResponseEntity.status(HttpStatus.OK).body("");
    }

    @GetMapping("/allIcals")
    public List<ICalEventDto> getIcals() {
        return this.iCalService.getIcals().stream().map(ICalEventDto::new).toList();
    }

    @RequestMapping("/{id}")
    public ResponseEntity<?> removeIcalById(@PathVariable("id") Long icalId) {
        iCalService.deleteById(icalId);
        return ResponseEntity.ok().build();
    }
}
