package com.yo.day1.dto.parent;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParentUpsertRequest {

    @Size(min = 2, max= 20)
    private String fullname;

    @Pattern(regexp = "^(84|0[35789])+([0-9]{8})$")
    @NotBlank
    private String phone;

    @Email
    private String email;

    @Size(min = 2, max = 35)
    private String address;

    private String relationship;
}
