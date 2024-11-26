import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import Dashboard from '../pages/dean/index';
import ShiftPage from '../pages/dean/ShiftPage';
import UserManagerPage from '../pages/dean/UserManagerPage';
import StatisticalPage from '../pages/dean/StatisticalPage';
import RequestTeacherPage from '../pages/dean/RequestTeacherPage';

import DashboardTeacher from '../pages/teacher/index';
import ShiftPageTeacher from '../pages/teacher/ShiftPage';
import InfoPageTeacher from '../pages/teacher/InfoPage';
import AttendancePageTeacher from '../pages/teacher/Attendance';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const role = localStorage.getItem('role');  
  console.log("Gia tri role hiện tại trong route", role);

  if (role === 'dean') {
    return children; 
  }

  if (role === 'teacher') {
    return <Navigate to="/dashboard-teacher" replace />; 
  }

  return <Navigate to="/" replace />; 
};

export const routes = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/schedule', 
    element: (
      <PrivateRoute>
        <ShiftPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/statistics', 
    element: (
      <PrivateRoute>
        <StatisticalPage />
      </PrivateRoute>
    ),
  },  
  {
    path: '/requests', 
    element: (
      <PrivateRoute>
        <RequestTeacherPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/users', 
    element: (
      <PrivateRoute>
        <UserManagerPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/dashboard-teacher', 
    element: (
      <PrivateRoute>
        <DashboardTeacher />
      </PrivateRoute>
    ),
  },
  {
    path: '/schedule-teacher', 
    element: (
      <PrivateRoute>
        <ShiftPageTeacher />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher-info', 
    element: (
      <PrivateRoute>
        <InfoPageTeacher />
      </PrivateRoute>
    ),
  },
  ,
  {
    path: '/attendance-teacher', 
    element: (
      <PrivateRoute>
        <AttendancePageTeacher />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
