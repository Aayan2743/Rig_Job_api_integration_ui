import { Link } from 'react-router-dom';
import { Building2, Globe, MapPin, Mail, Phone, Users, ShieldCheck, ChevronRight,X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../../utils/api';
import { showSuccess, showError, showLoading, closeAlert } from "../../utils/alert";

export function EmployerCompanyProfile() {
  const { user } = useAuth();
  const PROFILE_KEY = user?.email ? `rwj_company_public_profile:${user.email}` : null;

  const [loading, setLoading] = useState(true);

  const [industries, setIndustries] = useState([]);
  const [error, setError] = useState("");

  // const [form, setForm] = useState({
  //   companyName: 'Shell Energy',
  //   tagline: 'Powering progress with responsible energy.',
  //   industry: 'Oil & Gas',
  //   website: 'https://www.shell.com',
  //   hq: 'Houston, TX',
  //   size: '10,000+',
  //   email: 'careers@shellenergy.com',
  //   phone: '+1 (800) RIG-JOBS',
  //   about:
  //     'Shell Energy is a global energy leader focused on safe, reliable operations and building the workforce of tomorrow. We hire engineers, operations specialists, HSE leaders, and technical professionals for onshore and offshore roles worldwide.',
  //   compliance: 'ISO 45001, ISO 14001, IADC, OPITO',
  // });

  const [form, setForm] = useState({
  companyName: "",
  tagline: "",
  industry: "",
  website: "",
  hq: "",
  size: "",
  email: "",
  phone: "",
  about: "",
  compliance: "",

  contactPerson: "",
  password: "",
  founded: "",

  culture_values: [],
  benefits_perks: [],
  social_links: [],
});

  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  api.get("/admin/industries")
    .then(res => {
      setIndustries(res.data.data);
    })
    .catch(err => console.error(err));
}, []);

  // Load previously saved public details (localStorage) for this company.
useEffect(() => {
  api.get("/employeer/mycompany")
    .then(res => {
      const c = res.data.data;

      setForm({
        companyName: c.company_name || "",
        tagline: c.tagline || "",
        industry: c.industry_id || "",
        website: c.website || "",
        hq: c.headquarters || "",
        size: c.company_size || "",
        
        email: c.company_email || "",
          contactPerson: c.contact_person || "", // ✅ IMPORTANT
        phone: c.phone || "",
        about: c.message || "",
        founded: c.founded || "",
        compliance: c.compliance_certifications || "",


        culture_values: Array.isArray(c.culture_values) ? c.culture_values : [],
  benefits_perks: Array.isArray(c.benefits_perks) ? c.benefits_perks : [],
  social_links: Array.isArray(c.social_links) ? c.social_links : [],
      });
    })
    .catch(err => {
      console.error("Company fetch error:", err);
    });
}, []);


const handleUpdate = async () => {
  try {
    setSaving(true);

    showLoading("Updating...");

    const formData = new FormData();

    // ✅ Basic fields
    formData.append("company_name", form.companyName || "");
    formData.append("contact_person", form.contactPerson || "");
    formData.append("email", form.email || "");
    formData.append("password", form.password || "");

    formData.append("phone", form.phone || "");
    formData.append("website", form.website || "");
    formData.append("industry_id", form.industry || "");

    formData.append("message", form.about || "");
    formData.append("tagline", form.tagline || "");
    formData.append("company_size", form.size || "");
    formData.append("headquarters", form.hq || "");
    formData.append("company_email", form.email || "");
    formData.append("founded", form.founded || "");
    formData.append("compliance_certifications", form.compliance || "");

    // ✅ Arrays (IMPORTANT 🔥)
    (form.culture_values || []).forEach((v, i) => {
      formData.append(`culture_values[${i}]`, v);
    });

    (form.benefits_perks || []).forEach((v, i) => {
      formData.append(`benefits_perks[${i}]`, v);
    });

    (form.social_links || []).forEach((v, i) => {
      formData.append(`social_links[${i}]`, v);
    });

    // ✅ API call
    const res = await api.post(
      `/employeer/update-company`, // ⚠️ replace with your company id
      formData
    );

     closeAlert();

    if (res.data.success) {
      setSaved(true);
      showSuccess("Company updated successfully");
      setTimeout(() => setSaved(false), 2500);
    }

  }
  
  catch (err) {
  console.error(err);
  closeAlert();

  showError(
      err.response?.data?.errors ||
      err.response?.data?.message
    );

  // ✅ GET BACKEND ERROR
  const msg =
    err.response?.data?.errors ||
    err.response?.data?.message ||
    "Something went wrong";

  setError(msg);
} 
  
  
  
  finally {
    setSaving(false);
  }
};




  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-border/60 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-5">Public Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Tagline</label>
                <input
                  name="tagline"
                  value={form.tagline}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Industry</label>
               <select
                  name="industry"
                  value={form.industry}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all appearance-none"
                >
                  <option value="">Select Industry...</option>

                  {industries.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Company Size</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="size"
                    value={form.size}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="website"
                    value={form.website}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Headquarters</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="hq"
                    value={form.hq}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all"
                  />
                </div>
              </div>


              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Contact Person</label>
                <input
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Founded Year</label>
                <input
                  name="founded"
                  value={form.founded}
                  onChange={onChange}
                  placeholder="2024"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white text-sm"
                />
              </div>


                  <div>
  <label className="block text-sm font-semibold mb-2">Culture Values</label>

  <div className="flex flex-wrap gap-2 mb-2">
    {form.culture_values.map((v, i) => (
      <span key={i} className="bg-secondary/10 px-3 py-1 rounded-full text-xs flex items-center gap-1">
        {v}
        <X className="w-3 cursor-pointer"
          onClick={() =>
            setForm(prev => ({
              ...prev,
              culture_values: prev.culture_values.filter((_, idx) => idx !== i)
            }))
          }
        />
      </span>
    ))}
  </div>

  <input
    placeholder="Type and press Enter"
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val) {
          setForm(prev => ({
            ...prev,
            culture_values: [...prev.culture_values, val]
          }));
          e.target.value = "";
        }
      }
    }}
    className="w-full px-4 py-2 border rounded-xl"
  />
