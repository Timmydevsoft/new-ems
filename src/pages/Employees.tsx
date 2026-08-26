import { useState } from 'react';
import { useAppStore } from '../store';
import { Users, Search, Filter, ChevronDown, ChevronUp, MoreHorizontal, Plus, Eye, Edit, Trash2, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input, Label } from '../components/ui/Input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/DropdownMenu';
import type { Employee } from '../types';

export default function Employees() {
  const {
    employees,
    departments,
    activities,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addActivity,
    setEmployeeSearch,
    setEmployeeDepartmentFilter,
    setEmployeeStatusFilter,
    setEmployeePage,
    setEmployeePageSize,
    employeeSearch,
    employeeDepartmentFilter,
    employeeStatusFilter,
    employeePage,
    employeePageSize,
  } = useAppStore();

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: keyof Employee; direction: 'asc' | 'desc' }>({
    key: 'firstName',
    direction: 'asc',
  });

  const filteredEmployees = employees
    .filter((emp) => {
      const matchesSearch = emp.firstName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.email.toLowerCase().includes(employeeSearch.toLowerCase());
      const matchesDepartment = employeeDepartmentFilter ? emp.departmentId === employeeDepartmentFilter : true;
      const matchesStatus = employeeStatusFilter ? emp.status === employeeStatusFilter : true;
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key]?.toString().toLowerCase();
      const bValue = b[sortConfig.key]?.toString().toLowerCase();
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredEmployees.length / employeePageSize);
  const paginatedEmployees = filteredEmployees.slice(
    (employeePage - 1) * employeePageSize,
    employeePage * employeePageSize
  );

  const handleSort = (key: keyof Employee) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

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

  const handleEditEmployee = () => {
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, selectedEmployee);
      setIsEditEmployeeOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleDeleteEmployee = () => {
    if (deleteEmployeeId) {
      deleteEmployee(deleteEmployeeId);
      addActivity({
        id: Date.now().toString(),
        employeeId: 'system',
        employeeName: 'System',
        action: 'deleted employee',
        description: `Employee with ID ${deleteEmployeeId} was deleted`,
        timestamp: new Date().toISOString(),
        type: 'info',
      });
      setIsDeleteConfirmOpen(false);
      setDeleteEmployeeId(null);
    }
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeOpen(true);
  };

  const openDeleteModal = (employeeId: string) => {
    setDeleteEmployeeId(employeeId);
    setIsDeleteConfirmOpen(true);
  };

  const SortIcon = ({ column }: { column: keyof Employee }) => {
    if (sortConfig.key !== column) return <div className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employees</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your team members</p>
          </div>
          <Button onClick={() => setIsAddEmployeeOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search employees..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div>
                <Label className="text-sm">Department</Label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={employeeDepartmentFilter || ''}
                  onChange={(e) => setEmployeeDepartmentFilter(e.target.value || null)}
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm">Status</Label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={employeeStatusFilter || ''}
                  onChange={(e) => setEmployeeStatusFilter(e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Employees ({filteredEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {[
                      { key: 'firstName', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'department', label: 'Department' },
                      { key: 'role', label: 'Role' },
                      { key: 'status', label: 'Status' },
                      { key: 'hireDate', label: 'Hired' },
                      { key: 'actions', label: 'Actions' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => col.key !== 'actions' && handleSort(col.key as keyof Employee)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <SortIcon column={col.key as keyof Employee} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((employee) => {
                      const dept = departments.find((d) => d.id === employee.departmentId);
                      return (
                        <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {employee.firstName} {employee.lastName}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {employee.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {employee.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {dept ? dept.name : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {employee.role}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={employee.status === 'active' ? 'default' : employee.status === 'on_leave' ? 'secondary' : 'destructive'}>
                              {employee.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {employee.hireDate}
                          </td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditModal(employee)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSelectedEmployee(employee)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => openDeleteModal(employee.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {(employeePage - 1) * employeePageSize + 1} to {Math.min(employeePage * employeePageSize, filteredEmployees.length)} of {filteredEmployees.length} employees
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEmployeePage(Math.max(1, employeePage - 1))}
                    disabled={employeePage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Page {employeePage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEmployeePage(Math.min(totalPages, employeePage + 1))}
                    disabled={employeePage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
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

      {/* Edit Employee Modal */}
      <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update the employee information.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input id="editFirstName" defaultValue={selectedEmployee.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input id="editLastName" defaultValue={selectedEmployee.lastName} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input id="editEmail" type="email" defaultValue={selectedEmployee.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone</Label>
                <Input id="editPhone" defaultValue={selectedEmployee.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Department</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={selectedEmployee.departmentId}>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Input id="editRole" defaultValue={selectedEmployee.role} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={selectedEmployee.status}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEmployeeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditEmployee}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedEmployee && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-white">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEmployee.email}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEmployee}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
