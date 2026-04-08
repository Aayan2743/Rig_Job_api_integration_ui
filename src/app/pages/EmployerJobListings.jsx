import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Eye, Clock, MapPin, Users, TrendingUp, Edit, Pause, Play, Trash2, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState,useEffect  } from 'react';
import { useJobs } from '../context/JobsContext.jsx';


import api from '../../utils/api.js'; 

const statusBadge = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Paused: 'bg-amber-50 text-amber-700 border-amber-100',
  Closed: 'bg-gray-50 text-gray-600 border-gray-100',
};



export function EmployerJobListings() {

 const [jobs, setJobs] = useState([]);
const [counts, setCounts] = useState({});
const [pagination, setPagination] = useState({}); 



  // const { jobs, toggleStatus, deleteJob } = useJobs();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeCard, setActiveCard] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('All');

  const companies = [
  'All',
    ...Array.from(new Map(jobs.map(j => [j.company?.id, j.company])).values())
  ];


const filtered = jobs;
  // ✅ FIX: Detect if we're in admin or company context
  const { pathname } = useLocation();
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/company';

  // const filtered = jobs.filter(j => {
  //   if (filterStatus !== 'All' && j.status !== filterStatus) return false;
  //   if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
  //   return true;
  // });


  const totals = {
  jobs: counts.jobs || 0,
  active: counts.active || 0,
  applicants: counts.applicants || 0,
  views: counts.views || 0,
  companies: counts.companies || 0,
};


const mapStatus = (status) => {
  if (status === 'published') return 'Active';
  if (status === 'closed') return 'Closed';
  if (status === 'draft') return 'Paused';
  return status;
};




  const handleCardClick = (label) => {
    setActiveCard(prev => (prev === label ? null : label));
  };

  const cardDetailJobs = activeCard
    ? [...jobs].filter(CARD_CONFIG[activeCard].filterFn).sort(CARD_CONFIG[activeCard].sortFn)
    : [];



;


const statusMap = {
  Active: 'published',
  Paused: 'draft',
  Closed: 'closed',
};

const fetchJobs = async (page = 1) => {
  const res = await api.get('/admin/jobs/list-all-jobs', {
    params: {
      page,
      search,
      status:
        filterStatus !== 'All'
          ? statusMap[filterStatus]   // ✅ HERE
          : '',
      company_id: selectedCompany !== 'All' ? selectedCompany : '',
    }
  });

  setJobs(res.data.data);
  setCounts(res.data.counts);
  setPagination(res.data.pagination);
};

useEffect(() => {
  fetchJobs(1);
}, [search, filterStatus, selectedCompany]);


  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { icon: Briefcase,  label: 'Total Jobs',       value: totals.jobs,       color: 'text-primary',     bg: 'bg-primary/8'  },
          { icon: TrendingUp, label: 'Active',           value: totals.active,     color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: Users,      label: 'Total Applicants', value: totals.applicants, color: 'text-purple-600',  bg: 'bg-purple-50'  },
          { icon: Eye,        label: 'Total Views',      value: totals.views,      color: 'text-amber-500',   bg: 'bg-amber-50'   },
            { icon: Users,      label: 'Companies',        value: totals.companies,  color: 'text-blue-600',    bg: 'bg-blue-50'    },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => handleCardClick(s.label)}
            className={`bg-white rounded-2xl border p-4 shadow-sm cursor-pointer select-none transition-all hover:shadow-md
              ${activeCard === s.label
                ? 'border-secondary ring-2 ring-secondary/20'
                : 'border-border/60 hover:border-border'
              }`}
          >
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Card detail panel */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div>
                <h2 className="text-base font-bold text-foreground">{activeCard}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cardDetailJobs.length} {cardDetailJobs.length === 1 ? 'job' : 'jobs'} · {CARD_CONFIG[activeCard].sortLabel}
                </p>
              </div>
              <button
                onClick={() => setActiveCard(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary strip for Applicants / Views */}
            {(activeCard === 'Total Applicants' || activeCard === 'Total Views') && jobs.length > 0 && (
              <div className="grid grid-cols-3 gap-3 px-5 py-4 border-b border-border/60">
                {activeCard === 'Total Applicants' && [
                  { label: 'Total applicants',   val: totals.applicants },
                  { label: 'Highest on one job', val: Math.max(...jobs.map(j => j.applicants)) },
                  { label: 'Avg per job',        val: Math.round(totals.applicants / jobs.length) },
                ].map(s => (
                  <div key={s.label} className="bg-muted/30 rounded-xl px-4 py-3">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-foreground">{s.val}</p>
                  </div>
                ))}
                {activeCard === 'Total Views' && [
                  { label: 'Total views',        val: totals.views.toLocaleString() },
                  { label: 'Highest on one job', val: Math.max(...jobs.map(j => j.views)).toLocaleString() },
                  { label: 'Avg per job',        val: Math.round(totals.views / jobs.length).toLocaleString() },
                ].map(s => (
                  <div key={s.label} className="bg-muted/30 rounded-xl px-4 py-3">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-foreground">{s.val}</p>
                  </div>
                ))}
              </div>
            )}

            {cardDetailJobs.length === 0 ? (
              <div className="px-5 py-10 text-center text-muted-foreground text-sm">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-30" />
                {CARD_CONFIG[activeCard].emptyMsg}
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {cardDetailJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/10 transition-colors gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground truncate">{job.title}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusBadge[mapStatus(job.status)]}`}>
                          {mapStatus(job.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /><strong className="text-foreground">{job.applicants}</strong> applicants</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /><strong className="text-foreground">{job.views}</strong> views</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Expires {job.expires}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted/40 rounded-full overflow-hidden max-w-36">
                          <div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min((job.applicants / 70) * 100, 100)}%` }} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{job.applicants}/70 target</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {/* ✅ FIX: Use basePath so admin goes to /admin/jobs/... and company to /company/jobs/... */}
                      <Link
                        to={`${basePath}/jobs/${job.id}/applicants`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:shadow-md"
                        style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
                      >
                        Applicants
                      </Link>
                      <button onClick={() => toggleStatus(job.id)} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors" title={job.status === 'Active' ? 'Pause' : 'Activate'}>
                        {job.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => deleteJob(job.id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filter */}
   
   <div className="flex flex-col sm:flex-row gap-3">

  {/* 🔍 Search */}
  <div className="flex-1 flex items-center bg-white border border-border rounded-xl px-4 py-3 focus-within:border-secondary/50 transition-all">
    <Search className="w-4 h-4 text-muted-foreground mr-2" />
    <input
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search your jobs..."
      className="bg-transparent outline-none text-sm flex-1 text-foreground"
    />
  </div>

  {/* 🏢 Company Filter */}
  <select
    value={selectedCompany}
    onChange={(e) => setSelectedCompany(e.target.value === 'All' ? 'All' : Number(e.target.value))}
    className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:outline-none focus:border-secondary"
  >
    {companies.map((c, i) => (
      <option key={i} value={c === 'All' ? 'All' : c?.id}>
        {c === 'All' ? 'All Companies' : c?.company_name}
      </option>
    ))}
  </select>

  {/* 📊 Status Filter */}
  <div className="flex gap-2">
    {['All', 'Active', 'Paused', 'Closed'].map(s => (
      <button
        key={s}
        onClick={() => setFilterStatus(s)}
        className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
          filterStatus === s
            ? 'text-white border-secondary shadow-sm'
            : 'border-border text-muted-foreground bg-white hover:border-secondary/30'
        }`}
        style={filterStatus === s ? { background: 'linear-gradient(135deg, #0891B2, #0E7490)' } : {}}
      >
        {s}
      </button>
    ))}
  </div>

</div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <div className="divide-y divide-border/50">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-semibold text-foreground">No jobs found</p>
              <Link to="/employer/post-job" className="text-secondary hover:underline text-sm font-semibold mt-2 block">Post your first job</Link>
            </div>
          ) : filtered.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="p-5 hover:bg-muted/10 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="flex-1 min-w-0">

  {/* 🔥 Title + Company + Status */}
  <div className="flex flex-wrap items-center gap-2 mb-2">

    {/* Job Title */}
    <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
      {job.title}
    </h3>

    {/* Company Badge */}
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
      🏢 {job.company?.company_name || 'Unknown'}
    </span>

    {/* Status Badge */}
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
        statusBadge[mapStatus(job.status)]
      }`}
    >
      {mapStatus(job.status)}
    </span>

    {/* Job Type */}
    <span className="text-[11px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
      {job.job_type}
    </span>
  </div>

  {/* 📊 Meta Info */}
  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">

    <span className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-lg">
      <MapPin className="w-3 h-3" />
      {job.location}
    </span>

    <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">
      <Users className="w-3 h-3" />
      <strong>{job.applicants}</strong> applicants
    </span>

    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
      <Eye className="w-3 h-3" />
      <strong>{job.views}</strong> views
    </span>

    <span className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-lg">
      <Clock className="w-3 h-3" />
      Expires {job.expires || 'N/A'}
    </span>

  </div>

  {/* 📈 Progress */}
  <div className="mt-3 flex items-center gap-2">

    <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden max-w-40">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
        style={{
          width: `${Math.min((job.applicants / 70) * 100, 100)}%`
        }}
      />
    </div>

    <span className="text-[11px] text-muted-foreground">
      {job.applicants}/70 target
    </span>

  </div>

</div>


                <div className="flex gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
                  {/* ✅ FIX: Use basePath so admin goes to /admin/jobs/... and company to /company/jobs/... */}
                  <Link
                    to={`${basePath}/jobs/${job.id}/applicants`}
                    className="px-3.5 py-2 rounded-lg text-sm font-semibold text-white shine-effect hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
                  >
                    Applicants
                  </Link>
                  {/* <button className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggleStatus(job.id)} className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors" title={job.status === 'Active' ? 'Pause' : 'Activate'}>
                    {job.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => deleteJob(job.id)} className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4 justify-center">
  {[...Array(pagination.last_page || 1)].map((_, i) => (
    <button
      key={i}
      onClick={() => fetchJobs(i + 1)}
      className={`px-3 py-1 rounded ${
        pagination.current_page === i + 1
          ? 'bg-secondary text-white'
          : 'bg-gray-100'
      }`}
    >
      {i + 1}
    </button>
  ))}
</div>
    </div>
  );
}