</div>


<div>
  <label className="block text-sm font-semibold mb-2">Benefits & Perks</label>

  <div className="flex flex-wrap gap-2 mb-2">
    {form.benefits_perks.map((v, i) => (
      <span key={i} className="bg-green-100 px-3 py-1 rounded-full text-xs flex items-center gap-1">
        {v}
        <X className="w-3 cursor-pointer"
          onClick={() =>
            setForm(prev => ({
              ...prev,
              benefits_perks: prev.benefits_perks.filter((_, idx) => idx !== i)
            }))
          }
        />
      </span>
    ))}
  </div>

  <input
    placeholder="Add benefit"
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val) {
          setForm(prev => ({
            ...prev,
            benefits_perks: [...prev.benefits_perks, val]
          }));
          e.target.value = "";
        }
      }
    }}
    className="w-full px-4 py-2 border rounded-xl"
  />
</div>



<div>
  <label className="block text-sm font-semibold mb-2">Social Links</label>

  {form.social_links.map((link, i) => (
    <div key={i} className="flex gap-2 mb-2">
      <input
        value={link}
        onChange={(e) => {
          const updated = [...form.social_links];
          updated[i] = e.target.value;
          setForm(prev => ({ ...prev, social_links: updated }));
        }}
        className="flex-1 px-3 py-2 border rounded-xl"
      />
      <button
        onClick={() =>
          setForm(prev => ({
            ...prev,
            social_links: prev.social_links.filter((_, idx) => idx !== i)
          }))
        }
      >
        <X className="w-4" />
      </button>
    </div>
  ))}

  <button
    onClick={() =>
      setForm(prev => ({
        ...prev,
        social_links: [...prev.social_links, ""]
      }))
    }
    className="text-sm text-blue-600"
  >
    + Add Link
  </button>
</div>



              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">About</label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={onChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Compliance & Certifications</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <textarea
                    name="compliance"
                    value={form.compliance}
                    onChange={onChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white text-sm transition-all resize-none"
                  />
                </div>
              </div>

            {/* {error && (
  <div className="w-full px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
    {error}
  </div>
)} */}


              <div className="sm:col-span-2 mt-6 flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={!PROFILE_KEY || saving}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-white text-sm font-semibold shine-effect transition-all hover:shadow-md hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)' }}
                >
                  {saving ? "Updating..." : "Update"}
                </button>

                {saved && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
                    ✓ Details saved
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 h-fit"
          >
            <h3 className="text-sm font-bold text-foreground mb-3">Profile Preview</h3>
            <div className="rounded-2xl border border-border/60 p-4 bg-muted/10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold">SE</div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{form.companyName}</p>
                  <p className="text-xs text-muted-foreground truncate">{form.tagline}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5" /><span>{form.hq}</span></p>
                <p className="flex items-center space-x-2"><Globe className="w-3.5 h-3.5" /><span className="truncate">{form.website}</span></p>
                <p className="flex items-center space-x-2"><Users className="w-3.5 h-3.5" /><span>{form.size} employees</span></p>
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/company/jobs"
                className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-md"
                style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
              >
                <span>View Job Listings</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.aside>
    </div>
  );
}
