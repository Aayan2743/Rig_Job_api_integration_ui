import { useState,useEffect } from 'react';
import { Building2, CheckCircle, XCircle, Clock, Phone, Globe, Mail, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from "../../utils/api";

import {
  showSuccess,
  showError,
  showConfirm,
  showLoading,
  closeAlert
} from "../../utils/alert";



const REQUESTS_KEY = 'rwj_company_requests';
const USERS_KEY = 'rwj_users';
const NOTIFICATIONS_KEY = 'rwj_notifications';

// function getRequests() {
//   try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]'); } catch { return []; }
// }
// function saveRequests(r) { localStorage.setItem(REQUESTS_KEY, JSON.stringify(r)); }
// function getUsers() {
//   try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
// }
// function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
// function getNotifications() {
//   try { return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]'); } catch { return []; }
// }



function saveNotifications(n) { localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(n)); }

function fmt(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_STYLE = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};
const STATUS_ICON = { pending: Clock, approved: CheckCircle, rejected: XCircle };

export function CompanyRequests() {

  const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);

const [rejectModal, setRejectModal] = useState({
  open: false,
  company: null,
  remark: ""
});

  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
const [lastPage, setLastPage] = useState(1);
const [search, setSearch] = useState("");

  const counts = {
    all: requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };


const approve = async (req) => {
  const confirm = await showConfirm(
    `Approve ${req.company_name}?`
  );

  if (!confirm) return;

  try {
    showLoading("Approving...");

    await api.post(`/admin/company-requests/approve/${req.id}`);

    closeAlert();

    const updated = requests.map(r =>
      r.id === req.id
        ? { ...r, status: "approved", approvedAt: new Date().toISOString() }
        : r
    );

    setRequests(updated);

    showSuccess(`${req.company_name} approved successfully 🎉`);

  } catch (err) {
    closeAlert();
    showError(err.response?.data?.message || "Approve failed");
  }
};



const handleRejectSubmit = async () => {
  if (!rejectModal.remark.trim()) {
    showError("Remark is required");
    return;
  }

  try {
    showLoading("Rejecting...");

    const req = rejectModal.company;

    await api.post(`/admin/company-requests/reject/${req.id}`, {
      remark: rejectModal.remark,
    });

    closeAlert();

    const updated = requests.map(r =>
      r.id === req.id
        ? {
            ...r,
            status: "rejected",
            remark: rejectModal.remark,
            rejectedAt: new Date().toISOString()
          }
        : r
    );

    setRequests(updated);

    setRejectModal({ open: false, company: null, remark: "" });

    showSuccess(`${req.company_name} rejected ❌`);

  } catch (err) {
    closeAlert();
    showError(err.response?.data?.message || "Reject failed");
  }
};


useEffect(() => {
  fetchRequests(currentPage, search);
}, [currentPage]);

