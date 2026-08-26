// Employee types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  role: string;
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: string;
  avatar?: string;
}

// Department types
export interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  color: string;
}

// Request types
export interface Request {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'leave' | 'equipment' | 'expense' | 'timeoff' | 'promotion';
  status: 'pending' | 'approved' | 'rejected';
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
  createdAt: string;
}

// Activity types
export interface Activity {
  id: string;
  employeeId: string;
  employeeName: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'login' | 'update' | 'request' | 'approval' | 'departure' | 'info' | 'success' | 'warning' | 'error';
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

// Form types
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  role: string;
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: string;
}

export interface DepartmentFormData {
  name: string;
  description: string;
  color: string;
}

export interface RequestFormData {
  type: 'leave' | 'equipment' | 'expense' | 'timeoff' | 'promotion';
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  leaveRequests: boolean;
  approvals: boolean;
  systemUpdates: boolean;
}
