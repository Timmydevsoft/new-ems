import { useState } from 'react';
import { useAppStore } from '../store';
import { FileText, Search, Filter, ChevronDown, MoreHorizontal, CheckCircle, XCircle, Eye, Edit, Trash2, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/DropdownMenu';

export default function Requests() {
  const {
    requests,
    employees,
    departments,
    approveRequest,
    rejectRequest,
    deleteRequest,
    addActivity,
    setRequestTypeFilter,
    setRequestStatusFilter,
    setRequestPage,
    setRequestPageSize,
    requestTypeFilter,
    requestStatusFilter,
    requestPage,
    requestPageSize,
    setSelectedRequest,
    setIsRequestDetailsOpen,
    setIsApproveRejectOpen,
    isApproveRejectOpen,
    selectedRequest,
  } = useAppStore();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);

  const filteredRequests = requests
    .filter((req) => {
      const matchesType = requestTypeFilter ? req.type === requestTypeFilter : true;
      const matchesStatus = requestStatusFilter ? req.status === requestStatusFilter : true;
      return matchesType && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.ceil(filteredRequests.length / requestPageSize);
  const paginatedRequests = filteredRequests.slice(
    (requestPage - 1) * requestPageSize,
    requestPage * requestPageSize
  );

  const handleApproveRequest = () => {
    if (selectedRequest) {
      approveRequest(selectedRequest.id);
      addActivity({
        id: Date.now().toString(),
        employeeId: selectedRequest.employeeId,
        employeeName: selectedRequest.employeeName,
        action: 'approved request',
        description: `Request "${selectedRequest.title}" was approved`,
        timestamp: new Date().toISOString(),
        type: 'success',
      });
      setIsApproveRejectOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleRejectRequest = () => {
    if (selectedRequest) {
      rejectRequest(selectedRequest.id);
      addActivity({
        id: Date.now().toString(),
        employeeId: selectedRequest.employeeId,
        employeeName: selectedRequest.employeeName,
        action: 'rejected request',
        description: `Request "${selectedRequest.title}" was rejected`,
        timestamp: new Date().toISOString(),
        type: 'warning',
      });
      setIsApproveRejectOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleDeleteRequest = () => {
    if (deleteRequestId) {
      deleteRequest(deleteRequestId);
      addActivity({
        id: Date.now().toString(),
        employeeId: 'system',
        employeeName: 'System',
        action: 'deleted request',
        description: `Request with ID ${deleteRequestId} was deleted`,
        timestamp: new Date().toISOString(),
        type: 'info',
      });
      setIsDeleteConfirmOpen(false);
      setDeleteRequestId(null);
    }
  };

  const openApproveRejectModal = (request: any) => {
    setSelectedRequest(request);
    setIsApproveRejectOpen(true);
  };

  const openDeleteModal = (requestId: string) => {
    setDeleteRequestId(requestId);
    setIsDeleteConfirmOpen(true);
  };

  const getEmployee = (employeeId: string) => employees.find((e) => e.id === employeeId);
  const getDepartment = (departmentId: string) => departments.find((d) => d.id === departmentId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Requests</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage employee requests</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              <FileText className="w-3 h-3 mr-1" />
              {filteredRequests.length} total
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">Request Type</Label>
                <select
                  className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm"
                  value={requestTypeFilter || ''}
                  onChange={(e) => setRequestTypeFilter(e.target.value || null)}
                >
                  <option value="">All Types</option>
                  <option value="leave">Leave Request</option>
                  <option value="equipment">Equipment Request</option>
                  <option value="expense">Expense Request</option>
                  <option value="timeoff">Time Off</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>
              <div>
                <Label className="text-sm">Status</Label>
                <select
                  className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm"
                  value={requestStatusFilter || ''}
                  onChange={(e) => setRequestStatusFilter(e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
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

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {[
                      { key: 'employee', label: 'Employee' },
                      { key: 'type', label: 'Type' },
                      { key: 'title', label: 'Title' },
                      { key: 'status', label: 'Status' },
                      { key: 'createdAt', label: 'Created' },
                      { key: 'actions', label: 'Actions' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                        No requests found
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((request) => {
                      const employee = getEmployee(request.employeeId);
                      return (
                        <tr key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {employee?.firstName[0]}{employee?.lastName[0]}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {employee?.firstName} {employee?.lastName}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {getDepartment(request.employeeId)?.name || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="capitalize">{request.type}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {request.title}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={
                              request.status === 'approved' ? 'default' :
                              request.status === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {request.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openApproveRejectModal(request)}>
                                  {request.status === 'pending' ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => openDeleteModal(request.id)}
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
                  Showing {(requestPage - 1) * requestPageSize + 1} to {Math.min(requestPage * requestPageSize, filteredRequests.length)} of {filteredRequests.length} requests
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRequestPage(Math.max(1, requestPage - 1))}
                    disabled={requestPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Page {requestPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRequestPage(Math.min(totalPages, requestPage + 1))}
                    disabled={requestPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve/Reject Modal */}
      <Dialog open={isApproveRejectOpen} onOpenChange={setIsApproveRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.status === 'pending' ? 'Approve Request' : 'View Request Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.status === 'pending'
                ? 'Review and approve or reject this request.'
                : 'View the details of this request.'}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">{selectedRequest.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedRequest.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Employee</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {getEmployee(selectedRequest.employeeId)?.firstName} {getEmployee(selectedRequest.employeeId)?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Type</p>
                  <p className="font-medium text-slate-900 dark:text-white capitalize">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Created</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                  <Badge variant={
                    selectedRequest.status === 'approved' ? 'default' :
                    selectedRequest.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedRequest?.status === 'pending' ? (
              <>
                <Button variant="outline" onClick={() => setIsApproveRejectOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRejectRequest}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsApproveRejectOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRequest && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-white">
                  {selectedRequest.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedRequest.description}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRequest}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
