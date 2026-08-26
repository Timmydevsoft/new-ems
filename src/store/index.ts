import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Employee,
  Department,
  Request,
  Activity,
  Notification,
  EmployeeFormData,
  DepartmentFormData,
  RequestFormData,
  NotificationPreferences,
} from '../types';

// Sample Data
const initialDepartments: Department[] = [
  { id: '1', name: 'Engineering', description: 'Software development and technical teams', employeeCount: 12, color: 'bg-blue-500' },
  { id: '2', name: 'Marketing', description: 'Brand, content, and digital marketing', employeeCount: 8, color: 'bg-purple-500' },
  { id: '3', name: 'Sales', description: 'Business development and client relations', employeeCount: 6, color: 'bg-green-500' },
  { id: '4', name: 'Human Resources', description: 'Talent acquisition and employee relations', employeeCount: 4, color: 'bg-pink-500' },
  { id: '5', name: 'Finance', description: 'Accounting, budgeting, and financial planning', employeeCount: 5, color: 'bg-amber-500' },
];

const initialEmployees: Employee[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@company.com', phone: '+1 (555) 123-4567', departmentId: '1', role: 'Senior Software Engineer', status: 'active', hireDate: '2022-03-15', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@company.com', phone: '+1 (555) 234-5678', departmentId: '1', role: 'Frontend Developer', status: 'active', hireDate: '2023-01-20', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@company.com', phone: '+1 (555) 345-6789', departmentId: '2', role: 'Marketing Manager', status: 'active', hireDate: '2021-06-10', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@company.com', phone: '+1 (555) 456-7890', departmentId: '3', role: 'Sales Representative', status: 'active', hireDate: '2022-09-05', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', firstName: 'Jessica', lastName: 'Brown', email: 'jessica.brown@company.com', phone: '+1 (555) 567-8901', departmentId: '4', role: 'HR Specialist', status: 'active', hireDate: '2020-11-12', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', firstName: 'David', lastName: 'Martinez', email: 'david.martinez@company.com', phone: '+1 (555) 678-9012', departmentId: '1', role: 'DevOps Engineer', status: 'on_leave', hireDate: '2021-04-18', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', firstName: 'Amanda', lastName: 'Taylor', email: 'amanda.taylor@company.com', phone: '+1 (555) 789-0123', departmentId: '2', role: 'Content Specialist', status: 'active', hireDate: '2023-02-28', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: '8', firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@company.com', phone: '+1 (555) 890-1234', departmentId: '5', role: 'Financial Analyst', status: 'active', hireDate: '2022-07-22', avatar: 'https://i.pravatar.cc/150?u=8' },
  { id: '9', firstName: 'Lisa', lastName: 'Thomas', email: 'lisa.thomas@company.com', phone: '+1 (555) 901-2345', departmentId: '3', role: 'Account Executive', status: 'inactive', hireDate: '2020-08-14', avatar: 'https://i.pravatar.cc/150?u=9' },
  { id: '10', firstName: 'Christopher', lastName: 'Jackson', email: 'chris.jackson@company.com', phone: '+1 (555) 012-3456', departmentId: '1', role: 'Backend Developer', status: 'active', hireDate: '2023-05-01', avatar: 'https://i.pravatar.cc/150?u=10' },
];

