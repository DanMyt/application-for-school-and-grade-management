package sk.schoolmanagement.schoolmanagement.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.schoolmanagement.schoolmanagement.entity.Assigments;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssigmentsResponse {
    private List<Assigments> assigments;

}
