import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Globe, Briefcase, Star, Calendar, ChevronRight, DollarSign, Clock, Building2, Award, TrendingUp, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

import { useEffect, useState } from 'react';
import api from '../../utils/api';
// import api from '../api';



// Fallback data for companies not in our map
const defaultCompany = {
  id: 0, name: 'Energy Company', slug: 'energy-company', logo: '🏭', industry: 'O&G', location: 'Houston, TX',
  employees: '10,000+', openJobs: 20, rating: 4.0, reviews: 500, founded: 2000, website: 'company.com',
  verified: true, tags: ['Upstream', 'Operations'],
  description: 'Leading energy company',
  longDesc: 'A leading company in the global oil & gas sector with decades of industry experience.',
  benefits: ['Competitive salary', 'Health insurance', 'Retirement plan', 'PTO', 'Career development'],
  culture: ['Safety-first', 'Innovation', 'Teamwork'],
};


export function CompanyDetail() {
  const { slug } = useParams();
  // const company = (slug && companiesData[slug]) || { ...defaultCompany, name: slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Company' };
  // const jobs = (slug && jobsByCompany[slug]) || jobsByCompany['shell-energy'];

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
  if (!slug) return;

  setLoading(true);

  api.get(`/companies/${slug}`)
    .then(res => {
      const c = res.data.data;

      setCompany({
        id: c.id,
        name: c.company_name,
        slug: c.slug,
        logo: c.logo, // ✅ URL
        industry: c.industry,
        location: c.headquarters,
        employees: c.company_size,
        openJobs: c.jobs_count,
        founded: c.founded,
        website: c.website,
        verified: true,

        description: c.message,
        longDesc: c.message,

        benefits: c.benefits_perks || [],
        culture: c.culture_values || [],

        linkedin: c.linkedin,
        twitter: c.twitter,
        facebook: c.facebook,
        youtube: c.youtube,
         tags: [],
      });

      setJobs(c.jobs || []);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => setLoading(false));

}, [slug]);

if (loading || !company) {
  return <div className="p-10 text-center">Loading...</div>;
}


  return (
    <div className="min-h-screen bg-background">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/companies" className="hover:text-primary transition-colors">Companies</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{company.name}</span>
          </div>
        </div>
      </div>

      {/* Company hero */}
      <div className="bg-white border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex items-start space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-4xl shadow-md flex-shrink-0">
               
               {company.logo ? (
            <img
              src={company.logo}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            '🏢'
          )}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                  {company.verified && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm" title="Verified Employer">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  {/* <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(company.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted/40'}`} />
                    ))}
                    <span className="text-sm font-bold text-foreground ml-1">{company.rating}</span>
                    <span className="text-sm text-muted-foreground">({company.reviews?.toLocaleString()} reviews)</span>
                  </div> */}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1.5"><MapPin className="w-4 h-4 text-primary" /><span>{company.location}</span></span>
                  <span className="flex items-center space-x-1.5"><Users className="w-4 h-4 text-primary" /><span>{company.employees} employees</span></span>
                  <span className="flex items-center space-x-1.5"><Calendar className="w-4 h-4 text-primary" /><span>Founded {company.founded}</span></span>
                  <span className="flex items-center space-x-1.5">
                    <Globe className="w-4 h-4 text-primary" />
                    <a href={`https://${company.website}`} target="_blank" rel="noopener" className="text-primary hover:underline">{company.website}</a>
                    {/* Social Media Icons */}
                    <span className="flex items-center gap-2 ml-2">
                      {company.linkedin && (
                          <a href={company.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-blue-700 hover:text-blue-900">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.034 0 3.595 1.997 3.595 4.59v5.606z"/></svg>
                      </a>
                      )}
                      
                       {company.twitter  && (
                           <a href={company.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-sky-500 hover:text-sky-700">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z"/></svg>
                      </a>

                       )}
                      {company.facebook  && (
                      <a href={company.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-600 hover:text-blue-800">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.324-1.326z"/></svg>
                      </a>
                      )}


                       {company.youtube   && (
                      <a href={company.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-red-600 hover:text-red-800">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.324-1.326z"/></svg>
                      </a>
                      )}


                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link to={`/jobs?company=${company.slug}`}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shine-effect hover:shadow-lg transition-all"
                style={{ background: 'var(--gradient-primary)' }}>
                <Briefcase className="w-4 h-4" />
                <span>View {company.openJobs} Jobs </span>
              </Link>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {company.tags.map(tag => (
              <span key={tag} className="text-sm text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">About {company.name}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{company.longDesc}</p>
            </motion.div>

            {/* Culture */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">Culture & Values</h2>
              <div className="flex flex-wrap gap-3">
                {company.culture.map((c) => (
                  <span key={c} className="inline-flex items-center space-x-2 px-4 py-2.5 bg-background border border-border/60 rounded-xl text-sm font-medium text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>{c}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">Benefits & Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {company.benefits.map((b) => (
                  <div key={b} className="flex items-center space-x-3 p-3 bg-background border border-border/60 rounded-xl">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </div>
                    <span className="text-sm text-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Open Jobs */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-border/60 shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-border/60">
                <h2 className="text-xl font-bold text-foreground">Open Positions</h2>
                <span className="text-sm text-muted-foreground">{company.openJobs} jobs</span>
              </div>
              <div className="divide-y divide-border/50">
                {jobs.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
                    <Link to={`/jobs/${job.id}`} className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors group">
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{job.location}</span></span>
                          <span className="flex items-center space-x-1"><DollarSign className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600 font-semibold">{job.salary}</span></span>
                          <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{job.posted}</span></span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{job.job_type}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="p-5 border-t border-border/60">
                <Link to={`/jobs?company=${company.slug}`} className="text-primary hover:underline font-semibold text-sm">
                  View all {company.slug} positions →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Company Overview</h3>
              <div className="space-y-3">
                {[
                  { icon: Building2, label: 'Industry', value: company.industry },
                  { icon: Users, label: 'Employees', value: company.employees },
                  { icon: Calendar, label: 'Founded', value: company.founded.toString() },
                  { icon: Globe, label: 'Website', value: company.website },
                  { icon: MapPin, label: 'Headquarters', value: company.location },
                  { icon: Briefcase, label: 'Open Roles', value: company.openJobs.toString() },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

           

            {/* CTA */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl p-6 text-center" style={{ background: 'var(--gradient-hero)' }}>
              <h3 className="text-lg font-bold text-white mb-2">Interested in {company.name}?</h3>
              <p className="text-blue-100/70 text-sm mb-5">Create a profile to be discovered by their talent team.</p>
              <Link to="/candidate/register" className="block bg-white text-primary font-bold py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                Create Free Profile
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
