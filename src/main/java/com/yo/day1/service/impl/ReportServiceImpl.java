package com.yo.day1.service.impl;

import com.yo.day1.dto.report.CourseRevenueResponse;
import com.yo.day1.dto.report.DashboardStatsResponse;
import com.yo.day1.dto.report.MonthlyRevenueResponse;
import com.yo.day1.service.ReportService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import com.yo.day1.domain.enums.InvoiceStatus;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long studentsCount = (long) entityManager.createQuery("SELECT COUNT(s) FROM Student s").getSingleResult();
        long coursesCount = (long) entityManager.createQuery("SELECT COUNT(c) FROM Course c").getSingleResult();
        long classesCount = (long) entityManager.createQuery("SELECT COUNT(cc) FROM CourseClass cc").getSingleResult();
        long unpaidInvoicesCount = (long) entityManager.createQuery(
                "SELECT COUNT(i) FROM TuitionInvoice i WHERE i.status IN (:statuses)")
                .setParameter("statuses", Arrays.asList(InvoiceStatus.UNPAID, InvoiceStatus.PARTIAL))
                .getSingleResult();

        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        Double currentMonthRevenue = (Double) entityManager.createQuery(
                "SELECT SUM(p.paidAmount) FROM Payment p WHERE MONTH(p.paidAt) = :month AND YEAR(p.paidAt) = :year")
                .setParameter("month", currentMonth)
                .setParameter("year", currentYear)
                .getSingleResult();

        return new DashboardStatsResponse(
                studentsCount,
                coursesCount,
                classesCount,
                currentMonthRevenue != null ? currentMonthRevenue.floatValue() : 0f,
                unpaidInvoicesCount
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyRevenueResponse> getMonthlyRevenue(int year) {
        List<MonthlyRevenueResponse> responses = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            Double revenue = (Double) entityManager.createQuery(
                    "SELECT SUM(p.paidAmount) FROM Payment p WHERE MONTH(p.paidAt) = :month AND YEAR(p.paidAt) = :year")
                    .setParameter("month", i)
                    .setParameter("year", year)
                    .getSingleResult();
            responses.add(new MonthlyRevenueResponse(i, revenue != null ? revenue.floatValue() : 0f));
        }
        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseRevenueResponse> getCourseRevenue(int year, Integer month) {
        String queryStr = "SELECT c.name, SUM(p.paidAmount) " +
                "FROM Payment p " +
                "JOIN p.invoice i " +
                "JOIN i.courseClass cc " +
                "JOIN cc.course c " +
                "WHERE YEAR(p.paidAt) = :year ";
        if (month != null) {
            queryStr += "AND MONTH(p.paidAt) = :month ";
        }
        queryStr += "GROUP BY c.id, c.name";

        Query query = entityManager.createQuery(queryStr);
        query.setParameter("year", year);
        if (month != null) {
            query.setParameter("month", month);
        }

        List<Object[]> results = query.getResultList();
        List<CourseRevenueResponse> responses = new ArrayList<>();
        for (Object[] row : results) {
            String courseName = (String) row[0];
            Double revenue = (Double) row[1];
            responses.add(new CourseRevenueResponse(courseName, revenue != null ? revenue.floatValue() : 0f));
        }
        return responses;
    }
}
