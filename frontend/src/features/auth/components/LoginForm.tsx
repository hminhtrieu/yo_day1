import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import './LoginForm.css';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const res = await login(data);
      const token = (res as any).accessToken || res.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
        navigate('/');
      } else {
        setError('Đăng nhập thất bại: Không nhận được token.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng nhập YOEDU</h2>
        <p className="login-subtitle">Hệ thống quản lý trung tâm tiếng Anh</p>
        
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              {...register('username')}
              placeholder="Nhập tên đăng nhập"
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              {...register('password')}
              placeholder="Nhập mật khẩu"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="login-submit-btn">
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};
