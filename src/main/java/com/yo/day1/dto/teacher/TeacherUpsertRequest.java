package com.yo.day1.dto.teacher;

import com.yo.day1.domain.enums.TeacherRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherUpsertRequest {

    @Size(min = 2, max = 10)
    private String teacherCode;

    @Size(min = 2, max = 20)
    private String fullname;

    @Pattern(regexp = "^(84|0[35789])+([0-9]{8})$")
    @NotBlank
    private String phone;

    @Email
    private String email;

    @NotBlank
    private TeacherRole teacherRole = TeacherRole.BOTH;

    @NotBlank
    private String cccdImageUrl;

    private boolean isActive = true;
}
