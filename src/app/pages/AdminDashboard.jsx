import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Clock, Building2, Mail, Phone, Globe, LogOut, Users, Briefcase, Bell, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../../utils/api.js';






const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};
const STATUS_ICONS = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export function AdminDashboard() {


  const [requests, setRequests] = useState([]);
const [stats, setStats] = useState({});
const [pagination, setPagination] = useState({});



  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

 const counts = stats;

const filtered = requests;
const approveRequest = async (req) => {
  await api.post(`/admin/company-requests/${req.id}/approve`);

  fetchRequests(); // reload

  setActionMsg(`✓ ${req.companyName} approved`);
};


const rejectRequest = async (req) => {
  await api.post(`/admin/company-requests/${req.id}/reject`);

  fetchRequests();

  setActionMsg(`✗ ${req.companyName} rejected`);
};



  useEffect(() => {
  fetchRequests();
}, []);

const fetchRequests = async (page = 1, status = 'all') => {
  try {
    const res = await api.get("/admin/dashboard", {
      params: { page, status }
    });

    if (res.data.success) {
      setRequests(res.data.data);
      setStats(res.data.stats);
      setPagination(res.data.pagination);
    }
  } catch (err) {
    console.error(err);
  }
};


function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      {/* <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-white font-bold text-sm">RigWorldJobs</span>
                <span className="text-cyan-400 text-xs ml-2 font-semibold uppercase tracking-wider">Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm hidden sm:block">{user?.name}</span>
              <button
                onClick={() => { logout(); navigate('/admin/login'); }}
                className="flex items-center space-x-1.5 text-slate-400 hover:text-white text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Company Registration Requests</h1>
          <p className="text-slate-500 text-sm">Review, approve or reject company registration requests.</p>
        </div>

        {/* Action toast */}
        <AnimatePresence>
          {actionMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-5 px-5 py-3 rounded-xl text-sm font-semibold border ${actionMsg.startsWith('✓') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}
            >
              {actionMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Total Requests', value: counts.all, icon: Building2, color: 'text-slate-600', bg: 'bg-slate-100' },
            { label: 'Pending', value: counts.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Approved', value: counts.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Rejected', value: counts.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-2 mb-5">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f} {f !== 'all' && <span className="ml-1 opacity-70">({counts[f]})</span>}
            </button>
          ))}
        </div>

        {/* Requests list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No {filter !== 'all' ? filter : ''} requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(req => {
              const StatusIcon = STATUS_ICONS[req.status];
              const isExpanded = expandedId === req.id;
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Row */}
                  <div className="flex items-center justify-between p-5 gap-4">
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{req.companyName}</h3>
                        <p className="text-sm text-slate-500 truncate">{req.contactName} · {req.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Submitted {formatDate(req.submittedAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_STYLES[req.status]}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="capitalize">{req.status}</span>
                      </span>

                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveRequest(req)}
                            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectRequest(req)}
                            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-semibold transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : req.id)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                   {isExpanded && (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="overflow-hidden border-t border-slate-100"
  >
    <div className="p-5 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

      {/* Phone */}
      {req.phone && (
        <div className="flex items-center space-x-2 text-slate-600">
          <Phone className="w-4 h-4 text-slate-400" />
          <span>{req.phone}</span>
        </div>
      )}

      {/* Website */}
      {req.website && (
        <div className="flex items-center space-x-2 text-slate-600">
          <Globe className="w-4 h-4 text-slate-400" />
          <span>{req.website}</span>
        </div>
      )}

      {/* ✅ FIXED INDUSTRY */}
      {req.industry?.name && (
        <div className="flex items-center space-x-2 text-slate-600">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span>{req.industry.name}</span>
        </div>
      )}

      {/* Email */}
      <div className="flex items-center space-x-2 text-slate-600">
        <Mail className="w-4 h-4 text-slate-400" />
        <span>{req.email || "N/A"}</span>
      </div>

      {/* Message */}
      {req.message && (
        <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-3.5">
          <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Message
          </p>
          <p className="text-slate-700 leading-relaxed">
            {req.message}
          </p>
        </div>
      )}

      {/* Approved Info */}
      {req.status === 'approved' && (
        <div className="sm:col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
          <p className="text-xs font-semibold text-emerald-700 mb-1">
            Credentials sent to company
          </p>
          <p className="text-sm text-emerald-800">
            Email: <span className="font-mono font-semibold">{req.email || "N/A"}</span>
          </p>
          <p className="text-sm text-emerald-800">
            Password: <span className="font-mono font-semibold">{req.password || "N/A"}</span>
          </p>
        </div>
      )}

    </div>
  </motion.div>
)}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6 gap-2">
  {[...Array(pagination.last_page || 1)].map((_, i) => (
    <button
      key={i}
      onClick={() => fetchRequests(i + 1)}
      className={`px-3 py-1 rounded ${
        pagination.current_page === i + 1
          ? "bg-black text-white"
          : "bg-gray-200"
      }`}
    >
      {i + 1}
    </button>
  ))}
</div>
    </div>
  );
}
