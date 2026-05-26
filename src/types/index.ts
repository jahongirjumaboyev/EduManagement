export type Role =
  | 'admin'
  | 'rector'
  | 'vice-rector'
  | 'dean'
  | 'department-head'
  | 'teacher'
  | 'professor'
  | 'methodologist'
  | 'student'
  | 'postgraduate'
  | 'hr'
  | 'finance'
  | 'librarian'
  | 'exam-coordinator'
  | 'counselor'
  | 'head';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