const initialRequests: Request[] = [
  { id: '1', employeeId: '1', employeeName: 'Sarah Johnson', type: 'leave', status: 'pending', title: 'Annual Leave Request', description: 'Requesting 2 weeks of annual leave', startDate: '2024-02-15', endDate: '2024-02-29', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', employeeId: '3', employeeName: 'Emily Davis', type: 'equipment', status: 'pending', title: 'New Laptop Request', description: 'Current laptop is outdated, need a new one', amount: 2500, createdAt: '2024-01-14T14:20:00Z' },
  { id: '3', employeeId: '4', employeeName: 'James Wilson', type: 'expense', status: 'approved', title: 'Client Entertainment', description: 'Dinner with potential client', amount: 150, createdAt: '2024-01-10T09:15:00Z' },
  { id: '4', employeeId: '7', employeeName: 'Amanda Taylor', type: 'timeoff', status: 'pending', title: 'Sick Leave', description: 'Need 1 day off due to illness', startDate: '2024-01-20', createdAt: '2024-01-18T11:00:00Z' },
  { id: '5', employeeId: '2', employeeName: 'Michael Chen', type: 'promotion', status: 'pending', title: 'Senior Developer Promotion', description: 'Ready for promotion to Senior Developer', createdAt: '2024-01-12T16:45:00Z' },
];

const initialActivities: Activity[] = [
  { id: '1', employeeId: '1', employeeName: 'Sarah Johnson', action: 'Login', description: 'Logged into the system', timestamp: '2024-01-19T09:00:00Z', type: 'login' },
  { id: '2', employeeId: '3', employeeName: 'Emily Davis', action: 'Updated Profile', description: 'Updated contact information', timestamp: '2024-01-19T08:45:00Z', type: 'update' },
  { id: '3', employeeId: '4', employeeName: 'James Wilson', action: 'Submitted Request', description: 'Submitted expense request', timestamp: '2024-01-19T08:30:00Z', type: 'request' },
  { id: '4', employeeId: '1', employeeName: 'Sarah Johnson', action: 'Code Commit', description: 'Committed changes to main branch', timestamp: '2024-01-19T08:15:00Z', type: 'update' },
  { id: '5', employeeId: '5', employeeName: 'Jessica Brown', action: 'Approval', description: 'Approved leave request for employee', timestamp: '2024-01-19T08:00:00Z', type: 'approval' },
];

const initialNotifications: Notification[] = [
  { id: '1', title: 'New Request', message: 'You have a new leave request to approve', type: 'info', read: false, timestamp: '2024-01-19T09:30:00Z' },
  { id: '2', title: 'System Update', message: 'New features have been deployed', type: 'success', read: false, timestamp: '2024-01-19T08:00:00Z' },
  { id: '3', title: 'Meeting Reminder', message: 'Team meeting in 30 minutes', type: 'warning', read: true, timestamp: '2024-01-19T07:30:00Z' },
];

const initialProfile: Employee = {
  id: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@company.com',
  phone: '+1 (555) 000-0000',
  departmentId: '1',
  role: 'Administrator',
  status: 'active',
  hireDate: '2020-01-01',
  avatar: 'https://i.pravatar.cc/150?u=admin',
};

const initialProfilePreferences: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  leaveRequests: true,
  approvals: true,
  systemUpdates: true,
};

interface AppState {
  // Data
  departments: Department[];
  employees: Employee[];
  requests: Request[];
  activities: Activity[];
  notifications: Notification[];
  
  // Profile
  profile: Employee;
  profilePreferences: NotificationPreferences;
  
  // Form states
  editingEmployee: Employee | null;
  editingDepartment: Department | null;
  selectedEmployee: Employee | null;
  selectedRequest: Request | null;
  selectedDepartment: Department | null;
  
  // UI states
  isAddEmployeeModalOpen: boolean;
  isEditEmployeeModalOpen: boolean;
  isAddDepartmentModalOpen: boolean;
  isEditDepartmentModalOpen: boolean;
  isDeleteConfirmOpen: boolean;
  isRequestDetailsOpen: boolean;
  isApproveRejectOpen: boolean;
  isProfileModalOpen: boolean;
  isNotificationModalOpen: boolean;
  
  // Loading states
  isAddingEmployee: boolean;
  isEditingEmployee: boolean;
  isDeletingEmployee: boolean;
  isAddingDepartment: boolean;
  isEditingDepartment: boolean;
  isDeletingDepartment: boolean;
  isApprovingRequest: boolean;
  isRejectingRequest: boolean;
  isSavingSettings: boolean;
  
  // Filters
  employeeSearch: string;
  employeeDepartmentFilter: string;
  employeeStatusFilter: string;
  requestTypeFilter: string;
  requestStatusFilter: string;
  
  // Pagination
  employeePage: number;
  employeePageSize: number;
  requestPage: number;
  requestPageSize: number;
  
  // Toast
  toasts: Array<{ id: string; title: string; description?: string; type: 'success' | 'error' | 'info' | 'warning' }>;
  
  // Actions
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Employee actions
  setEditingEmployee: (employee: Employee | null) => void;
  setSelectedEmployee: (employee: Employee | null) => void;
  setIsAddEmployeeModalOpen: (open: boolean) => void;
  setIsEditEmployeeModalOpen: (open: boolean) => void;
  setEmployeeSearch: (search: string) => void;
  setEmployeeDepartmentFilter: (filter: string) => void;
  setEmployeeStatusFilter: (filter: string) => void;
  setEmployeePage: (page: number) => void;
  setEmployeePageSize: (size: number) => void;
  setIsAddingEmployee: (open: boolean) => void;
  setIsEditingEmployee: (open: boolean) => void;
  setIsDeletingEmployee: (open: boolean) => void;
  
