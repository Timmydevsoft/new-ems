import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, FileText, Settings, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    employees,
    requests,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
  } = useAppStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/departments', icon: Building2, label: 'Departments' },
    { path: '/requests', icon: FileText, label: 'Requests' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">HR Dashboard</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-slate-800 pt-16 px-3 space-y-2 overflow-y-auto max-w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-300 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
            </NavLink>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
          <div className="flex items-center justify-between px-3 py-3">
            <span className="text-sm text-slate-600 dark:text-slate-300">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleMarkAllRead}
          >
            Mark all as read
          </Button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed inset-y-0 left-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white">HR Dashboard</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Employee Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Notifications */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  !notification.read
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-amber-500' :
                  notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">
                No notifications
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
