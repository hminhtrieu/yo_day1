package com.yo.day1.service;

import com.yo.day1.dto.parent.ParentDashboardResponse;

public interface ParentPortalService {
    ParentDashboardResponse getDashboard(String name);
}
