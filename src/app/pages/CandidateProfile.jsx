import { useState, useRef,useEffect  } from 'react';
import { User, Briefcase, Edit3, Plus, X, Star, Award, Upload, FileText, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  showSuccess,
  showError,
  showConfirm,
  showLoading,
  closeAlert,
} from "../../utils/alert";
import api from '../../utils/api.js';


const profileData = {
  name: 'John Doe',
  initials: 'JD',
  title: 'Senior Drilling Engineer',
  location: 'Houston, TX',
  email: 'john.doe@email.com',
  phone: '+1 (555) 012-3456',
  website: 'johndoe.dev',
  about: 'Experienced drilling engineer with 8+ years in deepwater and HPHT operations. Specialized in well planning, risk assessment, and drilling optimization for major energy companies across the Gulf of Mexico and North Sea.',
  skills: ['Drilling Engineering', 'Well Planning', 'Deepwater Operations', 'Risk Assessment', 'HPHT Drilling', 'Leadership', 'Data Analysis'],
  experience: [
    { id: 1, company: 'Shell Energy', title: 'Senior Drilling Engineer', period: '2020 – Present', location: 'Houston, TX', description: 'Lead drilling operations for deepwater projects in the Gulf of Mexico. Managed teams of 15+ engineers and achieved 20% reduction in NPT.' },
    { id: 2, company: 'BP Operations', title: 'Drilling Engineer', period: '2017 – 2020', location: 'Aberdeen, UK', description: 'Designed and executed drilling programs for North Sea assets. Expert in HPHT well operations and complex completion designs.' },
  ],
  education: [
    { id: 1, school: 'University of Houston', degree: 'B.Sc. Petroleum Engineering', period: '2013 – 2017', gpa: '3.8 GPA' },
  ],
  certifications: ['IWCF Well Control – Subsea Level 3', 'OPITO BOSIET Offshore Safety', 'API Well Control Certified'],
};

function EditableSection({ title, icon: Icon, children, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        <button onClick={onEdit} className="flex items-center space-x-1.5 text-sm text-primary hover:underline font-semibold">
          <Edit3 className="w-4 h-4" /><span>Edit</span>
        </button>
      </div>
      {children}
    </div>
  );
}

export function CandidateProfile() {

    const { user, logout } = useAuth();

    console.log('User from context:', user?.name || user?.email); // Debugging line

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD';  

  const [experiences, setExperiences] = useState(profileData.experience);
  const [showExpDrawer, setShowExpDrawer] = useState(false);
  const [editExp, setEditExp] = useState(null);

const [certifications, setCertifications] = useState([
  "IWCF Well Control – Subsea Level 3",
  "OPITO BOSIET Offshore Safety",
  "API Well Control Certified"
]);

const [showCertDrawer, setShowCertDrawer] = useState(false);
const [certInput, setCertInput] = useState('');
const [editIndex, setEditIndex] = useState(null);


const [educations, setEducations] = useState([]);
const [courses, setCourses] = useState([]);
const [specializations, setSpecializations] = useState([]);

const openCertDrawer = (cert = '', index = null) => {
  setCertInput(cert);
  setEditIndex(index);
  setShowCertDrawer(true);
};



  const [expForm, setExpForm] = useState({
  id: null,
  company: '',
  title: '',
  period: '',
  location: '',
  description: ''
});


const openExpDrawer = (item = null) => {
  setEditExp(item);

  setExpForm({
    id: item?.id || null,
    company: item?.company || '',
    title: item?.title || '',
    period: item?.period || '',
    location: item?.location || '',
    description: item?.description || ''
  });

  setShowExpDrawer(true);
};




const handleSaveExperience = () => {
  if (!expForm.company || !expForm.title) return;

  if (editExp) {
    // ✏️ UPDATE
    setExperiences(prev =>
      prev.map(e => (e.id === expForm.id ? expForm : e))
    );
  } else {
    // ➕ ADD
    const newExp = {
      ...expForm,
      id: Date.now()
    };
    setExperiences(prev => [...prev, newExp]);
  }

  setShowExpDrawer(false);
};

const handleDeleteExperience = (id) => {
  setExperiences(prev => prev.filter(e => e.id !== id));
};

  const [skills, setSkills] = useState(profileData.skills);
  const [skillInput, setSkillInput] = useState('');


  const [usedskills, setusedSkills] = useState([]);
const [usedskillInput, setusedSkillInput] = useState('');


  const [about, setAbout] = useState(profileData.about);
  const [editingAbout, setEditingAbout] = useState(false);
  const [savedAbout, setSavedAbout] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);


  const aboutRef = useRef(null);