const fetchRequests = async (page = 1, searchTerm = "") => {
  try {
    const res = await api.get("/admin/company-requests", {
      params: {
        page: page,
        search: searchTerm,
      },
    });

    if (res.data.success) {
      setRequests(res.data.data);
      setCurrentPage(res.data.pagination.current_page);
      setLastPage(res.data.pagination.last_page);
    }
  } catch (err) {
    console.error("Error fetching requests:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Company Registration Requests</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Review and approve or reject company sign-up requests.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

  <input
    type="text"
    placeholder="Search company or contact..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
      fetchRequests(1, e.target.value);
    }}
    className="border px-4 py-2 rounded-xl w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

</div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`px-5 py-3 rounded-xl text-sm font-semibold border ${toast.startsWith('✓') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.all, icon: Building2, color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'Pending',  value: counts.pending,  icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'Approved', value: counts.approved, icon: CheckCircle,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Rejected', value: counts.rejected, icon: XCircle,       color: 'text-red-600',     bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              filter === f ? 'bg-secondary text-white shadow-sm' : 'bg-white border border-border text-muted-foreground hover:bg-muted/40'
            }`}
          >
            {f}{f !== 'all' && ` (${counts[f]})`}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/60 p-12 text-center text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No {filter !== 'all' ? filter : ''} requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => {
            const Icon = STATUS_ICON[req.status];
            const expanded = expandedId === req.id;
            return (
              <motion.div key={req.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 gap-4 flex-wrap">
                  <div className="flex items-center space-x-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground truncate">{req.company_name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{req.contact_person} · {req.users?.email}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">Submitted {fmt(req.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_STYLE[req.status]}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span className="capitalize">{req.status}</span>
                    </span>

                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => approve(req)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        {/* <button onClick={() => reject(req)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-semibold transition-all">
                          <XCircle className="w-4 h-4" /> Reject
                        </button> */}

                            {/* <button onClick={() => reject(req)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-semibold transition-all">
                          <XCircle className="w-4 h-4" /> Reject
                        </button> */}

                        <button onClick={() => setRejectModal({
                          open: true,
                          company: req,
                          remark: ""
                        })}
                         className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-semibold transition-all"
                        >
                            <XCircle className="w-4 h-4" />


                        </button>
                      </>
                    )}

                    <button onClick={() => setExpandedId(expanded ? null : req.id)}
                      className="p-2 rounded-xl border border-border hover:bg-muted/40 text-muted-foreground transition-all">
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border/60">
                      <div className="p-5 bg-muted/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {req.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4 text-muted-foreground/60" />{req.phone}</div>}
                        {req.website && <div className="flex items-center gap-2 text-muted-foreground"><Globe className="w-4 h-4 text-muted-foreground/60" />{req.website}</div>}
                        {req.industry?.name && <div className="flex items-center gap-2 text-muted-foreground"><Briefcase className="w-4 h-4 text-muted-foreground/60" />{req.industry?.name}</div>}
                        <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4 text-muted-foreground/60" />{req.users?.email}</div>
                        {req.message && (
                          <div className="sm:col-span-2 bg-white border border-border/60 rounded-xl p-3.5">
                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Message</p>
                            <p className="text-foreground leading-relaxed">{req.message}</p>
                          </div>
                        )}

                        {req.remark && (
                          <div className="sm:col-span-2 bg-white border border-border/60 rounded-xl p-3.5">
                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Reject Reasons</p>
                            <p className="text-foreground leading-relaxed">{req.remark}</p>
                          </div>
                        )}
                        {req.status === 'approved' && (
                          <div className="sm:col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                            <p className="text-xs font-semibold text-emerald-700 mb-1">Credentials sent to company</p>
                            <p className="text-sm text-emerald-800">users?.email: <span className="font-mono font-semibold">{req.users?.email}</span></p>
                            <p className="text-sm text-emerald-800">Password: <span className="font-mono font-semibold">{req.password}</span></p>
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


      {rejectModal.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

      <h2 className="text-lg font-bold mb-2">Reject Company</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter reason for rejecting <b>{rejectModal.company?.company_name}</b>
      </p>

      <textarea
        value={rejectModal.remark}
        onChange={(e) =>
          setRejectModal({ ...rejectModal, remark: e.target.value })
        }
        placeholder="Enter rejection reason..."
        className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        rows={4}
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() =>
            setRejectModal({ open: false, company: null, remark: "" })
          }
          className="px-4 py-2 rounded-xl border text-sm"
        >
          Cancel
        </button>

        <button
          onClick={handleRejectSubmit}
          className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
        >
          Reject
        </button>
      </div>

    </div>
  </div>
    )}


    <div className="flex justify-center items-center gap-3 mt-6">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="px-4 py-2 rounded-xl border text-sm disabled:opacity-50 hover:bg-gray-100"
  >
    Prev
  </button>

  <span className="text-sm font-semibold">
    Page {currentPage} of {lastPage}
  </span>

  <button
    disabled={currentPage === lastPage}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="px-4 py-2 rounded-xl border text-sm disabled:opacity-50 hover:bg-gray-100"
  >
    Next
  </button>

</div>
    </div>
  );
}
