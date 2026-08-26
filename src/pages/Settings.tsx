import { useState } from 'react';
import { useAppStore } from '../store';
import { User, Bell, Mail, Save, X, Shield, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';

export default function Settings() {
  const {
    notifications,
    updateNotificationPreferences,
    updateProfile,
    setProfile,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
  } = useAppStore();

  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const profile = useAppStore((state) => state.profile);
  const profilePreferences = useAppStore((state) => state.profilePreferences);

  const handleSaveProfile = () => {
    updateProfile(profile);
    setIsProfileModalOpen(false);
    setIsSaveSuccess(true);
    setTimeout(() => setIsSaveSuccess(false), 3000);
  };

  const handleSaveNotifications = () => {
    updateNotificationPreferences(profilePreferences);
    setIsNotificationModalOpen(false);
    setIsSaveSuccess(true);
    setTimeout(() => setIsSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
          </div>
          <Button
            onClick={() => setIsNotificationModalOpen(true)}
            variant="outline"
            size="sm"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Success Toast */}
        {isSaveSuccess && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Settings saved successfully!</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {profile?.firstName[0]}{profile?.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {profile?.firstName} {profile?.lastName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileFirstName">First Name</Label>
                      <Input id="profileFirstName" defaultValue={profile?.firstName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileLastName">Last Name</Label>
                      <Input id="profileLastName" defaultValue={profile?.lastName} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileEmail">Email</Label>
                    <Input id="profileEmail" type="email" defaultValue={profile?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePhone">Phone</Label>
                    <Input id="profilePhone" defaultValue={profile?.phone} />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setIsProfileModalOpen(true)}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
                    </div>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Password</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Session Management</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Active sessions: 2</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  Data & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Download Your Data</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Export all your data in CSV format</p>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div>
                      <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                      <p className="text-sm text-red-500 dark:text-red-400">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Account Type</span>
                    <Badge variant="default">Premium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Member Since</span>
                    <span className="font-medium text-slate-900 dark:text-white">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Last Login</span>
                    <span className="font-medium text-slate-900 dark:text-white">Just now</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Timezone</span>
                    <span className="font-medium text-slate-900 dark:text-white">UTC-5 (EST)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Email Notifications</span>
                    <Badge variant={profilePreferences?.emailNotifications ? 'default' : 'secondary'}>
                      {profilePreferences?.emailNotifications ? 'On' : 'Off'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Push Notifications</span>
                    <Badge variant={profilePreferences?.pushNotifications ? 'default' : 'secondary'}>
                      {profilePreferences?.pushNotifications ? 'On' : 'Off'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Leave Requests</span>
                    <Badge variant={profilePreferences?.leaveRequests ? 'default' : 'secondary'}>
                      {profilePreferences?.leaveRequests ? 'On' : 'Off'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Approvals</span>
                    <Badge variant={profilePreferences?.approvals ? 'default' : 'secondary'}>
                      {profilePreferences?.approvals ? 'On' : 'Off'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">System Updates</span>
                    <Badge variant={profilePreferences?.systemUpdates ? 'default' : 'secondary'}>
                      {profilePreferences?.systemUpdates ? 'On' : 'Off'}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setIsNotificationModalOpen(true)}
                >
                  Manage Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Terms of Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Privacy Policy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input id="editFirstName" defaultValue={profile?.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input id="editLastName" defaultValue={profile?.lastName} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input id="editEmail" type="email" defaultValue={profile?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhone">Phone</Label>
              <Input id="editPhone" defaultValue={profile?.phone} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Preferences Modal */}
      <Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>
              Customize how you receive notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-white">Email Notifications</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Leave Requests</span>
                  <Switch
                    checked={profilePreferences?.leaveRequests || false}
                    onCheckedChange={(checked) => {
                      const prefs = { ...profilePreferences, leaveRequests: checked };
                      updateNotificationPreferences(prefs);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Approvals</span>
                  <Switch
                    checked={profilePreferences?.approvals || false}
                    onCheckedChange={(checked) => {
                      const prefs = { ...profilePreferences, approvals: checked };
                      updateNotificationPreferences(prefs);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-sm text-slate-600 dark:text-slate-300">System Updates</span>
                  <Switch
                    checked={profilePreferences?.systemUpdates || false}
                    onCheckedChange={(checked) => {
                      const prefs = { ...profilePreferences, systemUpdates: checked };
                      updateNotificationPreferences(prefs);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-white">Push Notifications</h4>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="text-sm text-slate-600 dark:text-slate-300">Enable Push Notifications</span>
                <Switch
                  checked={profilePreferences?.pushNotifications || false}
                  onCheckedChange={(checked) => {
                    const prefs = { ...profilePreferences, pushNotifications: checked };
                    updateNotificationPreferences(prefs);
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotificationModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotifications}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
