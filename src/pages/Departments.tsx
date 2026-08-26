import { useState } from 'react';
import { useAppStore } from '../store';
import { Building2, Users, Plus, Edit, Trash2, Eye, X, Search, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Input';

export default function Departments() {
  const {
    departments,
    employees,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addActivity,
    setEditingDepartment,
    isEditDepartmentModalOpen,
    setIsEditDepartmentModalOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    isAddDepartmentModalOpen,
    setIsAddDepartmentModalOpen,
    selectedDepartment,
    setSelectedDepartment,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = () => {
    const newDepartment = {
      id: Date.now().toString(),
      name: 'New Department',
      description: 'New department description',
      employeeCount: 0,
      color: 'bg-blue-500',
    };
    addDepartment(newDepartment);
    setIsAddDepartmentModalOpen(false);
  };

  const handleEditDepartment = () => {
    if (selectedDepartment) {
      updateDepartment(selectedDepartment);
      setIsEditDepartmentModalOpen(false);
      setSelectedDepartment(null);
    }
  };

  const handleDeleteDepartment = () => {
    if (selectedDepartment) {
      deleteDepartment(selectedDepartment.id);
      addActivity({
        id: Date.now().toString(),
        employeeId: 'system',
        employeeName: 'System',
        action: 'deleted department',
        description: `Department "${selectedDepartment.name}" was deleted`,
        timestamp: new Date().toISOString(),
        type: 'info',
      });
      setIsDeleteConfirmOpen(false);
      setSelectedDepartment(null);
    }
  };

  const openViewModal = (department: any) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const openEditModal = (department: any) => {
    setEditingDepartment(department);
    setIsEditDepartmentModalOpen(true);
  };

  const openDeleteModal = (departmentId: string) => {
    setSelectedDepartment(departments.find((d) => d.id === departmentId));
    setIsDeleteConfirmOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Departments</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage organizational units</p>
          </div>
          <Button onClick={() => setIsAddDepartmentModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => {
            const deptEmployees = employees.filter((e) => e.departmentId === department.id);
            return (
              <Card key={department.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openViewModal(department)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${department.color} rounded-xl flex items-center justify-center`}>
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); openViewModal(department); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); openEditModal(department); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); openDeleteModal(department.id); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{department.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{department.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      <Users className="w-3 h-3 mr-1" />
                      {deptEmployees.length} employees
                    </Badge>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {department.color.replace('bg-', '')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredDepartments.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No departments found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchQuery ? 'Try a different search term' : 'Create your first department to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddDepartmentModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Department Modal */}
      <Dialog open={isAddDepartmentModalOpen} onOpenChange={setIsAddDepartmentModalOpen}>
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
            <div className="space-y-2">
              <Label htmlFor="deptColor">Color</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="bg-blue-500">Blue</option>
                <option value="bg-green-500">Green</option>
                <option value="bg-purple-500">Purple</option>
                <option value="bg-amber-500">Amber</option>
                <option value="bg-pink-500">Pink</option>
                <option value="bg-cyan-500">Cyan</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDepartmentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment}>
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Modal */}
      <Dialog open={isEditDepartmentModalOpen} onOpenChange={setIsEditDepartmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department information.
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editDeptName">Department Name</Label>
                <Input id="editDeptName" defaultValue={selectedDepartment.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDeptDescription">Description</Label>
                <Input id="editDeptDescription" defaultValue={selectedDepartment.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDeptColor">Color</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={selectedDepartment.color}>
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-green-500">Green</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-amber-500">Amber</option>
                  <option value="bg-pink-500">Pink</option>
                  <option value="bg-cyan-500">Cyan</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDepartmentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedDepartment && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-white">
                  {selectedDepartment.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedDepartment.description}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Department Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {selectedDepartment?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-4 py-4">
              <p className="text-slate-500 dark:text-slate-400">{selectedDepartment.description}</p>
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Employees ({employees.filter((e) => e.departmentId === selectedDepartment.id).length})</h4>
                <div className="space-y-2">
                  {employees.filter((e) => e.departmentId === selectedDepartment.id).map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  ))}
                  {employees.filter((e) => e.departmentId === selectedDepartment.id).length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No employees in this department</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
