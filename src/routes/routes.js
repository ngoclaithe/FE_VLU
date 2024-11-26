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

const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  console.log("Authentication status:", isAuthenticated);
  console.log("User role:", role);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.includes(role)) {
    return children;
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
      <PrivateRoute allowedRoles={['dean']}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/schedule', 
    element: (
      <PrivateRoute allowedRoles={['dean']}>
        <ShiftPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/statistics', 
    element: (
      <PrivateRoute allowedRoles={['dean']}>
        <StatisticalPage />
      </PrivateRoute>
    ),
  },  
  {
    path: '/requests', 
    element: (
      <PrivateRoute allowedRoles={['dean']}>
        <RequestTeacherPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/users', 
    element: (
      <PrivateRoute allowedRoles={['dean']}>
        <UserManagerPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/dashboard-teacher', 
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <DashboardTeacher />
      </PrivateRoute>
    ),
  },
  {
    path: '/schedule-teacher', 
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <ShiftPageTeacher />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher-info', 
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <InfoPageTeacher />
      </PrivateRoute>
    ),
  },
  ,
  {
    path: '/attendance-teacher', 
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <AttendancePageTeacher />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
