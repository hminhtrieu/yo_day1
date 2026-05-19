package com.yo.day1.service;

import com.yo.day1.dto.auth.*;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(RefreshTokenRequest request);
    void changePassword(String username, ChangePasswordRequest request);
    CurrentUserResponse me(String username);
}
