import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronRight, Star, Users, Globe, TrendingUp, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'motion/react';


import api from "../../utils/api";


const industries = ['All Industries', 'Upstream O&G', 'Integrated O&G', 'Oilfield Services', 'Energy Transition', 'Engineering Services'];
const sizes = ['All Sizes', 'Small (< 5k)', 'Medium (5k–25k)', 'Large (25k–100k)', 'Enterprise (100k+)'];

export function Companies() {

  const [companies, setCompanies] = useState([]);
const [pagination, setPagination] = useState({});
const [loading, setLoading] = useState(false);



  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [sortBy, setSortBy] = useState('Most Jobs');



  useEffect(() => {
  fetchCompanies();
}, [search, selectedIndustry, sortBy]);

const fetchCompanies = async (page = 1) => {
  setLoading(true);
  try {
    const res = await api.get("/companies/companies-all", {
      params: {
        search,
        industry: selectedIndustry,
        sort: sortBy,
        page
      }
    });

    // 🔥 IMPORTANT MAPPING
    const mapped = res.data.data.map(c => ({
      ...c,
      industry: c.industry?.name || "N/A", // ✅ FIX
      logo: c.logo || null,
      tags: c.tags || []
    }));

    setCompanies(mapped);
    setPagination(res.data.pagination);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-white border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Top Employers</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Browse Energy <span className="gradient-text">Companies</span>
          </h1>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-background border border-border rounded-xl px-4 py-3.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
              <input type="text" placeholder="Company name or location..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent w-full outline-none text-foreground text-sm placeholder-muted-foreground" />
              {search && <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground ml-2"><X className="w-4 h-4" /></button>}
            </div>
            <select value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)}
              className="px-4 py-3.5 border border-border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none">
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3.5 border border-border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none">
              {['Most Jobs', 'Highest Rated', 'Alphabetical'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{companies.length}</span> companies found
          </p>
        </div>
      </div>

      {/* Company Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/companies/${company.slug}`}
                className="block bg-white border border-border/60 rounded-2xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group h-full">

                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">

                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-3xl">
  {company.logo ? (
    <img
      src={company.logo}
      alt={company.name}
      className="w-full h-full object-cover rounded-xl"
    />
  ) : (
    "🏢"
  )}
</div>


                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h2 className="font-bold text-foreground group-hover:text-primary transition-colors">{company.name}</h2>
                        {company.verified && (
                          <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center" title="Verified Employer">
                            <span className="text-white text-[9px] font-bold">✓</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold text-foreground">{company.rating}</span>
                        <span className="text-xs text-muted-foreground">· Glassdoor</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-full border border-primary/15 flex-shrink-0">
                    {company.openJobs} jobs
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{company.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center space-x-1 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1.5 rounded-lg">
                    <MapPin className="w-3 h-3" /><span>{company.location}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1.5 rounded-lg">
                    <Users className="w-3 h-3" /><span>{company.employees}</span>
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                 {company.tags?.length > 0 && (
  <div className="flex flex-wrap gap-1.5 mb-4">
    {company.tags.map((tag, i) => (
      <span key={i} className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
        {tag}
      </span>
    ))}
  </div>
)}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Globe className="w-3 h-3" /><span>{company.industry}</span>
                  </span>
                  <span className="text-sm font-semibold text-primary group-hover:underline flex items-center space-x-0.5">
                    <span>View Profile</span><ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-lg">No companies match your search</p>
            <p className="text-sm mt-1">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>


      <div className="flex justify-center mt-6 gap-2">
  {[...Array(pagination.last_page || 1)].map((_, i) => (
    <button
      key={i}
      onClick={() => fetchCompanies(i + 1)}
      className="px-3 py-1 border rounded"
    >
      {i + 1}
    </button>
  ))}
</div>
    </div>
  );
}
