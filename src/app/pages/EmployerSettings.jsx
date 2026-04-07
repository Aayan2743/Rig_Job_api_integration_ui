import { useState,useEffect  } from 'react';
import { User, Lock, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

import api from "../../utils/api";
import { showSuccess, showError, showLoading, closeAlert } from "../../utils/alert";



export default function EmployerSettings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('account');
  const [saved, setSaved] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [account, setAccount] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [security, setSecurity] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [secError, setSecError] = useState('');

  const showToast = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };





  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];


  useEffect(() => {
  api.get("/employeer/settings")
    .then(res => {
      const data = res.data.data;

      setAccount({
        name: data.name || "",
        email: data.email || "",
      });
    })
    .catch(err => {
      showError(err.response?.data?.message);
    });
}, []);


const saveAccount = async (e) => {
  e.preventDefault();

  try {
    showLoading("Updating...");

    const res = await api.post("/employeer/settings", {
      name: account.name,
    });

    closeAlert();

    if (res.data.success) {
      showSuccess("Profile updated successfully");
    }

  } catch (err) {
    closeAlert();
    showError(err.response?.data?.errors || err.response?.data?.message);
  }
};


const savePassword = async (e) => {
  e.preventDefault();

  try {
    showLoading("Updating password...");

    const res = await api.post("/employeer/settings/change-password", {
      current_password: security.oldPassword,
      new_password: security.newPassword,
      confirm_password: security.confirm,
    });

    closeAlert();

    if (res.data.success) {
      showSuccess("Password updated successfully");

      setSecurity({
        oldPassword: "",
        newPassword: "",
        confirm: "",
      });
    }

  } catch (err) {
    closeAlert();
    showError(err.response?.data?.errors || err.response?.data?.message);
  }
};

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 font-semibold">
          <CheckCircle className="w-4 h-4" /> Changes saved successfully.
        </div>
      )}

      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-secondary text-white shadow-sm'
                : 'bg-white border border-border text-muted-foreground hover:bg-muted/40'
            }`}>
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'account' && (
        <form onSubmit={saveAccount} className="bg-white rounded-2xl border border-border/60 p-6 space-y-4">
          <h3 className="font-bold text-foreground">Account Information</h3>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
            <input type="text" value={account.name} onChange={e => setAccount(p => ({ ...p, name: e.target.value }))}
              required className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
            <input type="email" value={account.email} disabled
              className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-muted/30 text-muted-foreground cursor-not-allowed" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
          </div>
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-md"
            style={{ background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)' }}>
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={savePassword} className="bg-white rounded-2xl border border-border/60 p-6 space-y-4">
          <h3 className="font-bold text-foreground">Change Password</h3>
          {secError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{secError}</div>
          )}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Current Password</label>
            <div className="relative">
              <input type={showOld ? 'text' : 'password'} value={security.oldPassword}
                onChange={e => setSecurity(p => ({ ...p, oldPassword: e.target.value }))} required
                className="w-full pl-4 pr-11 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={security.newPassword}
                onChange={e => setSecurity(p => ({ ...p, newPassword: e.target.value }))} required
                className="w-full pl-4 pr-11 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Confirm New Password</label>
            <input type="password" value={security.confirm}
              onChange={e => setSecurity(p => ({ ...p, confirm: e.target.value }))} required
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
          </div>
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-md"
            style={{ background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)' }}>
            <Save className="w-4 h-4" /> Update Password
          </button>
        </form>
      )}
    </div>
  );
}