package sk.schoolmanagement.schoolmanagement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sk.schoolmanagement.schoolmanagement.entity.ICalEvent;
import sk.schoolmanagement.schoolmanagement.entity.UserLogin;
import sk.schoolmanagement.schoolmanagement.repository.ICalRepository;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ICalService {

    private final ICalRepository iCalRepository;
    public void addICal(MultipartFile multipartFile) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        String iCal = new String(multipartFile.getBytes(), StandardCharsets.UTF_8);
        ICalEvent iCalEvent = new ICalEvent();
        System.out.println(iCal);
        iCalEvent.setContent(iCal);
        iCalEvent.setUserLogin(principal);

        iCalRepository.save(iCalEvent);


    }

    @Transactional
    public List<ICalEvent> getIcals() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserLogin principal = (UserLogin) authentication.getPrincipal();
        return new ArrayList<>(principal.getICalEvents());

    }

    public void deleteById(Long icalId) {
        iCalRepository.deleteById(icalId);
    }
}
