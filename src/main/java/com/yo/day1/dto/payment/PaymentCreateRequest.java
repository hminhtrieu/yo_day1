package com.yo.day1.dto.payment;

import com.yo.day1.domain.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentCreateRequest {
    @NotNull
    private Long invoiceId;
    @NotBlank
    private String paymentCode;
    @NotNull
    private float paidAmount;
    @NotNull
    private PaymentMethod paymentMethod;
    @NotNull
    private LocalDateTime paidAt;
    @Size(max = 255) String note;
}