const skillsRef = useRef(null);
const expRef = useRef(null);
const eduRef = useRef(null);
const certRef = useRef(null);
const resumeRef = useRef(null);


const scrollToSection = (ref) => {
  ref.current?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};


const menu = [
  { label: "About", ref: aboutRef },
  { label: "Key skills", ref: skillsRef },
  { label: "Employment", ref: expRef },
  { label: "Education", ref: eduRef },
  { label: "Certifications", ref: certRef },
  { label: "Resume", ref: resumeRef }
];

  const handleFileSelect = (files) => {
    const valid = Array.from(files).filter(f => f.type === 'application/pdf');
    if (!valid.length) return;
    const newEntries = valid.map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: (f.size / 1024).toFixed(0) + ' KB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setResumes(prev => [...prev, ...newEntries]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const removeResume = (id) => setResumes(prev => prev.filter(r => r.id !== id));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(''); }
  };



  const handleSaveCert = () => {
  if (!certInput.trim()) return;

  if (editIndex !== null) {
    // ✏️ Update
    const updated = [...certifications];
    updated[editIndex] = certInput;
    setCertifications(updated);
  } else {
    // ➕ Add
    setCertifications(prev => [...prev, certInput]);
  }

  setShowCertDrawer(false);
  setCertInput('');
  setEditIndex(null);
};


const handleDeleteCert = (index) => {
  setCertifications(prev => prev.filter((_, i) => i !== index));
};


  const handleAddSkill = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();

    const value = usedskillInput.trim();

    if (!value) return;

    // avoid duplicates
    if (usedskills.includes(value)) {
      setSkillInput('');
      return;
    }

    setusedSkills(prev => [...prev, value]);
    setusedSkillInput('');
  }
};

const removeUsedSkill = (skill) => {
  setusedSkills(prev => prev.filter(s => s !== skill));
};


const [educationList, setEducationList] = useState([]);
const [showEduDrawer, setShowEduDrawer] = useState(false);
const [editEduIndex, setEditEduIndex] = useState(null);
const [eduForm, setEduForm] = useState({
  education: '',
  course: '',
  specialization: '',
  institution: '',
  startYear: '',
  endYear: '',
  courseType: 'Full time'
});


const openEduDrawer = (data = null, index = null) => {
  if (data) {
    setEduForm(data);
    setEditEduIndex(index);
  } else {
    setEduForm({
      education: '',
      course: '',
      specialization: '',
      institution: '',
      startYear: '',
      endYear: '',
      courseType: 'Full time'
    });
    setEditEduIndex(null);
  }

  setShowEduDrawer(true);
};


const handleSaveEducation = () => {
  if (!eduForm.course || !eduForm.institution) return;

  if (editEduIndex !== null) {
    const updated = [...educationList];
    updated[editEduIndex] = eduForm;
    setEducationList(updated);
  } else {
    setEducationList(prev => [...prev, eduForm]);
  }

  setShowEduDrawer(false);
};

const handleDeleteEducation = (index) => {
  setEducationList(prev => prev.filter((_, i) => i !== index));
};

useEffect(() => {
  fetchEducations();
}, []);