  // Department actions
  setEditingDepartment: (department: Department | null) => void;
  setIsAddDepartmentModalOpen: (open: boolean) => void;
  setIsEditDepartmentModalOpen: (open: boolean) => void;
  setSelectedDepartment: (department: Department | null) => void;
  setIsDeleteConfirmOpen: (open: boolean) => void;
  setIsAddingDepartment: (open: boolean) => void;
  setIsEditingDepartment: (open: boolean) => void;
  setIsDeletingDepartment: (open: boolean) => void;
  
  // Request actions
  setSelectedRequest: (request: Request | null) => void;
  setIsRequestDetailsOpen: (open: boolean) => void;
  setIsApproveRejectOpen: (open: boolean) => void;
  setRequestTypeFilter: (filter: string) => void;
  setRequestStatusFilter: (filter: string) => void;
  setRequestPage: (page: number) => void;
  setRequestPageSize: (size: number) => void;
  setIsApprovingRequest: (open: boolean) => void;
  setIsRejectingRequest: (open: boolean) => void;
  
  // Profile actions
  setProfile: (profile: Employee) => void;
  updateProfile: (profile: Employee) => void;
  setProfilePreferences: (prefs: NotificationPreferences) => void;
  updateNotificationPreferences: (prefs: NotificationPreferences) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setIsNotificationModalOpen: (open: boolean) => void;
  setIsSavingSettings: (open: boolean) => void;
  
  // Data actions
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  addDepartment: (department: Department) => void;
  updateDepartment: (department: Department) => void;
  deleteDepartment: (id: string) => void;
  addRequest: (request: Request) => void;
  updateRequest: (request: Request) => void;
  deleteRequest: (id: string) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  addActivity: (activity: Activity) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Data
      departments: initialDepartments,
      employees: initialEmployees,
      requests: initialRequests,
      activities: initialActivities,
      notifications: initialNotifications,
      
      // Profile
      profile: initialProfile,
      profilePreferences: initialProfilePreferences,
      
      // Form states
      editingEmployee: null,
      editingDepartment: null,
      selectedEmployee: null,
      selectedRequest: null,
      selectedDepartment: null,
      
      // UI states
      isAddEmployeeModalOpen: false,
      isEditEmployeeModalOpen: false,
      isAddDepartmentModalOpen: false,
      isEditDepartmentModalOpen: false,
      isDeleteConfirmOpen: false,
      isRequestDetailsOpen: false,
      isApproveRejectOpen: false,
      isProfileModalOpen: false,
      isNotificationModalOpen: false,
      
      // Loading states
      isAddingEmployee: false,
      isEditingEmployee: false,
      isDeletingEmployee: false,
      isAddingDepartment: false,
      isEditingDepartment: false,
      isDeletingDepartment: false,
      isApprovingRequest: false,
      isRejectingRequest: false,
      isSavingSettings: false,
      
      // Filters
      employeeSearch: '',
      employeeDepartmentFilter: '',
      employeeStatusFilter: '',
      requestTypeFilter: '',
      requestStatusFilter: '',
      
      // Pagination
      employeePage: 1,
      employeePageSize: 5,
      requestPage: 1,
      requestPageSize: 5,
      
      // Toast
      toasts: [],
      
