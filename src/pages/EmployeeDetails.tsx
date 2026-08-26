import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { User, Mail, Phone, Building, Briefcase, Calendar, Clock, Activity, Edit, ArrowLeft, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Input';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    employees,
    departments,
    activities,
    addActivity,
    updateEmployee,
    setEditingEmployee,
    isEditEmployeeModalOpen,
    setIsEditEmployeeModalOpen,
  } = useAppStore();

  const employee = employees.find((e) => e.id === id);
  const department = departments.find((d) => d.id === employee?.departmentId);
  const employeeActivities = activities.filter((a) => a.employeeId === id || a.employeeId === 'system').sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Employee Not Found</h1>
          <Button onClick={() => navigate('/employees')} className="mt-4">
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveEdit = () => {
    updateEmployee(employee.id, employee);
    setIsEditOpen(false);
    addActivity({
      id: Date.now().toString(),
      employeeId: 'system',
      employeeName: 'System',
      action: 'updated profile',
      description: `Profile for ${employee.firstName} ${employee.lastName} was updated`,
      timestamp: new Date().toISOString(),
      type: 'info',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/employees')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{employee.email}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {employee.firstName} {employee.lastName}
              </h2>
              <Badge variant={employee.status === 'active' ? 'default' : employee.status === 'on_leave' ? 'secondary' : 'destructive'}>
                {employee.status}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400">{employee.role}</p>
            <div className="flex items-center gap-2 mt-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{department?.name || 'N/A'}</span>
            </div>
          </div>
          <Button onClick={() => setIsEditOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                      <p className="font-medium text-slate-900 dark:text-white">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                      <p className="font-medium text-slate-900 dark:text-white">{employee.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
                    <p className="font-medium text-slate-900 dark:text-white">{department?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
                    <p className="font-medium text-slate-900 dark:text-white">{employee.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Hire Date</p>
                    <p className="font-medium text-slate-900 dark:text-white">{employee.hireDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                    <Badge variant={employee.status === 'active' ? 'default' : employee.status === 'on_leave' ? 'secondary' : 'destructive'}>
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employeeActivities.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                      No activity recorded
                    </p>
                  ) : (
                    employeeActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                        <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-amber-500' :
                          activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
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
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Years at Company</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Department</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{department?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{employee.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                    <Badge variant={employee.status === 'active' ? 'default' : employee.status === 'on_leave' ? 'secondary' : 'destructive'}>
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    View Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    View Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee Profile</DialogTitle>
            <DialogDescription>
              Update the employee information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input id="editFirstName" defaultValue={employee.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input id="editLastName" defaultValue={employee.lastName} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input id="editEmail" type="email" defaultValue={employee.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhone">Phone</Label>
              <Input id="editPhone" defaultValue={employee.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDepartment">Department</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={employee.departmentId}>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Input id="editRole" defaultValue={employee.role} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={employee.status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
