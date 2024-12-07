import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import Dashboard from '../pages/dean/index';
import ShiftPage from '../pages/dean/ShiftPage';
import UserManagerPage from '../pages/dean/UserManagerPage';
import StatisticalPage from '../pages/dean/StatisticalPage';
import RequestTeacherPage from '../pages/dean/RequestTeacherPage';

import ShiftPageTeacher from '../pages/teacher/ShiftPage';
import InfoPageTeacher from '../pages/teacher/InfoPage';
import AttendancePageTeacher from '../pages/teacher/Attendance';
import HistoryPageTeacher from '../pages/teacher/HistoryPage';
import PrivateRoute from './PrivateRoute'; 
const handleLogout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
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
      <PrivateRoute allowedRoles={['dean', 'secretary', 'teacher']}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/schedule', 
    element: (
      <PrivateRoute allowedRoles={['dean', 'secretary']}>
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
      <PrivateRoute allowedRoles={['dean', 'secretary']}>
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
    path: '/schedule-teacher', 
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <ShiftPageTeacher />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher-history', 
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <HistoryPageTeacher />
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
  {
    path: '/attendance-teacher', 
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <AttendancePageTeacher />
      </PrivateRoute>
    ),
  },
  {
    path: '/logout',
    element: handleLogout(),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
