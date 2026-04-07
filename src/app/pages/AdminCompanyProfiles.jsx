import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle, Clock, Mail, Phone, Globe, Briefcase, ChevronDown, ChevronUp, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../utils/api";

const REQUESTS_KEY = "rwj_company_requests";

function getRequests() {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function AdminCompanyProfiles() {

  const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);



const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [lastPage, setLastPage] = useState(1);


  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Refresh when navigating back to this page.
  useEffect(() => {
    setRequests(getRequests());
  }, []);

  const approved = useMemo(
    () => requests.filter((r) => String(r?.status).toLowerCase() === "approved"),
    [requests],
  );

  const counts = useMemo(() => ({ approved: approved.length }), [approved.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return approved;
    return approved.filter((r) => {
      const hay = [
        r.companyName,
        r.contactName,
        r.email,
        r.phone,
        r.website,
        r.industry,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [approved, query]);

  const toggleExpanded = (id) => setExpandedId((prev) => (prev === id ? null : id));

const fetchCompanies = async (page = 1, searchTerm = "") => {
  try {
    const res = await api.get("/admin/company-requests/approved-companies", {
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
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const delay = setTimeout(() => {
    setCurrentPage(1); // reset page
    fetchCompanies(1, search);
  }, 500);

  return () => clearTimeout(delay);
}, [search]);


  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Approved Company Profiles</h2>
        <p className="text-sm text-muted-foreground">
          Showing {counts.approved} approved {counts.approved === 1 ? "company" : "companies"}.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={ search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, email, industry..."
              className="w-full pl-9 pr-4 py-3 border border-border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/60 p-10 text-center text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No approved company profiles found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const expanded = expandedId === req.id;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 p-5 flex-wrap">
                  <div className="flex items-start space-x-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground truncate">{req.company_name || "Company"}</h3>
                      <p className="text-sm text-muted-foreground truncate">{req.contact_person ? `${req.contact_person} · ` : ""}{req.users?.email}</p>
                      <div className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Approved {req.approvedAt ? formatDate(req.approvedAt) : "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approved
                    </span>
                    <button
                      onClick={() => toggleExpanded(req.id)}
                      className="p-2 rounded-xl border border-border hover:bg-muted/40 text-muted-foreground transition-all"
                      aria-label={expanded ? "Collapse company details" : "Expand company details"}
                    >
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border/60"
                    >
                      <div className="p-5 bg-muted/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {req.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4 text-muted-foreground/60" />
                            {req.phone}
                          </div>
                        )}
                        {req.website && (
                          <div className="flex items-center gap-2 text-muted-foreground break-words">
                            <Globe className="w-4 h-4 text-muted-foreground/60" />
                            <a
                              href={`https://${String(req.website).replace(/^https?:\/\//, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {req.website}
                            </a>
                          </div>
                        )}
                        {req.industry?.name && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="w-4 h-4 text-muted-foreground/60" />
                            {req.industry?.name}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 text-muted-foreground/60" />
                          {req.users?.email}
                        </div>

                        {req.message && (
                          <div className="sm:col-span-2 bg-white border border-border/60 rounded-xl p-3.5">
                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                              Company Message
                            </p>
                            <p className="text-foreground leading-relaxed">{req.message}</p>
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


      <div className="flex justify-center items-center gap-3 mt-6">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="px-4 py-2 border rounded-xl disabled:opacity-50"
  >
    Prev
  </button>

  <span className="text-sm font-semibold">
    Page {currentPage} of {lastPage}
  </span>

  <button
    disabled={currentPage === lastPage}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="px-4 py-2 border rounded-xl disabled:opacity-50"
  >
    Next
  </button>

</div>
    </div>
  );
}