const fetchEducations = async () => {
  try {
    const res = await api.get("/admin/education-details/educations/all");

    console.log("Educations API response:", res.data); // Debugging line
    setEducations(res.data.data.data || res.data.data);
  } 
  catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    showError(message);
  }
};

const handleEducationChange = async (value) => {
  setEduForm({
    ...eduForm,
    education: value,
    course: "",
    specialization: "",
  });

  try {
    const res = await api.get("/admin/education-details/courses/all", {
      params: { education_id: value },
    });

    setCourses(res.data.data.data || res.data.data);
  } catch {
    showError("Failed to load courses");
  }
};


const handleCourseChange = async (value) => {
  setEduForm({
    ...eduForm,
    course: value,
    specialization: "",
  });

  try {
    const res = await api.get("/admin/education-details/specializations/all", {
      params: { course_id: value },
    });

    setSpecializations(res.data.data.data || res.data.data);
  } catch {
    showError("Failed to load specializations");
  }
};


return (
  <div className="max-w-7xl mx-auto p-4 space-y-4">

    {/* 🔥 HEADER */}
    <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold">
          {initials}
        </div>

        <div>
          <h2 className="text-lg font-bold">{user.name}</h2>
          <p className="text-xs text-muted-foreground">Profile last updated - Today</p>

          <div className="flex flex-wrap gap-4 text-xs mt-2 text-muted-foreground">
            <span>📍 {profileData.location}</span>
            <span>📞 {profileData.phone}</span>
            <span>✉️ {user.email}</span>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-xl text-sm text-center">
        <p>Add job summary</p>
        <button className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs">
          Add details
        </button>
      </div>
    </div>

    {/* 🔥 MAIN GRID */}
    <div className="grid grid-cols-12 gap-4">

      {/* ✅ SIDEBAR */}
      <div className="col-span-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-sm sticky top-4">
          <h3 className="font-semibold mb-3">Quick links</h3>

           {menu.map((item, i) => (
      <div
        key={i}
        onClick={() => scrollToSection(item.ref)}
        className="flex justify-between py-2 border-b cursor-pointer hover:text-primary"
      >
        <span>{item.label}</span>
        <span className="text-blue-600 text-xs">View</span>
      </div>
    ))}

        </div>
      </div>

      {/* ✅ RIGHT CONTENT */}
      <div className="col-span-9 space-y-5">

        {/* 🔥 ABOUT */}
        <div ref={aboutRef}  className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">About Me</h3>
            <button onClick={() => setEditingAbout(!editingAbout)} className="text-blue-600 text-sm">Edit</button>
          </div>

          {editingAbout ? (
            <>
              <textarea value={about} onChange={e => setAbout(e.target.value)}
                className="w-full border rounded-xl p-3 text-sm mb-3" />

              <div className="flex gap-2">
                <button onClick={() => setEditingAbout(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Save
                </button>
                <button onClick={() => setEditingAbout(false)}
                  className="border px-4 py-2 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{about}</p>
          )}
        </div>

        {/* 🔥 SKILLS */}
        <div ref={skillsRef} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Key Skills</h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map(skill => (
              <span key={skill} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1">
                {skill}
                <button onClick={() => setSkills(skills.filter(s => s !== skill))}>✕</button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="flex-1 border rounded-xl px-3 py-2 text-sm"
              placeholder="Add skill"
            />
            <button onClick={addSkill} className="bg-blue-600 text-white px-4 rounded-lg">+</button>
          </div>
        </div>

        {/* 🔥 EXPERIENCE */}
        <div ref={expRef} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Employment</h3>
            <button onClick={() => openExpDrawer()} className="text-blue-600 text-sm">Add</button>
          </div>

          {experiences.map(exp => (
            <div key={exp.id} className="border-b pb-3 mb-3">

              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-sm text-primary">{exp.company}</p>
                </div>

                <div className="text-xs text-muted-foreground text-right">
                  <div>{exp.period}</div>
                  <div>{exp.location}</div>
                </div>
              </div>

              <p className="text-sm mt-1">{exp.description}</p>

              <div className="flex gap-3 mt-2 text-xs">
                <button onClick={() => openExpDrawer(exp)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDeleteExperience(exp.id)} className="text-red-500">Delete</button>
              </div>

            </div>
          ))}
        </div>

        {/* 🔥 EDUCATION */}
       <div ref={eduRef} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold text-foreground">Education</h3>

    <button
      onClick={() => openEduDrawer()}
      className="text-sm font-semibold text-secondary"
    >
      + Add
    </button>
  </div>

  {/* EMPTY STATE */}
  {educationList.length === 0 && (
    <p className="text-sm text-muted-foreground">
      No education added yet. Click “Add” to include your education.
    </p>
  )}

  {/* LIST */}
  <div className="space-y-4">
    {educationList.map((edu, index) => (
      <div
        key={index}
        className="flex justify-between items-start border-b last:border-none pb-4"
      >

        {/* LEFT CONTENT */}
        <div>

          {/* DEGREE */}
          <h4 className="font-semibold text-foreground">
            {edu.course} {edu.specialization && `(${edu.specialization})`}
          </h4>

          {/* SCHOOL */}
          <p className="text-sm text-muted-foreground">
            {edu.institution}
          </p>

          {/* DETAILS */}
          <p className="text-xs text-muted-foreground mt-1">
            {edu.startYear} - {edu.endYear} • {edu.courseType}
          </p>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 text-xs mt-1">
          <button
            onClick={() => openEduDrawer(edu, index)}
            className="text-blue-600 font-semibold"
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteEducation(index)}
            className="text-red-500 font-semibold"
          >
            Delete
          </button>
        </div>

      </div>
    ))}
  </div>

      </div>

        {/* 🔥 CERTIFICATIONS */}
        <div ref={certRef} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Certifications</h3>
            <button onClick={() => openCertDrawer()} className="text-blue-600 text-sm">Add</button>
          </div>

          {certifications.map((cert, i) => (
            <div key={i} className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded mb-2">
              <span>{cert}</span>

              <div className="flex gap-2 text-xs">
                <button onClick={() => openCertDrawer(cert, i)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDeleteCert(i)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 RESUME */}
        <div ref={resumeRef} className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Resume</h3>

          <div className="border-dashed border-2 rounded-xl p-6 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}>
            Upload Resume
          </div>
        </div>

      </div>
    </div>

    {/* 🔥 KEEP YOUR DRAWERS BELOW (NO CHANGE) */}
    {showExpDrawer && (
  <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

    <div className="w-[500px] bg-white h-full p-6 overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Employment</h2>
        <button onClick={() => setShowExpDrawer(false)}>✕</button>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Details like job title, company name, etc, help employers understand your work
      </p>

      {/* Current Employment */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Is this your current employment?</p>
        <div className="flex gap-4 text-sm">
          <label><input type="radio" name="current" /> Yes</label>
          <label><input type="radio" name="current" /> No</label>
        </div>
      </div>

      {/* Employment Type */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Employment type</p>
        <div className="flex gap-4 text-sm">
          <label><input type="radio" name="type" /> Full-time</label>
          <label><input type="radio" name="type" /> Internship</label>
        </div>
      </div>

      {/* Experience */}
      <div className="grid grid-cols-2 gap-3 mb-4">
      

        <select className="border rounded-lg px-3 py-2 text-sm">
        {[...Array(31)].map((_, i) => (
          <option key={i} value={i}>
            {i} {i === 1 ? 'Year' : 'Years'}
          </option>
        ))}

        <option value="30+">30+ Years</option>
      </select>
        <select className="border rounded-lg px-3 py-2 text-sm">
  {[...Array(12)].map((_, i) => (
    <option key={i} value={i}>
      {i} {i === 1 ? 'Month' : 'Months'}
    </option>
  ))}
</select>
      </div>

      {/* Company */}
      <div className="mb-4">
        <label className="text-sm font-semibold">Current company name *</label>
        <input className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" placeholder="Type your organization" />
      </div>

      {/* Job Title */}
      <div className="mb-4">
        <label className="text-sm font-semibold">Current job title *</label>
        <input className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" placeholder="Type your designation" />
      </div>

      {/* Joining Date */}
      <div className="grid grid-cols-2 gap-3 mb-4">
       <select className="border rounded-lg px-3 py-2 text-sm">
  <option value="">Select Year</option>

  {Array.from(
    { length: new Date().getFullYear() - 1970 + 1 },
    (_, i) => {
      const year = new Date().getFullYear() - i;
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
  )}
</select>
        

         <select className="border rounded-lg px-3 py-2 text-sm">
    <option value="">Select Month</option>

    {[
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ].map((month, index) => (
      <option key={index} value={index + 1}>
        {month}
      </option>
    ))}
  </select>
      </div>

      {/* Salary */}
      <div className="mb-4">
        <label className="text-sm font-semibold">Current salary *</label>
        <input className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" placeholder="12,00,000" />
      </div>

      {/* Skills */}
     <div className="mb-4">
  <label className="text-sm font-semibold">Skills used *</label>

  <div className="border rounded-lg px-3 py-2 mt-1">

    {/* 🔥 TAGS */}
    <div className="flex flex-wrap gap-2 mb-2">
      {usedskills.map((skill, i) => (
        <span
          key={i}
          className="flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium"
        >
          {skill}
          <button
            onClick={() => removeUsedSkill(skill)}
            className="text-red-500"
          >
            ✕
          </button>
        </span>
      ))}
    </div>

    {/* INPUT */}
    <input
      type="text"
      value={usedskillInput}
      onChange={(e) => setusedSkillInput(e.target.value)}
      onKeyDown={handleAddSkill}
      placeholder="Type skill and press Enter"
      className="w-full outline-none text-sm"
    />

  </div>
</div>

      {/* Job Profile */}
      <div className="mb-4">
        <label className="text-sm font-semibold">Job profile</label>

        <div className="border rounded-lg mt-1">
          <div className="p-2 border-b text-xs text-orange-600 font-semibold">
            ✨ Write with AI
          </div>
          <textarea
            className="w-full px-3 py-2 text-sm outline-none"
            rows={4}
            placeholder="Type here..."
            maxLength={4000}
          />
          <div className="text-right text-xs text-muted-foreground px-3 pb-2">
            4000 characters left
          </div>
        </div>
      </div>

      {/* Notice Period */}
      <div className="mb-6">
        <label className="text-sm font-semibold">Notice period *</label>
       
       <select className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary">
  <option value="">Select notice period</option>

  <option value="15_days">15 Days or less</option>
  <option value="1_month">1 Month</option>
  <option value="2_months">2 Months</option>
  <option value="3_months">3 Months</option>
  <option value="more_than_3">More than 3 Months</option>
  <option value="serving">Serving Notice Period</option>
</select>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowEmploymentDrawer(false)}
          className="text-sm text-muted-foreground"
        >
          Cancel
        </button>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold">
          Save
        </button>
      </div>

    </div>
  </div>
          )}

    {showCertDrawer && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">

    {/* DRAWER */}
    <div className="w-[420px] bg-white h-full flex flex-col shadow-2xl animate-slideInRight">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="text-lg font-bold text-foreground">
          {editIndex !== null ? 'Edit Certification' : 'Add Certification'}
        </h2>

        <button
          onClick={() => setShowCertDrawer(false)}
          className="text-muted-foreground hover:text-red-500 text-lg"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="p-5 flex-1 overflow-y-auto">

        <label className="text-sm font-semibold text-foreground mb-2 block">
          Certification Name
        </label>

        <input
          value={certInput}
          onChange={(e) => setCertInput(e.target.value)}
          placeholder="e.g. IWCF Well Control Level 3"
          className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
        />

        {/* HELPER TEXT */}
        <p className="text-xs text-muted-foreground mt-2">
          Add certifications to improve your profile visibility.
        </p>

      </div>

      {/* FOOTER */}
      <div className="border-t px-5 py-4 flex justify-end gap-3 bg-white">

        <button
          onClick={() => setShowCertDrawer(false)}
          className="px-4 py-2 rounded-xl border text-sm text-muted-foreground hover:bg-muted/40"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveCert}
          className="px-5 py-2 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
        >
          Save
        </button>

      </div>

    </div>
  </div>
    )}

    {showEduDrawer && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">

    <div className="w-[500px] bg-white h-full flex flex-col shadow-2xl animate-slideInRight">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-bold">
          {editEduIndex !== null ? "Edit Education" : "Add Education"}
        </h2>

        <button
          onClick={() => setShowEduDrawer(false)}
          className="text-muted-foreground hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-4 overflow-y-auto">

        {/* EDUCATION LEVEL */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Education *
          </label>
          <select
          value={eduForm.education}
          onChange={(e) => handleEducationChange(Number(e.target.value))}
          className="w-full border rounded-xl px-4 py-3 text-sm"
        >
          <option value="">Select</option>

          {educations.map((edu) => (
            <option key={edu.id} value={edu.id}>
              {edu.name}
            </option>
          ))}
        </select>
        </div>

        {/* COURSE */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Course *
          </label>
          <select
  value={eduForm.course}
  onChange={(e) => handleCourseChange(Number(e.target.value))}
  className="w-full border rounded-xl px-4 py-3 text-sm"
>
  <option value="">Select</option>

  {courses.map((c) => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
        </select>
        </div>

        {/* SPECIALIZATION */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Specialization
          </label>
         <select
  value={eduForm.specialization}
  onChange={(e) =>
    setEduForm({ ...eduForm, specialization: Number(e.target.value) })
  }
  className="w-full border rounded-xl px-4 py-3 text-sm"
>
  <option value="">Select</option>

  {specializations.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
        </select>
        </div>

        {/* UNIVERSITY */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            University / Institute *
          </label>
          <input
            value={eduForm.institution}
            onChange={(e) =>
              setEduForm({ ...eduForm, institution: e.target.value })
            }
            className="w-full border rounded-xl px-4 py-3 text-sm"
            placeholder="Enter institute name"
          />
        </div>

        {/* COURSE TYPE */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Course type *
          </label>

          <div className="flex gap-4 text-sm">
            {["Full time", "Part time", "Distance"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={eduForm.courseType === type}
                  onChange={() =>
                    setEduForm({ ...eduForm, courseType: type })
                  }
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* YEAR */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={eduForm.startYear}
            onChange={(e) =>
              setEduForm({ ...eduForm, startYear: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option>Select Start Year</option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year}>{year}</option>;
            })}
          </select>

          <select
            value={eduForm.endYear}
            onChange={(e) =>
              setEduForm({ ...eduForm, endYear: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option>Select End Year</option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year}>{year}</option>;
            })}
          </select>
        </div>

        {/* GRADING SYSTEM */}
      <div>
        <label className="text-sm font-semibold mb-1 block">
          Grading system *
        </label>

        <select
          value={eduForm.gradingSystem || ''}
          onChange={(e) =>
            setEduForm({ ...eduForm, gradingSystem: e.target.value })
          }
          className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
        >
          <option value="">Select grading system</option>

          <option value="cgpa_10">CGPA out of 10</option>
          <option value="cgpa_4">CGPA out of 4</option>
          <option value="percentage">Percentage</option>
          <option value="grade">Grade</option>
        </select>
      </div>

      </div>

      {/* FOOTER */}
      <div className="border-t px-6 py-4 flex justify-end gap-3">

        <button
          onClick={() => setShowEduDrawer(false)}
          className="px-4 py-2 rounded-xl border text-sm"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveEducation}
          className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
        >
          Save
        </button>

      </div>

    </div>
  </div>
  )}

  </div>
);

}
