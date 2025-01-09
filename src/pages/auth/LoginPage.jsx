import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getUserInfo } from '../../services/apiAuth';  
import vluLogo from '../../assets/vlu_logo.png'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await loginUser(formData.username, formData.password);
      sessionStorage.setItem('token', response.access_token); 
      const userInfo = await getUserInfo(response.access_token);
      console.log("Gia tri userInfo.role", userInfo.role);
      sessionStorage.setItem('email', userInfo.email); 
      sessionStorage.setItem('role', userInfo.role); 

      if (userInfo.role === 'dean' || userInfo.role === 'secretary' || userInfo.role === 'teacher') {
        console.log('Navigating to /dashboard');
        navigate('/dashboard');  
      } 
      else {
        setError('Bạn không có quyền truy cập trang này.');
        sessionStorage.removeItem('token'); 
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('email');
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <img
            src={vluLogo} 
            alt="Logo"
            className="h-24 w-auto" 
          />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center">
              {error} 
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;