      // Actions
      addToast: (title, description, type = 'info') =>
        set((state) => ({
          toasts: [...state.toasts, { id: Date.now().toString(), title, description, type }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      
      // Employee actions
      setEditingEmployee: (employee) => set({ editingEmployee: employee }),
      setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
      setIsAddEmployeeModalOpen: (open) => set({ isAddEmployeeModalOpen: open }),
      setIsEditEmployeeModalOpen: (open) => set({ isEditEmployeeModalOpen: open }),
      setEmployeeSearch: (search) => set({ employeeSearch: search }),
      setEmployeeDepartmentFilter: (filter) => set({ employeeDepartmentFilter: filter }),
      setEmployeeStatusFilter: (filter) => set({ employeeStatusFilter: filter }),
      setEmployeePage: (page) => set({ employeePage: page }),
      setEmployeePageSize: (size) => set({ employeePageSize: size }),
      setIsAddingEmployee: (open) => set({ isAddingEmployee: open }),
      setIsEditingEmployee: (open) => set({ isEditingEmployee: open }),
      setIsDeletingEmployee: (open) => set({ isDeletingEmployee: open }),
      
      // Department actions
      setEditingDepartment: (department) => set({ editingDepartment: department }),
      setIsAddDepartmentModalOpen: (open) => set({ isAddDepartmentModalOpen: open }),
      setIsEditDepartmentModalOpen: (open) => set({ isEditDepartmentModalOpen: open }),
      setSelectedDepartment: (department) => set({ selectedDepartment: department }),
      setIsDeleteConfirmOpen: (open) => set({ isDeleteConfirmOpen: open }),
      setIsAddingDepartment: (open) => set({ isAddingDepartment: open }),
      setIsEditingDepartment: (open) => set({ isEditingDepartment: open }),
      setIsDeletingDepartment: (open) => set({ isDeletingDepartment: open }),
      
      // Request actions
      setSelectedRequest: (request) => set({ selectedRequest: request }),
      setIsRequestDetailsOpen: (open) => set({ isRequestDetailsOpen: open }),
      setIsApproveRejectOpen: (open) => set({ isApproveRejectOpen: open }),
      setRequestTypeFilter: (filter) => set({ requestTypeFilter: filter }),
      setRequestStatusFilter: (filter) => set({ requestStatusFilter: filter }),
      setRequestPage: (page) => set({ requestPage: page }),
      setRequestPageSize: (size) => set({ requestPageSize: size }),
      setIsApprovingRequest: (open) => set({ isApprovingRequest: open }),
      setIsRejectingRequest: (open) => set({ isRejectingRequest: open }),
      
      // Profile actions
      setProfile: (profile) => set({ profile }),
      updateProfile: (profile) => set({ profile }),
      setProfilePreferences: (prefs) => set({ profilePreferences: prefs }),
      updateNotificationPreferences: (prefs) => set({ profilePreferences: prefs }),
      setIsProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
      setIsNotificationModalOpen: (open) => set({ isNotificationModalOpen: open }),
      setIsSavingSettings: (open) => set({ isSavingSettings: open }),
      
      // Data actions
      addEmployee: (employee) =>
        set((state) => ({
          employees: [...state.employees, employee],
          activities: [
            ...state.activities,
            {
              id: Date.now().toString(),
              employeeId: employee.id,
              employeeName: `${employee.firstName} ${employee.lastName}`,
              action: 'Added',
              description: `Employee ${employee.firstName} ${employee.lastName} was added`,
              timestamp: new Date().toISOString(),
              type: 'update',
            },
          ],
        })),
      updateEmployee: (id, employee) =>
        set((state) => ({
          employees: state.employees.map((e) => (e.id === id ? employee : e)),
          activities: [
            ...state.activities,
            {
              id: Date.now().toString(),
              employeeId: employee.id,
              employeeName: `${employee.firstName} ${employee.lastName}`,
              action: 'Updated',
              description: `Employee ${employee.firstName} ${employee.lastName} was updated`,
              timestamp: new Date().toISOString(),
              type: 'update',
            },
          ],
        })),
      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
          activities: [
            ...state.activities,
            {
              id: Date.now().toString(),
              employeeId: id,
              employeeName: 'System',
              action: 'Deleted',
              description: 'An employee was deleted',
              timestamp: new Date().toISOString(),
              type: 'departure',
            },
          ],
        })),
      addDepartment: (department) =>
        set((state) => ({
          departments: [...state.departments, department],
        })),
      updateDepartment: (department) =>
        set((state) => ({
          departments: state.departments.map((d) => (d.id === department.id ? department : d)),
        })),
      deleteDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        })),
      addRequest: (request) =>
        set((state) => ({
          requests: [...state.requests, request],
          activities: [
            ...state.activities,
            {
              id: Date.now().toString(),
              employeeId: request.employeeId,
              employeeName: request.employeeName,
              action: 'Request Submitted',
              description: `Submitted ${request.type} request: ${request.title}`,
              timestamp: new Date().toISOString(),
              type: 'request',
            },
          ],
        })),
      updateRequest: (request) =>
        set((state) => ({
          requests: state.requests.map((r) => (r.id === request.id ? request : r)),
        })),
      deleteRequest: (id) =>
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        })),
      approveRequest: (id) =>
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)),
          activities: [
            ...state.activities,
            {
              id: Date.now().toString(),
              employeeId: 'system',
              employeeName: 'System',
              action: 'Approved',
              description: `Request was approved`,
              timestamp: new Date().toISOString(),
              type: 'approval',
            },
          ],
        })),
      rejectRequest: (id) =>
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)),
          activities: [
            ...state.activities,
            {
              id: Date.now().toString(),
              employeeId: 'system',
              employeeName: 'System',
              action: 'Rejected',
              description: `Request was rejected`,
              timestamp: new Date().toISOString(),
              type: 'approval',
            },
          ],
        })),
      addActivity: (activity) =>
        set((state) => ({ activities: [...state.activities, activity] })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    {
      name: 'employee-dashboard-storage',
    }
  )
);
