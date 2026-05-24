import { createBrowserRouter, Navigate } from 'react-router-dom';
import RoleGuard from './RoleGuard';

import LandingPage from '@/pages/auth/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import ForbiddenPage from '@/pages/errors/ForbiddenPage';
import NotFoundPage from '@/pages/errors/NotFoundPage';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import RectorDashboard from '@/pages/rector/RectorDashboard';
import ViceRectorDashboard from '@/pages/vice-rector/ViceRectorDashboard';
import DeanDashboard from '@/pages/dean/DeanDashboard';
import DepartmentHeadDashboard from '@/pages/department-head/DepartmentHeadDashboard';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import ProfessorDashboard from '@/pages/professor/ProfessorDashboard';
import MethodologistDashboard from '@/pages/methodologist/MethodologistDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';
import PostgraduateDashboard from '@/pages/postgraduate/PostgraduateDashboard';
import HrDashboard from '@/pages/hr/HrDashboard';
import FinanceDashboard from '@/pages/finance/FinanceDashboard';
import LibrarianDashboard from '@/pages/librarian/LibrarianDashboard';
import ExamCoordinatorDashboard from '@/pages/exam-coordinator/ExamCoordinatorDashboard';
import CounselorDashboard from '@/pages/counselor/CounselorDashboard';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/403', element: <ForbiddenPage /> },
  { path: '/404', element: <NotFoundPage /> },

  {
    path: '/admin',
    element: <RoleGuard allowedRoles={['admin']} />,
    children: [{ index: true, element: <AdminDashboard /> }],
  },
  {
    path: '/rector',
    element: <RoleGuard allowedRoles={['rector']} />,
    children: [{ index: true, element: <RectorDashboard /> }],
  },
  {
    path: '/vice-rector',
    element: <RoleGuard allowedRoles={['vice-rector']} />,
    children: [{ index: true, element: <ViceRectorDashboard /> }],
  },
  {
    path: '/dean',
    element: <RoleGuard allowedRoles={['dean']} />,
    children: [{ index: true, element: <DeanDashboard /> }],
  },
  {
    path: '/department-head',
    element: <RoleGuard allowedRoles={['department-head']} />,
    children: [{ index: true, element: <DepartmentHeadDashboard /> }],
  },
  {
    path: '/teacher',
    element: <RoleGuard allowedRoles={['teacher']} />,
    children: [{ index: true, element: <TeacherDashboard /> }],
  },
  {
    path: '/professor',
    element: <RoleGuard allowedRoles={['professor']} />,
    children: [{ index: true, element: <ProfessorDashboard /> }],
  },
  {
    path: '/methodologist',
    element: <RoleGuard allowedRoles={['methodologist']} />,
    children: [{ index: true, element: <MethodologistDashboard /> }],
  },
  {
    path: '/student',
    element: <RoleGuard allowedRoles={['student']} />,
    children: [{ index: true, element: <StudentDashboard /> }],
  },
  {
    path: '/postgraduate',
    element: <RoleGuard allowedRoles={['postgraduate']} />,
    children: [{ index: true, element: <PostgraduateDashboard /> }],
  },
  {
    path: '/hr',
    element: <RoleGuard allowedRoles={['hr']} />,
    children: [{ index: true, element: <HrDashboard /> }],
  },
  {
    path: '/finance',
    element: <RoleGuard allowedRoles={['finance']} />,
    children: [{ index: true, element: <FinanceDashboard /> }],
  },
  {
    path: '/librarian',
    element: <RoleGuard allowedRoles={['librarian']} />,
    children: [{ index: true, element: <LibrarianDashboard /> }],
  },
  {
    path: '/exam-coordinator',
    element: <RoleGuard allowedRoles={['exam-coordinator']} />,
    children: [{ index: true, element: <ExamCoordinatorDashboard /> }],
  },
  {
    path: '/counselor',
    element: <RoleGuard allowedRoles={['counselor']} />,
    children: [{ index: true, element: <CounselorDashboard /> }],
  },

  { path: '*', element: <NotFoundPage /> },
]);
