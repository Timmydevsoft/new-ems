import { useState } from 'react';
import { useAppStore } from '../store';
import type { Employee, Request } from '../types';
import { Users, Building2, FileText, TrendingUp, Clock, Bell, Plus, UserPlus, Briefcase, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input, Label } from '../components/ui/Input';

export default function Dashboard() {
  const {
    employees,
    departments,
    requests,
    activities,
    notifications,
    addEmployee,
    addDepartment,
    addRequest,
    markAllNotificationsRead,
  } = useAppStore();

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);

  const activeEmployees = employees.filter((e) => e.status === 'active').length;
  const totalEmployees = employees.length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  const recentActivities = activities.slice(0, 5);
  const recentNotifications = notifications.slice(0, 5);

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      firstName: 'New',
      lastName: 'Employee',
      email: 'new@company.com',
      phone: '+1 (555) 000-0000',
      departmentId: departments[0]?.id || '',
      role: 'New Role',
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      avatar: 'https://i.pravatar.cc/150?u=new',
    };
    addEmployee(newEmployee);
    setIsAddEmployeeOpen(false);
  };

  const handleAddDepartment = () => {
    const newDepartment = {
      id: Date.now().toString(),
      name: 'New Department',
      description: 'New department description',
      employeeCount: 0,
      color: 'bg-blue-500',
    };
    addDepartment(newDepartment);
    setIsAddDepartmentOpen(false);
  };

  const handleAddRequest = () => {
    const newRequest: Request = {
      id: Date.now().toString(),
      employeeId: employees[0]?.id || '',
      employeeName: employees[0]?.firstName || 'Employee',
      type: 'leave',
      status: 'pending',
      title: 'New Request',
      description: 'New request description',
      createdAt: new Date().toISOString(),
    };
    addRequest(newRequest);
    setIsAddRequestOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
              <Bell className="w-4 h-4 mr-2" />
              {unreadCount > 0 ? `${unreadCount} unread` : 'Notifications'}
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsAddEmployeeOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Employees</CardTitle>
              <Users className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalEmployees}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across all departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Employees</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{activeEmployees}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Departments</CardTitle>
              <Building2 className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{departments.length}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Organizational units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Requests</CardTitle>
              <FileText className="w-5 h-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{pendingRequests}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsAddEmployeeOpen(true)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Add Employee</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Add a new team member</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsAddDepartmentOpen(true)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Add Department</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Create a new department</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsAddRequestOpen(true)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Submit Request</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Create a new request</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-slate-500">
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.employeeName}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{activity.action}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Notifications</CardTitle>
                <Button variant="ghost" size="sm" className="text-slate-500" onClick={markAllNotificationsRead}>
                  Mark all read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-amber-500' :
                        notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentNotifications.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                    No notifications
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Department Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((department) => (
                <div key={department.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{department.name}</h4>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{department.employeeCount} employees</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{department.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Employee Modal */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new employee to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="Software Engineer" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee}>
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Department Modal */}
      <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new department for your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deptName">Department Name</Label>
              <Input id="deptName" placeholder="Engineering" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deptDescription">Description</Label>
              <Input id="deptDescription" placeholder="Software development and technical teams" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment}>
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Request Modal */}
      <Dialog open={isAddRequestOpen} onOpenChange={setIsAddRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit New Request</DialogTitle>
            <DialogDescription>
              Create a new request for your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="requestType">Request Type</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="leave">Leave Request</option>
                <option value="equipment">Equipment Request</option>
                <option value="expense">Expense Request</option>
                <option value="timeoff">Time Off</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestTitle">Title</Label>
              <Input id="requestTitle" placeholder="Annual Leave Request" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestDescription">Description</Label>
              <Input id="requestDescription" placeholder="Describe your request" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRequestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
