package com.yo.day1.repository;

import com.yo.day1.domain.entity.Payment;
import lombok.extern.java.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


//dang dung java spring boot nen ko truc tiep viet sql, spring boot se tu dog sinh ra ma sql thuc hien
//thu vien jpa se tu dong co findbyid...
//findby sinh ra tu dong: findBy + ten field
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    List<Payment> findByInvoiceId(Long InvoiceId);

    @Query("SELECT o from Payment o where  o.invoice.id=:invoiceId")
    List<Payment> findByInvoice(@Param("invoiceId") Long invoice);
}
