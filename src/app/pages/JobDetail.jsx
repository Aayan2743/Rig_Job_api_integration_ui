import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Building2, Users, ChevronRight, Bookmark, Share2, CheckCircle, Globe, Star, Award } from 'lucide-react';
import { motion } from 'motion/react';

import { ApplyNowPaymentModal } from '../components/ApplyNowPaymentModal.jsx';
import { useEffect, useState } from "react";
import api from "../../utils/api.js";


// const relatedsafeJob = [
//   { id: 2, title: 'Drilling Supervisor', company: 'Shell Energy', location: 'Aberdeen, UK', salary: '$100k–$140k', type: 'Full-time' },
//   { id: 3, title: 'Completion Engineer', company: 'Shell Energy', location: 'Houston, TX', salary: '$110k–$160k', type: 'Full-time' },
//   { id: 4, title: 'Well Engineer', company: 'BP Operations', location: 'Gulf of Mexico', salary: '$105k–$155k', type: 'Contract' },
// ];

const tabs = ['Overview', 'Responsibilities', 'Requirements', 'Benefits'];

export  function JobDetail() {

  const { id } = useParams();

const [safeJob, setsafeJob] = useState(null);
const [relatedsafeJob, setRelatedsafeJob] = useState([]);
const [loading, setLoading] = useState(false);




  const [activeTab, setActiveTab] = useState('Overview');
  const [saved, setSaved] = useState(false);
  // const [applied] = useState(false);


  const [alreadyApplied, setAlreadyApplied] = useState(false);
const [loadingApplyStatus, setLoadingApplyStatus] = useState(true);


  useEffect(() => {
  fetchsafeJob();
}, [id]);


useEffect(() => {
  const checkApplied = async () => {
    try {
      const res = await api.post("/candidate/check-applied", {
       job_id: id, // 🔥 must pass
      });

      setAlreadyApplied(res.data.already_applied);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApplyStatus(false);
    }
  };

  if (id) {
    checkApplied();
  }
}, [id]);

const fetchsafeJob = async () => {
  try {
    setLoading(true);

    const res = await api.get(`/companies/jobs/${id}`);

    console.log('safeJob details response:', res.data.data.similar_jobs); // Debug log
    if (res.data.success) {
      setsafeJob(res.data.data);
      setRelatedsafeJob(res.data.data.similar_jobs || []); // Assuming related jobs are returned in this field
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


const getPostedTime = (date) => {
  const now = new Date();
  const postedDate = new Date(date);
  const diffTime = Math.abs(now - postedDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

const formatDeadline = (date) => {
  const deadline = new Date(date);
  const now = new Date();

  if (deadline < now) return "Expired";

  return deadline.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


const getDaysLeft = (date) => {
  const deadline = new Date(date);
  const now = new Date();
  const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return "Expired";
  return `${diff} days left`;
};




const safesafeJob = {
  ...safeJob,

  // ✅ SAFE OBJECTS
  company: safeJob?.company || {},
  category: safeJob?.category || {},

  // ✅ FIXED FIELDS
  salary: `$${safeJob?.salary_min || 0}k - $${safeJob?.salary_max || 0}k`,
  type: safeJob?.job_type || '',
  experience: safeJob?.experience_level || '',
  deadline: safeJob?.dead_line
    ? new Date(safeJob.dead_line).toLocaleDateString()
    : 'N/A',

  // ✅ FIX MISSING FIELDS (NO CRASH)
  posted: safeJob?.created_at
    ? new Date(safeJob.created_at).toLocaleDateString()
    : '',

  applicants: safeJob?.applicants || 0,

  // ✅ CONVERT STRINGS → ARRAY (CRITICAL FIX)
  responsibilities: typeof safeJob?.responsibilities === 'string'
    ? safeJob.responsibilities.split('\n')
    : safeJob?.responsibilities || [],

  requirements: typeof safeJob?.requirements === 'string'
    ? safeJob.requirements.split('\n')
    : safeJob?.requirements || [],

  benefits: safeJob?.benefits || [],
  skills: safeJob?.skills || [],
};


const handleSave = async () => {
  if (!safeJob?.id) return;

  try {
    if (saved) {
      await api.delete('/candidate/remove-job', {
        data: { job_id: safeJob.id },
      });
      setSaved(false);
    } else {
      await api.post('/candidate/save-job', {
        job_id: safeJob.id,
      });
      setSaved(true);
    }
  } catch (err) {
    console.error(err);
  }
};


useEffect(() => {
  if (!safeJob?.id) return;

  const checkSaved = async () => {
    try {
      const res = await api.get(`/candidate/saved-jobs/check/${safeJob.id}`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error(err);
    }
  };

  checkSaved();
}, [safeJob?.id]);


if (loading || !safeJob) {
  return <div className="p-10 text-center">Loading safeJob...</div>;
}

  return (
    <div className="min-h-screen bg-background">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/Jobs" className="hover:text-primary transition-colors">Jobs</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate">{safeJob.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* safeJob Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm"
            >
              {/* Gradient accent bar */}
              <div className="h-1.5 w-full" style={{ background: 'var(--gradient-primary)' }} />

              <div className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-4xl flex-shrink-0 shadow-sm">
                    {safeJob?.company?.image ? (
                      <img src={safeJob.company.image} className="w-full h-full object-cover" />
                    ) : '🏢'}
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{safeJob.title}</h1>
                      <p className="text-muted-foreground font-medium flex items-center space-x-1.5">
                        <Building2 className="w-4 h-4" />
                        {/* <span>{safeJob.company}</span> */}
                        <Link to={`/companies/${safeJob?.company?.slug}`} className="block text-center text-primary hover:text-primary/80 font-semibold text-sm transition-colors hover:underline">
                 {safeJob?.company?.company_name}
              </Link>
                      </p>
                    </div>
                  </div>


                  {/* <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => setSaved(!saved)}
                      className={`p-2.5 rounded-xl border transition-all ${saved ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border hover:bg-muted/50 text-muted-foreground'}`}
                    >
                      <Bookmark className={`w-5 h-5 ${saved ? 'fill-primary' : ''}`} />
                    </button>
                    <button className="p-2.5 rounded-xl border border-border hover:bg-muted/50 text-muted-foreground transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div> */}

                  <div className="flex items-center space-x-2 flex-shrink-0">
  
  <button
    onClick={handleSave}
    className={`p-2.5 rounded-xl border transition-all ${
      saved
        ? 'bg-primary/10 border-primary/30 text-primary'
        : 'border-border hover:bg-muted/50 text-muted-foreground'
    }`}
  >
    <Bookmark className={`w-5 h-5 ${saved ? 'fill-primary' : ''}`} />
  </button>

  <button
    onClick={() => {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }}
    className="p-2.5 rounded-xl border border-border hover:bg-muted/50 text-muted-foreground transition-all"
  >
    <Share2 className="w-5 h-5" />
  </button>

</div>


                </div>

                {/* Meta tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    { icon: MapPin, text: safeJob.location, cls: 'bg-blue-50 text-blue-700' },
                    { icon: Briefcase, text: safeJob.job_type, cls: 'bg-emerald-50 text-emerald-700' },
                    { icon: DollarSign, text: `${safeJob.salary_min} - ${safeJob.salary_max}`, cls: 'bg-amber-50 text-amber-700' },
                    { icon: Award, text: safeJob.experience_level, cls: 'bg-purple-50 text-purple-700' },
                  ].map(({ icon: Icon, text, cls }) => (
                    <span key={text} className={`inline-flex items-center space-x-1.5 text-sm font-medium px-3.5 py-1.5 rounded-full ${cls}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{text}</span>
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-5 text-sm text-muted-foreground pt-4 border-t border-border/60">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4" />
                    <span> Posted {getPostedTime(safeJob.created_at)}</span>
                    
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4" />
                    <span>{safeJob.applicants} applicants</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span className="text-red-500 font-medium">Deadline:  {formatDeadline(safeJob.dead_line)} ({getDaysLeft(safeJob.dead_line)}) </span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
            >
              <div className="flex border-b border-border/60 px-4">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-4 text-sm font-semibold transition-colors ${
                      activeTab === tab
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'Overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-xl font-bold text-foreground mb-4"></h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{safeJob.description}</p>

                    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Required Skills </h2>
                    <div className="flex flex-wrap gap-2">
                      {safeJob.skills.map(skill => (
                        <span key={skill} className="bg-primary/8 text-primary px-4 py-2 rounded-xl font-semibold text-sm border border-primary/15 hover:bg-primary/15 transition-colors cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

              {activeTab === 'Responsibilities' && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-xl font-bold text-foreground mb-5">
      Key Responsibilities
    </h2>

    <ul className="space-y-3.5">
      {safeJob?.responsibilities?.split('\n')?.map((item, i) => (
        <li key={i} className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle className="w-3 h-3 text-primary" />
          </div>
          <span className="text-muted-foreground text-sm leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  </motion.div>
)}

                {activeTab === 'Requirements' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-xl font-bold text-foreground mb-5">Requirements & Qualifications</h2>
                    <ul className="space-y-3.5">
                     

                      {
                        safeJob?.requirements?.split('\n').map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                      </li>
                    ))
                      }
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'Benefits' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-xl font-bold text-foreground mb-5">Benefits & Perks</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {safeJob.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start space-x-3 bg-background rounded-xl p-3.5 border border-border/60">
                          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          </div>
                          <span className="text-muted-foreground text-sm leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Apply Card — Sticky */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-border/60 p-6 sticky top-24 shadow-sm"
            >
              {/* {applied ? (
                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-3 shine-effect bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                  disabled
                >
                  ✓ Application Sent!
                </button>
              ) : (
                <ApplyNowPaymentModal
                  feeAmount={5}
                  jobId={safeJob.id}
                  feeLabel="Application Fee"
                  paymentPath="/payment"
                  triggerLabel={"Apply Now"}
                  triggerClassName="w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-3 shine-effect text-white hover:shadow-lg hover:scale-[1.02]"
                  triggerStyle={{ background: 'var(--gradient-primary)' }}
                />
              )} */}




              {loadingApplyStatus ? (
  <button className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-500">
    Checking...
  </button>
) : alreadyApplied ? (
  <button
    type="button"
    className="w-full py-3.5 rounded-xl font-bold text-sm mb-3 bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
    disabled
  >
    ✓ Already Applied
  </button>
) : (
  <ApplyNowPaymentModal
    feeAmount={5}
    jobId={safeJob.id}
    feeLabel="Application Fee"
    paymentPath="/payment"
    triggerLabel={"Apply Now"}
    triggerClassName="w-full py-3.5 rounded-xl font-bold text-sm mb-3 text-white hover:shadow-lg hover:scale-[1.02]"
    triggerStyle={{ background: 'var(--gradient-primary)' }}
  />
)}
              <button
                onClick={() => setSaved(!saved)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all border ${
                  saved ? 'bg-primary/8 text-primary border-primary/20' : 'border-border text-foreground hover:bg-muted/50'
                }`}
              >
                {saved ? '✓ Saved' : 'Save Job'}
              </button>

              <div className="mt-5 pt-5 border-t border-border/60 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary </span>
                  <span className="font-semibold text-emerald-600">  ${safeJob.salary_min} – ${safeJob.salary_max}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Type</span>
                  <span className="font-medium">{safeJob.job_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{safeJob.experience_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applicants</span>
                  <span className="font-medium">{safeJob.applicants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium text-red-500">{formatDeadline(safeJob.dead_line)} ({getDaysLeft(safeJob.dead_line)})</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t border-border/60">
                By applying, you agree to our{' '}
                <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
              </p>
            </motion.div>

            {/* Company Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-foreground mb-4">About the Company </h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl">
                  {safeJob.logo}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{safeJob?.company?.company_name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-foreground">{safeJob?.companyInfo?.rating|| 4}</span>
                    <span className="text-xs text-muted-foreground">· Glassdoor</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">company info goes here</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
  {[
    {
      icon: Building2,
      label: 'Industry',
      value: safeJob?.company?.industry?.name || 'N/A',
      isLink: false,
    },
    {
      icon: Users,
      label: 'Employees',
      value: safeJob?.company?.company_size || 'N/A',
      isLink: false,
    },
    {
      icon: Clock,
      label: 'Founded',
      value: safeJob?.company?.founded || 'N/A',
      isLink: false,
    },
    {
      icon: Globe,
      label: 'Website',
      value: safeJob?.company?.website || 'N/A',
      isLink: true, // ✅ important
    },
  ].map(({ icon: Icon, label, value, isLink }) => (
    <div
      key={label}
      className="bg-background rounded-xl p-3 border border-border/60"
    >
      <div className="flex items-center space-x-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>

      {/* ✅ Value */}
      {isLink && value !== 'N/A' ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-primary break-all hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm font-semibold text-foreground break-words">
          {value}
        </span>
      )}
    </div>
  ))}
</div>
              <Link to={`/companies/${safeJob.company.slug}`} className="block text-center text-primary hover:text-primary/80 font-semibold text-sm transition-colors hover:underline">
                View Company Profile → 
              </Link>
              {/* Social Media Icons */}
              <div className="flex justify-center gap-4 mt-4">

                {safeJob?.company?.linkedin && (

                    <a href={safeJob?.company?.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-blue-700 hover:text-blue-900">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.034 0 3.595 1.997 3.595 4.59v5.606z"/></svg>
                </a>
                )}


                 {safeJob?.company?.twitter && (
                    <a href={safeJob?.company?.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-sky-500 hover:text-sky-700">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z"/></svg>
                </a>

                 )}

              {safeJob?.company?.facebook && (

                  <a href={safeJob?.company?.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-600 hover:text-blue-800">
                            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.324-1.326z"/></svg>
                          </a>
              )}


                 {safeJob?.company?.youtube && (

  <a
                href={safeJob?.company?.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-red-600 hover:text-red-800"
              >
                <svg
                  width="22"
                  height="22"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a2.99 2.99 0 0 0-2.107-2.12C19.592 3.5 12 3.5 12 3.5s-7.592 0-9.391.566a2.99 2.99 0 0 0-2.107 2.12C0 8.003 0 12 0 12s0 3.997.502 5.814a2.99 2.99 0 0 0 2.107 2.12C4.408 20.5 12 20.5 12 20.5s7.592 0 9.391-.566a2.99 2.99 0 0 0 2.107-2.12C24 15.997 24 12 24 12s0-3.997-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z"/>
                </svg>
              </a>

                 )}


              
              
              

              
              </div>
            </motion.div>

            {/* Related safeJob */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Similar safeJob</h3>
              <div className="space-y-3">
             


                {relatedsafeJob.map((job) => (
  <Link
    key={job.id}
    to={`/jobs/${job.id}`}
    className="block p-3.5 bg-background rounded-xl border border-border/60 hover:border-primary/30 hover:shadow-md transition-all group"
  >
    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm mb-1">
      {job.title}
    </h4>

    <p className="text-xs text-muted-foreground mb-2">
      {job.company?.name || "No company"}
    </p>

    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground flex items-center space-x-1">
        <MapPin className="w-3 h-3" />
        <span>{job.location || "N/A"}</span>
      </span>

      <span className="text-xs text-emerald-600 font-semibold">
        {job.salary_min && job.salary_max
          ? `₹${job.salary_min}K - ₹${job.salary_max}K`
          : "Not disclosed"}
      </span>
    </div>
  </Link>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
