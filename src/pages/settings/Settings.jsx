import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfileApi } from '../../api/authApi';
import { HiUser, HiViewGrid, HiViewList, HiViewBoards, HiSave } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const projectView = localStorage.getItem('projectView') || 'card';
  const taskView = localStorage.getItem('taskView') || 'card';

  const [localProjectView, setLocalProjectView] = useState(projectView);
  const [localTaskView, setLocalTaskView] = useState(taskView);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      if (name.trim()) payload.name = name.trim();
      if (email.trim()) payload.email = email.trim();
      if (password) payload.password = password;
      await updateProfileApi(payload);
      toast.success('Profile updated');
      setPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const saveProjectView = (mode) => {
    setLocalProjectView(mode);
    localStorage.setItem('projectView', mode);
    toast.success('Project view preference saved');
  };

  const saveTaskView = (mode) => {
    setLocalTaskView(mode);
    localStorage.setItem('taskView', mode);
    toast.success('Task view preference saved');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage your profile and view preferences</p>
      </div>

      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border dark:border-dark-border">
          <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center">
            <HiUser className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white">Profile</h2>
            <p className="text-sm text-[#64748B]">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
              New Password <span className="text-[#64748B] font-normal">(leave blank to keep current)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              className="input-field bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              disabled
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border dark:border-dark-border">
          <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center">
            <HiSave className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white">View Preferences</h2>
            <p className="text-sm text-[#64748B]">Choose default view modes saved to your browser</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-3">Projects View</label>
            <div className="flex items-center gap-2">
              {[
                { mode: 'card', icon: HiViewGrid, label: 'Card' },
                { mode: 'list', icon: HiViewList, label: 'List' },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => saveProjectView(mode)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                    localProjectView === mode
                      ? 'bg-[#38BDF8] text-white border-[#38BDF8]'
                      : 'bg-white dark:bg-dark-card text-[#64748B] border-border dark:border-dark-border hover:border-[#38BDF8]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-3">Tasks View</label>
            <div className="flex items-center gap-2">
              {[
                { mode: 'card', icon: HiViewGrid, label: 'Card' },
                { mode: 'list', icon: HiViewList, label: 'List' },
                { mode: 'board', icon: HiViewBoards, label: 'Board' },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => saveTaskView(mode)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                    localTaskView === mode
                      ? 'bg-[#38BDF8] text-white border-[#38BDF8]'
                      : 'bg-white dark:bg-dark-card text-[#64748B] border-border dark:border-dark-border hover:border-[#38BDF8]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
